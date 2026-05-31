import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum SecuritySeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum SecurityStatus {
  PENDING = 'pending',
  INVESTIGATING = 'investigating',
  RESOLVED = 'resolved',
}

@Entity('security_reports')
export class SecurityReport {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ length: 255, nullable: true })
  location?: string;

  @Column({ type: 'enum', enum: SecuritySeverity, default: SecuritySeverity.MEDIUM })
  severity!: SecuritySeverity;

  @Column({ type: 'enum', enum: SecurityStatus, default: SecurityStatus.PENDING })
  status!: SecurityStatus;

  @Column({ name: 'reported_by_id' })
  reportedById!: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'reported_by_id' })
  reportedBy!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
