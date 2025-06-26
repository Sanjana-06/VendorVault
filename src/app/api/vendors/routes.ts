import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Vendor from '@/lib/models/vendor';

// GET /api/vendors/[id] - Get vendor by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const vendor = await Vendor.findById(params.id);
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }
    return NextResponse.json(vendor);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch vendor' }, { status: 500 });
  }
}

// PUT /api/vendors/[id] - Update vendor
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    await connectDB();
    const updatedVendor = await Vendor.findByIdAndUpdate(params.id, body, {
      new: true,
    });
    return NextResponse.json(updatedVendor);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update vendor' }, { status: 500 });
  }
}

// DELETE /api/vendors/[id] - Delete vendor
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    await Vendor.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Vendor deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete vendor' }, { status: 500 });
  }
}
