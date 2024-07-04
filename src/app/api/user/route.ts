import executeQuery from '@/src/lib/db';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {  
  const data = await executeQuery('SELECT * FROM USER', '');

  return NextResponse.json({ data: data }, { status: 200 });
}