import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Master Admin account...');
  
  // Menggunakan pre-computed hash untuk 'Masuk123!'
  const hashedPassword = '$2a$10$948wkNUKT9h/f8ToysWIZu.6rrqX/O7W8PQL3GvR94pJWAv6Zslbe';
  
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {
      password: hashedPassword,
      isActive: true,
      role: 'ADMIN',
    },
    create: {
      username: 'admin',
      email: 'admin@sman20.sch.id',
      password: hashedPassword,
      name: 'Super Administrator',
      role: 'ADMIN',
      isActive: true,
    }
  });

  console.log(`✅ Berhasil! Akun Master Admin dibuat di Postgres.`);
  console.log(`Username : ${admin.username}`);
  console.log(`Password : Masuk123!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
