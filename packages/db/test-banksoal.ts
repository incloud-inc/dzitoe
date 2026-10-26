import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const count = await prisma.bankSoal.count();
  const countPaket = await prisma.paketSoal.count();
  console.log('BankSoal:', count);
  console.log('PaketSoal:', countPaket);
  if (count > 0) {
    const soal = await prisma.bankSoal.findFirst({ select: { pertanyaan: true }});
    console.log('Sample Pertanyaan:', soal?.pertanyaan?.substring(0, 50));
  }
}
main().then(() => prisma.$disconnect());
