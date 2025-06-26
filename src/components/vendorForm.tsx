'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

type Props = {
  onSuccess: () => void;
};

export default function VendorForm({ onSuccess }: Props) {
  const [form, setForm] = useState({
    name: '',
    bankAccountNo: '',
    bankName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    country: '',
    zipCode: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.bankAccountNo || !form.bankName) {
      toast.error('Please fill all required fields');
      return;
    }

    const res = await fetch('/api/vendors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      toast.success('Vendor created');
      setForm({
        name: '',
        bankAccountNo: '',
        bankName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        country: '',
        zipCode: '',
      });
      onSuccess(); 
    } else {
      toast.error('Failed to create vendor');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-3">
      <h2 className="text-xl font-semibold">Add New Vendor</h2>

      <div className="grid grid-cols-2 gap-4">
        <input name="name" placeholder="Vendor Name*" value={form.name} onChange={handleChange} className="border p-2" />
        <input name="bankAccountNo" placeholder="Bank Account No*" value={form.bankAccountNo} onChange={handleChange} className="border p-2" />
        <input name="bankName" placeholder="Bank Name*" value={form.bankName} onChange={handleChange} className="border p-2" />
        <input name="addressLine1" placeholder="Address Line 1" value={form.addressLine1} onChange={handleChange} className="border p-2" />
        <input name="addressLine2" placeholder="Address Line 2" value={form.addressLine2} onChange={handleChange} className="border p-2" />
        <input name="city" placeholder="City" value={form.city} onChange={handleChange} className="border p-2" />
        <input name="country" placeholder="Country" value={form.country} onChange={handleChange} className="border p-2" />
        <input name="zipCode" placeholder="Zip Code" value={form.zipCode} onChange={handleChange} className="border p-2" />
      </div>

      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        Submit
      </button>
    </form>
  );
}
