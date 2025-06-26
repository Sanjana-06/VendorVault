'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

type Vendor = {
  _id: string;
  name: string;
  bankAccountNo: string;
  bankName: string;
};

export default function DashboardPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  const fetchVendors = async () => {
    const res = await fetch(`/api/vendors?page=${page}&limit=5`);
    const data = await res.json();
    setVendors(data.vendors);
    setTotalPages(data.totalPages);
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
