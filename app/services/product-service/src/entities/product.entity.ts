import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'int', nullable: true })
  category_id!: number;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price!: number;

  @Column({ type: 'int', default: 0 })
  stock!: number;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'text', nullable: true })
  image_url!: string;

  @Column({ type: 'timestamp with time zone', default: () => 'NOW()' })
  created_at!: Date;

  @Column({ type: 'boolean', default: true })
  is_active!: boolean;
}
