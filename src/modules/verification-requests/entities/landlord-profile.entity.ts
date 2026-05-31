import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('landlords')
export class LandlordProfile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', unique: true })
  userId!: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ length: 20, default: '' })
  phone!: string;

  @Column({ length: 15, default: '' })
  dni!: string;

  @Column({ length: 500, default: '' })
  address!: string;

  @Column({ type: 'varchar', length: 20, default: '' })
  propertyCount!: string;

  @Column({ nullable: true, length: 500 })
  dniFrontUrl?: string;

  @Column({ nullable: true, length: 500 })
  dniBackUrl?: string;

  @Column({ nullable: true, length: 500 })
  utilityBillUrl?: string;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  verificationStatus!: string;

  @Column({ nullable: true, length: 500 })
  verificationMessage?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
