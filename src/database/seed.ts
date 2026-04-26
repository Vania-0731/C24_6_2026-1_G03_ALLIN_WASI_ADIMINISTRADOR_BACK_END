import { DataSource } from 'typeorm';
import { User } from '../modules/users/entities/user.entity';
import { Role } from '../modules/roles/entities/role.entity';
import { AdminUser } from '../modules/admins/entities/admin.entity';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

async function seed() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'admin123',
    database: process.env.DB_NAME || 'allin_wasi',
    entities: [User, Role, AdminUser],
  });

  try {
    await dataSource.initialize();
    console.log('🌱 Conectado a la base de datos para seeding de Admin...');

    const userRepository = dataSource.getRepository(User);
    const roleRepository = dataSource.getRepository(Role);
    const adminRepository = dataSource.getRepository(AdminUser);

    let adminRole = await roleRepository.findOne({ where: { name: 'admin' } });
    if (!adminRole) {
      console.log('✨ Creando rol admin...');
      adminRole = roleRepository.create({
        name: 'admin',
        description: 'Administrador del sistema',
      });
      await roleRepository.save(adminRole);
    }

    const adminEmail = 'admin@allinwasi.com';
    let user = await userRepository.findOne({ where: { email: adminEmail } });

    if (!user) {
      console.log('👤 Creando usuario base...');
      const hashedPassword = await bcrypt.hash('admin123456', 10);
      user = userRepository.create({
        fullName: 'Administrador Principal',
        email: adminEmail,
        password: hashedPassword,
        roleId: adminRole.id,
        isVerified: true,
      });
      user = await userRepository.save(user);
    }

    const existingAdminEntry = await adminRepository.findOne({ where: { userId: user.id } });
    if (!existingAdminEntry) {
      console.log('🛡️ Vinculando usuario a la tabla admins...');
      const adminEntry = adminRepository.create({
        userId: user.id,
        permissions: {
          manageUsers: true,
          manageProperties: true,
        }
      });
      await adminRepository.save(adminEntry);
      console.log('✅ Administrador creado y vinculado con éxito!');
    } else {
      console.log('⚠️ El registro en la tabla admins ya existe.');
    }

    console.log('\n🚀 Credenciales de acceso:');
    console.log('📧 Email: admin@allinwasi.com');
    console.log('🔑 Password: admin123456');

  } catch (error) {
    console.error('❌ Error durante el seeding:', error);
  } finally {
    await dataSource.destroy();
  }
}

seed();
