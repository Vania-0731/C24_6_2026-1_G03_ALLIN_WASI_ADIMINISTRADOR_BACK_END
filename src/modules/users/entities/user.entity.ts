import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { AdminUser } from '../../admins/entities/admin.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  fullName!: string;

  @Column({ unique: true, length: 255 })
  email!: string;

  @Column({ select: false, nullable: true })
  password?: string;

  @Column({ name: 'role_id' })
  roleId!: string;

  @ManyToOne(() => Role, role => role.users)
  @JoinColumn({ name: 'role_id' })
  role!: Role;

  @Column({ type: 'longtext', nullable: true })
  profilePicture?: string;

  @OneToOne(() => AdminUser, admin => admin.user)
  admin!: AdminUser;

  @Column({ nullable: true, unique: true })
  googleId?: string;

  @Column({ default: false })
  isVerified!: boolean;

  @Column({ default: false })
  isTwoFactorEnabled!: boolean;

  @Column({ nullable: true })
  twoFactorSecret?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
