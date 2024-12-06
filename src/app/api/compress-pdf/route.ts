import { NextRequest, NextResponse } from 'next/server';
import { compress } from 'compress-pdf';
import { promises as fs } from 'fs';
import path from 'path';

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as Blob | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert Blob to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // Compress the PDF buffer
    const compressedBuffer = await compress(inputBuffer);

    // Return compressed file as a downloadable response
    return new NextResponse(compressedBuffer, {
      headers: {
        'Content-Disposition': 'attachment; filename="compressed.pdf"',
        'Content-Type': 'application/pdf',
      },
    });
  } catch (error) {
    console.error('Error compressing PDF:', error);
    return NextResponse.json({ error: 'Failed to compress PDF' }, { status: 500 });
  }
};
