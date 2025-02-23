import { IsEmail } from 'class-validator';
import { BaseEntity } from 'src/classes/BaseEntity';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  password: string;
}
