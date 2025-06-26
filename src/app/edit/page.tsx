'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type Vendor = {
  _id: string;
  name: string;
  bankAccountNo: string;
  bankName: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  country?: string;
  zipCode?: string;
};

export default function EditVendorPage({ params }: { params: { id: string } }) {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchVendor = async () => {
      const res = await fetch(`/api/vendors/${params.id}`);
      const data = await res.json();
      setVendor(data);
      setLoading(false);
    };

    fetchVendor();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!vendor) return;
    setVendor({ ...vendor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor?.name || !vendor?.bankAccountNo || !vendor?.bankName) {
      toast.error('Required fields missing');
      return;
    }

    const res = await fetch(`/api/vendors/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vendor),
    });

    if (res.ok) {
      toast.success('Vendor updated');
      router.push('/dashboard');
    } else {
      toast.error('Update failed');
    }
  };

  if (loading || !vendor) return <p className="p-4">Loading...</p>;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Vendor</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <input name="name" placeholder="Vendor Name*" value={vendor.name} onChange={handleChange} className="border p-2" />
          <input name="bankAccountNo" placeholder="Bank Account No*" value={vendor.bankAccountNo} onChange={handleChange} className="border p-2" />
          <input name="bankName" placeholder="Bank Name*" value={vendor.bankName} onChange={handleChange} className="border p-2" />
          <input name="addressLine1" placeholder="Address Line 1" value={vendor.addressLine1 || ''} onChange={handleChange} className="border p-2" />
          <input name="addressLine2" placeholder="Address Line 2" value={vendor.addressLine2 || ''} onChange={handleChange} className="border p-2" />
          <input name="city" placeholder="City" value={vendor.city || ''} onChange={handleChange} className="border p-2" />
          <input name="country" placeholder="Country" value={vendor.country || ''} onChange={handleChange} className="border p-2" />
          <input name="zipCode" placeholder="Zip Code" value={vendor.zipCode || ''} onChange={handleChange} className="border p-2" />
        </div>
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
          Update Vendor
        </button>
      </form>
    </main>
  );
}
