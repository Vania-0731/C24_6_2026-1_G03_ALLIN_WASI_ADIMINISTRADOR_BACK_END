import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('admins')
export class AdminUser {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', unique: true })
  userId!: string;

  @OneToOne(() => User, user => user.admin)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'json', nullable: true })
  permissions?: {
    manageUsers: boolean;
    manageProperties: boolean;
    viewDashboard: boolean;
    viewMap: boolean;
  };

  @Column({ type: 'datetime', nullable: true })
  lastLoginAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
