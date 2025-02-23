import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post-dto';
import { UpdatePostDto } from './dto/update-post-dto';
import { Uuid } from 'src/types/misc';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  findAll(): Promise<Post[]> {
    return this.postsRepository.find();
  }

  async findOne(postId: Uuid): Promise<Post | null> {
    const post = await this.postsRepository.findOne({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${postId} doesn't exist.`);
    }

    return post;
  }

  create(createPostDto: CreatePostDto): Promise<Post> {
    const post = new Post();
    post.title = createPostDto.title;
    post.description = createPostDto.description;

    return this.postsRepository.save(post);
  }

  async update(
    postId: Uuid,
    updatePostDto: UpdatePostDto,
  ): Promise<Post | null> {
    const updateResult = await this.postsRepository.preload({
      id: postId,
      ...updatePostDto,
    });

    if (!updateResult) {
      throw new NotFoundException(`Post with id ${postId} doesn't exist.`);
    }

    return await this.postsRepository.save(updateResult);
  }

  async delete(postId: Uuid) {
    const deleteResult = await this.postsRepository.softDelete({ id: postId });

    if (!deleteResult.affected) {
      throw new NotFoundException(`Post with id ${postId} doesn't exist.`);
    }

    return { success: true };
  }
}
