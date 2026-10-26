import { NextResponse } from 'next/server';
import { generateExcelTemplate, KURIKULUM_TEMPLATE_SAMPLE } from '@dzitoe/utils';

export async function GET() {
  try {
    const templateBuffer = generateExcelTemplate(KURIKULUM_TEMPLATE_SAMPLE as any, 'Kurikulum Template');

    return new NextResponse(templateBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="Template_Kurikulum.xlsx"',
      },
    });
  } catch (error: any) {
    console.error('Failed to generate template:', error);
    return NextResponse.json({ error: 'Gagal membuat template Excel' }, { status: 500 });
  }
}
