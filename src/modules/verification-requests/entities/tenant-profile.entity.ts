import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('tenants')
export class TenantProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', unique: true })
  userId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 20 })
  phone: string;

  @Column({ length: 50 })
  code: string;

  @Column({ length: 100 })
  career: string;

  @Column({ length: 50 })
  cicle: string;

  @Column('decimal', { precision: 10, scale: 2 })
  monthly_budget: number;

  @Column({ length: 100 })
  origin_department: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ length: 500, nullable: true })
  studentIDCardUrl: string;

  @Column({ length: 20, default: 'pending' })
  verificationStatus: string;

  @Column({ length: 500, nullable: true })
  verificationMessage: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
