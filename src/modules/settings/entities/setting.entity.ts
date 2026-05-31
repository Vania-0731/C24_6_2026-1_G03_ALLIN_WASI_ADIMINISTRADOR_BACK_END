import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('settings')
export class Setting {
  @PrimaryColumn({ length: 50 })
  key: string;

  @Column('text', { nullable: true })
  value: string;

  @Column({ length: 255, nullable: true })
  description: string;

  @Column({ default: 'string' })
  type: string; // 'string', 'number', 'boolean', 'json'

  @Column({ default: 'general' })
  group: string; // 'general', 'security', 'features', etc.

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
