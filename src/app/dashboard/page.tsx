'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import VendorForm from '@/components/vendorForm'; 
import { useSession } from 'next-auth/react';


type Vendor = {
  _id: string;
  name: string;
  bankAccountNo: string;
  bankName: string;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  useEffect(() => {
  if (!session && status !== 'loading') {
    router.push('/login');
  }
}, [session, status, router]);

if (status === 'loading' || !session) {
  return <p className="p-6">Loading...</p>;
}


  const fetchVendors = async () => {
  try {
    const res = await fetch(`/api/vendors?page=${page}&limit=5`);
    if (!res.ok) throw new Error('Failed to fetch vendors');
    const data = await res.json();

    if (Array.isArray(data.vendors)) {
      setVendors(data.vendors);
      setTotalPages(data.totalPages || 1);
    } else {
      setVendors([]); 
      setTotalPages(1);
    }
  } catch (error) {
    console.error('Error fetching vendors:', error);
    setVendors([]); 
    toast.error('Unable to fetch vendors.');
  }
};

  const deleteVendor = async (id: string) => {
    const confirm = window.confirm('Are you sure you want to delete this vendor?');
    if (!confirm) return;

    const res = await fetch(`/api/vendors/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Vendor deleted');
      fetchVendors();
    } else {
      toast.error('Error deleting vendor');
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [page]);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Vendor Dashboard</h1>

      {/* ✅ Add the VendorForm here */}
      <VendorForm onSuccess={fetchVendors} />

      {/* Vendor Table */}
      <table className="w-full border text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Bank Account</th>
            <th className="p-2">Bank Name</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor) => (
            <tr key={vendor._id} className="border-t">
              <td className="p-2">{vendor.name}</td>
              <td className="p-2">{vendor.bankAccountNo}</td>
              <td className="p-2">{vendor.bankName}</td>
              <td className="p-2 space-x-2">
                <Link
                  href={`/edit/${vendor._id}`}
                  className="text-blue-600 underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteVendor(vendor._id)}
                  className="text-red-600 underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="mt-4 space-x-2">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-2">Page {page} of {totalPages}</span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </main>
  );
}
