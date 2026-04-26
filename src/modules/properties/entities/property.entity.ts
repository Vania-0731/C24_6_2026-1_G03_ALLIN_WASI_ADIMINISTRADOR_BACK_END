import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum PropertyType {
  ROOM = 'room',
  APARTMENT = 'apartment',
  HOUSE = 'house',
}

export enum PropertyStatus {
  AVAILABLE = 'available',
  RENTED = 'rented',
  RESERVED = 'reserved',
  DRAFT = 'draft',
}

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'enum', enum: PropertyType })
  propertyType!: PropertyType;

  @Column({ length: 500 })
  address!: string;

  @Column({ length: 100 })
  city!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monthlyPrice!: number;

  @Column({ type: 'enum', enum: PropertyStatus, default: PropertyStatus.DRAFT })
  status!: PropertyStatus;

  @Column({ default: 0 })
  viewsCount!: number;

  @Column({ default: 0 })
  tours360Count!: number;

  @Column({ nullable: true })
  tour360Url?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ name: 'landlord_id' })
  landlordId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'landlord_id' })
  landlord!: User;
}
