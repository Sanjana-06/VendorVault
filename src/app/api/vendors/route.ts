import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Vendor from '@/lib/models/vendor';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '5', 10);
    const skip = (page - 1) * limit;

    const [vendors, totalCount] = await Promise.all([
      Vendor.find().skip(skip).limit(limit),
      Vendor.countDocuments(),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({ vendors, totalPages });
  } catch (error) {
    console.error('Error fetching vendors:', error);
    return NextResponse.json({ error: 'Failed to fetch vendors' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      bankAccountNo,
      bankName,
      addressLine1,
      addressLine2,
      city,
      country,
      zipCode,
    } = body;

    if (!name || !bankAccountNo || !bankName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();
    const newVendor = new Vendor({
      name,
      bankAccountNo,
      bankName,
      addressLine1,
      addressLine2,
      city,
      country,
      zipCode,
    });

    await newVendor.save();
    return NextResponse.json(newVendor, { status: 201 });
  } catch (error) {
    console.error('Error creating vendor:', error);
    return NextResponse.json({ error: 'Failed to create vendor' }, { status: 500 });
  }
}
