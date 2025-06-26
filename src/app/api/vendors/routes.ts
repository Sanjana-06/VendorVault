import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Vendor from '@/lib/models/vendor';

// POST /api/vendors → Create new vendor
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, bankAccountNo, bankName } = body;

    if (!name || !bankAccountNo || !bankName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();
    const newVendor = await Vendor.create(body);

    return NextResponse.json(newVendor, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create vendor' }, { status: 500 });
  }
}

// GET /api/vendors → List all vendors (optionally paginated)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '5');
    const skip = (page - 1) * limit;

    await connectDB();
    const vendors = await Vendor.find().skip(skip).limit(limit);
    const total = await Vendor.countDocuments();

    return NextResponse.json({
      vendors,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch vendors' }, { status: 500 });
  }
}
