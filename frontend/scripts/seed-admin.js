/* eslint-disable no-console */
const path = require('path');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const prisma = new PrismaClient();

const ADMIN_EMAIL = 'purplemerit547@gmail.com';
const ADMIN_NAME = 'Purple Merit Admin';
const ADMIN_PASSWORD = 'Pm!Admin#2026$Nexus';

async function seedAdmin() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      name: ADMIN_NAME,
      password: passwordHash,
      role: 'ADMIN',
      emailVerified: true,
    },
    create: {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: passwordHash,
      role: 'ADMIN',
      emailVerified: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      emailVerified: true,
    },
  });

  console.log('Admin user seeded successfully');
  console.log(JSON.stringify(admin, null, 2));
}

seedAdmin()
  .catch((error) => {
    console.error('Failed to seed admin user:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
