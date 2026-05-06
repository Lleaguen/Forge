import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('SuperSecure123!', 10);

  // Crear organización por defecto
  const organization = await prisma.organization.upsert({
    where: { id: 'default-org' },
    update: {},
    create: {
      id: 'default-org',
      name: 'Forge Organization',
    },
  });

  // Crear usuario admin
  const user = await prisma.user.upsert({
    where: { email: 'admin@forge.dev' },
    update: {
      passwordHash,
      fullName: 'Admin User',
      role: 'ADMIN',
    },
    create: {
      email: 'admin@forge.dev',
      passwordHash,
      fullName: 'Admin User',
      role: 'ADMIN',
    },
  });

  // Crear membership
  await prisma.membership.upsert({
    where: {
      userId_organizationId: {
        userId: user.id,
        organizationId: organization.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      organizationId: organization.id,
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user seeded with email: admin@forge.dev and password: SuperSecure123!');
  console.log('✅ Default organization created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
