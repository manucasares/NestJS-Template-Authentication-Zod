import { BaseEntity } from 'src/classes/BaseEntity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Post extends BaseEntity {
  @Column()
  title: string;

  @Column()
  description: string;
}
