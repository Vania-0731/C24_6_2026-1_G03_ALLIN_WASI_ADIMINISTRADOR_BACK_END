import { DataSource } from 'typeorm';
import { User } from '../modules/users/entities/user.entity';
import { Role } from '../modules/roles/entities/role.entity';
import { AdminUser } from '../modules/admins/entities/admin.entity';
import { Property, PropertyType, PropertyStatus } from '../modules/properties/entities/property.entity';
import { Tour360, TourStatus } from '../modules/tours/entities/tour.entity';
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
    entities: [User, Role, AdminUser, Property, Tour360],
  });

  try {
    await dataSource.initialize();
    console.log('🌱 Conectado a la base de datos para seeding...');

    const userRepository = dataSource.getRepository(User);
    const roleRepository = dataSource.getRepository(Role);
    const adminRepository = dataSource.getRepository(AdminUser);
    const propertyRepository = dataSource.getRepository(Property);

    // Roles
    let adminRole = await roleRepository.findOne({ where: { name: 'admin' } });
    if (!adminRole) adminRole = await roleRepository.save(roleRepository.create({ name: 'admin', description: 'Administrador' }));

    let landlordRole = await roleRepository.findOne({ where: { name: 'landlord' } });
    if (!landlordRole) landlordRole = await roleRepository.save(roleRepository.create({ name: 'landlord', description: 'Arrendador' }));

    // Admin User
    const adminEmail = 'admin@allinwasi.com';
    let admin = await userRepository.findOne({ where: { email: adminEmail } });
    if (!admin) {
      admin = await userRepository.save(userRepository.create({
        fullName: 'Administrador Principal',
        email: adminEmail,
        password: await bcrypt.hash('admin123456', 10),
        roleId: adminRole.id,
        isVerified: true,
      }));
    }
    
    let adminEntry = await adminRepository.findOne({ where: { userId: admin.id } });
    if (!adminEntry) {
      await adminRepository.save(adminRepository.create({
        userId: admin.id,
        permissions: { 
          viewDashboard: true,
          manageProperties: true, 
          manageUsers: true,
          viewMap: true
        }
      }));
    } else {
      adminEntry.permissions = { 
        viewDashboard: true,
        manageProperties: true, 
        manageUsers: true,
        viewMap: true
      };
      await adminRepository.save(adminEntry);
    }

    // Landlord
    const landlordEmail = 'arrendador@test.com';
    let landlord = await userRepository.findOne({ where: { email: landlordEmail } });
    if (!landlord) {
      landlord = await userRepository.save(userRepository.create({
        fullName: 'María García',
        email: landlordEmail,
        password: await bcrypt.hash('password123', 10),
        roleId: landlordRole.id,
        isVerified: true
      }));
    }

    // PROPIEDADES CON COORDENADAS
    console.log('📍 Actualizando coordenadas en Santa Anita...');
    const propertiesData = [
      { title: "Habitación Amoblada frente a TECSUP", lat: -12.0435, lng: -76.9525, addr: "Av. Cascanueces 120" },
      { title: "Departamento Compartido - Los Ruiseñores", lat: -12.0410, lng: -76.9580, addr: "Av. Los Ruiseñores 450" },
      { title: "Mini-estudio Independiente", lat: -12.0460, lng: -76.9510, addr: "Jr. Los Pinos 210" },
      { title: "Casa de Estudiantes 'Allin Wasi'", lat: -12.0455, lng: -76.9490, addr: "Av. La Cultura 320" },
      { title: "Cuarto Económico Estudiantil", lat: -12.0485, lng: -76.9540, addr: "Calle Los Alcanfores 123" },
      { title: "Penthouse para Estudiantes", lat: -12.0390, lng: -76.9620, addr: "Av. Huarochirí 890" },
      { title: "Habitación para Señoritas - Solo TECSUP", lat: -12.0425, lng: -76.9480, addr: "Jr. Los Geranios 456" },
      { title: "Estudio Moderno - Urb. El Pino", lat: -12.0510, lng: -76.9460, addr: "Urb. El Pino Mz A Lote 5" },
      { title: "Departamento Moderno cerca a TECSUP", lat: -12.0430, lng: -76.9535, addr: "Av. Cascanueces 123" },
      { title: "Cuarto Independiente para Estudiante", lat: -12.0420, lng: -76.9560, addr: "Calle Los Olivos 456" },
      { title: "Casa Amplia para Grupo de Estudiantes", lat: -12.0440, lng: -76.9500, addr: "Jr. Las Palmeras 789" }
    ];

    for (const p of propertiesData) {
      let prop = await propertyRepository.findOne({ where: { title: p.title } });
      if (prop) {
        prop.latitude = p.lat;
        prop.longitude = p.lng;
        await propertyRepository.save(prop);
      } else {
        await propertyRepository.save(propertyRepository.create({
          title: p.title,
          description: "Propiedad generada por seed.",
          propertyType: PropertyType.ROOM,
          address: p.addr,
          city: "Santa Anita, Lima",
          monthlyPrice: 600,
          status: PropertyStatus.AVAILABLE,
          landlordId: landlord.id,
          latitude: p.lat,
          longitude: p.lng
        }));
      }
    }

    console.log('✅ ¡Seeding completado con éxito!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await dataSource.destroy();
  }
}

seed();
