import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../../roles/entities/role.entity';
import { AdminUser } from '../../admins/entities/admin.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(AdminUser)
    private adminRepository: Repository<AdminUser>,
  ) {}

  async findAdminByUserId(userId: string) {
    return this.adminRepository.findOne({ where: { userId } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['role'],
      select: ['id', 'fullName', 'email', 'password', 'roleId', 'isVerified'], 
    });
  }

  async findAll(): Promise<any[]> {
    const users = await this.usersRepository.find({
      relations: ['role', 'admin'],
      order: { createdAt: 'DESC' },
    });

    return users.map(user => ({
      ...user,
      permissions: user.admin?.permissions || null
    }));
  }

  async findOne(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['role'],
    });
  }

  async update(id: string, updateUserDto: any): Promise<User | null> {
    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async updatePermissions(userId: string, permissions: any) {
    const admin = await this.adminRepository.findOne({ where: { userId } });
    if (!admin) {
      throw new Error('El usuario seleccionado no es un administrador o no tiene un perfil de admin asociado.');
    }

    try {
      await this.adminRepository.update(admin.id, { permissions });
      return { success: true };
    } catch (error) {
      console.error('❌ Error al ejecutar update en la base de datos:', error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async create(createUserDto: any): Promise<User> {
    const { fullName, email, password, roleName, permissions, profilePicture } = createUserDto;
    let role = await this.roleRepository.findOne({ where: { name: roleName } });
    if (!role) {
      role = this.roleRepository.create({ name: roleName });
      await this.roleRepository.save(role);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      fullName,
      email,
      password: hashedPassword,
      roleId: role.id,
      isVerified: true,
      profilePicture: profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName}`,
    });

    const savedUser = await this.usersRepository.save(user);
    if (roleName === 'admin') {
      const adminEntry = this.adminRepository.create({
        userId: savedUser.id,
        permissions: permissions || {
          manageUsers: true,
          manageProperties: true,
          manageRequests: true,
          viewReports: false,
          systemSettings: false,
        }
      });
      await this.adminRepository.save(adminEntry);
    }
    return savedUser;
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }
}
