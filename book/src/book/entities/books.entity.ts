import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import {Optional} from "@nestjs/common";

@Entity('books')
export class BooksEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  user_id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  thumbnail: string;

  @Column()
  genre: string;

  @Column()
  published_at: Date;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}
