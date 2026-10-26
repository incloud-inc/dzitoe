import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const kurikulum = await prisma.kelasKurikulum.findMany({ include: { mapel: true, bab: true }});
  console.log('Total KelasKurikulum:', kurikulum.length);
  if (kurikulum.length > 0) {
    console.log(kurikulum[0]);
  }
}
main().then(() => prisma.$disconnect());
