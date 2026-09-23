import { NextRequest, NextResponse } from 'next/server';
import { getAllWells } from '@/lib/data/service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const field = searchParams.get('field');

    const allWells = await getAllWells();
    let filtered = allWells;

    if (status) {
      filtered = filtered.filter(w => w.status.toLowerCase() === status.toLowerCase());
    }

    if (field && field !== 'all') {
      filtered = filtered.filter(w => w.field.toLowerCase() === field.toLowerCase());
    }

    return NextResponse.json({
      success: true,
      count: filtered.length,
      wells: filtered
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve wells data' },
      { status: 500 }
    );
  }
}
