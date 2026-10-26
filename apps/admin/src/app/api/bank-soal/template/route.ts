import { NextResponse } from 'next/server';
import { generateExcelTemplate, BANKSOAL_TEMPLATE_SAMPLE } from '@dzitoe/utils';

export async function GET() {
  try {
    const templateBuffer = generateExcelTemplate(BANKSOAL_TEMPLATE_SAMPLE as any, 'Bank Soal Template');

    return new NextResponse(templateBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="Template_BankSoal.xlsx"',
      },
    });
  } catch (error: any) {
    console.error('Failed to generate template:', error);
    return NextResponse.json({ error: 'Gagal membuat template Excel' }, { status: 500 });
  }
}
