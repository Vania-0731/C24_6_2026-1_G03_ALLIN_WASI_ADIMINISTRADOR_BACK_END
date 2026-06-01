import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ReportStatus {
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED',
}

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'reporter_id', nullable: true })
  reporterId?: string;

  @Column({ name: 'reported_user_id', nullable: true })
  reportedUserId?: string;

  @Column({ name: 'conversation_id', nullable: true })
  conversationId?: string;

  @Column({ type: 'text' })
  reason!: string;

  @Column({ type: 'enum', enum: ReportStatus, default: ReportStatus.PENDING })
  status!: ReportStatus;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'reporter_id' })
  reporter?: User;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'reported_user_id' })
  reportedUser?: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
