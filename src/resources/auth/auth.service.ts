import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, LoginResponse } from './auth.types';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Envs } from 'src/types/environment';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<Envs>,
  ) {}

  async validateLogin(
    res: Response,
    loginDto: LoginDto,
  ): Promise<LoginResponse> {
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user || user.password !== loginDto.password) {
      throw new BadRequestException('Invalid credentials');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    const payload: JwtPayload = { userId: userWithoutPassword.id };

    const jwt = this.getAccessToken(payload);

    this.setRefreshTokenCookie(res, payload);

    const responsePayload = {
      user: userWithoutPassword,
      token: jwt,
    };

    return responsePayload;
  }

  async refresh(req: Request, res: Response): Promise<LoginResponse> {
    const refreshToken = req.cookies['refresh-token'] as string;

    if (!refreshToken) {
      throw new BadRequestException('No refresh token provided');
    }

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: this.configService.get<string>('SECRET_JWT'),
        },
      );

      this.setRefreshTokenCookie(res, { userId: payload.userId });

      const user = await this.usersRepository.findOne({
        where: { id: payload.userId },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;

      const accessToken = this.getAccessToken({ userId: user.id });

      return {
        token: accessToken,
        user: userWithoutPassword,
      };
    } catch (error: any) {
      console.error(error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private getAccessToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, { expiresIn: '1h' });
  }

  private getRefreshToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, { expiresIn: '14d' });
  }

  private setRefreshTokenCookie(res: Response, payload: JwtPayload) {
    const refreshToken = this.getRefreshToken(payload);
    res.cookie('refresh-token', refreshToken, {
      secure: true,
      httpOnly: true,
      path: '/',
      sameSite: 'none',
    }); // TODO: http only, maxAge and path
  }
}
