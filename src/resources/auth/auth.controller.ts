import {
  Body,
  Controller,
  Post,
  ValidationPipe,
  Req,
  Res,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user-dto';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { AllowUnauthorizedRequest } from 'src/classes/AllowUnauthorizedRequest';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @AllowUnauthorizedRequest()
  @Post('login')
  async login(@Res() res: Response, @Body(ValidationPipe) loginDto: LoginDto) {
    const responsePayload = await this.authService.validateLogin(res, loginDto);
    res.status(200).json(responsePayload);
  }

  @AllowUnauthorizedRequest()
  @Post('sign-up')
  async signUp(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @AllowUnauthorizedRequest()
  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const responsePayload = await this.authService.refresh(req, res);
    return res.status(200).json(responsePayload);
  }
}
