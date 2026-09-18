import React, { useState } from 'react';
import { PaymentRecord, galleryDatabase } from '../../services/galleryDatabase';
import { CreditCard, Search, Check, RefreshCw } from 'lucide-react';

export interface AdminPaymentsProps {
  onSelectOrder: (orderNumber: string) => void;
}

export const AdminPayments: React.FC<AdminPaymentsProps> = ({ onSelectOrder }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'PAID' | 'PENDING' | 'REFUNDED'>('ALL');
  const payments = galleryDatabase.getPayments();

  const handleStatusChange = (orderNumber: string, newStatus: any) => {
    galleryDatabase.updatePaymentStatus(orderNumber, newStatus);
  };

  const filtered = payments.filter((p) => {
    const q = search.toLowerCase().trim();
    const matchSearch =
      !q ||
      p.transactionId.toLowerCase().includes(q) ||
      p.orderNumber.toLowerCase().includes(q) ||
      p.customerName.toLowerCase().includes(q) ||
      p.customerEmail.toLowerCase().includes(q);

    if (!matchSearch) return false;
    if (filter !== 'ALL' && p.status !== filter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif text-[#141416] tracking-tight">
            Payments & Transactions ({filtered.length})
          </h2>
          <p className="text-xs text-[#71717A] mt-0.5">
            Audit trail of all online card payments and Cash on Delivery settlements.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#E5E5E8] rounded-lg p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#999999] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by transaction ID, order #, or client name..."
            className="w-full pl-9 pr-3 py-2 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs text-[#141416] focus:outline-none focus:border-[#141416]"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFilter('ALL')}
            className={`px-3 py-2 rounded text-xs font-mono uppercase transition-colors cursor-pointer ${
              filter === 'ALL'
                ? 'bg-[#141416] text-white'
                : 'bg-[#F4F4F6] text-[#71717A] hover:text-[#141416]'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter('PAID')}
            className={`px-3 py-2 rounded text-xs font-mono uppercase transition-colors cursor-pointer ${
              filter === 'PAID'
                ? 'bg-emerald-700 text-white'
                : 'bg-[#F4F4F6] text-[#71717A] hover:text-[#141416]'
            }`}
          >
            Paid
          </button>
          <button
            type="button"
            onClick={() => setFilter('PENDING')}
            className={`px-3 py-2 rounded text-xs font-mono uppercase transition-colors cursor-pointer ${
              filter === 'PENDING'
                ? 'bg-amber-600 text-white'
                : 'bg-[#F4F4F6] text-[#71717A] hover:text-[#141416]'
            }`}
          >
            Pending
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white border border-[#E5E5E8] rounded-lg overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F9F9FB] border-b border-[#E5E5E8] text-[10px] font-mono uppercase tracking-wider text-[#71717A]">
              <tr>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment Status</th>
                <th className="py-3 px-4 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E8]">
              {filtered.map((pay) => (
                <tr key={pay.id} className="hover:bg-[#FDFDFE]">
                  <td className="py-3.5 px-4 font-mono font-medium text-[#141416]">
                    {pay.transactionId}
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    <button
                      type="button"
                      onClick={() => onSelectOrder(pay.orderNumber)}
                      className="text-blue-700 hover:underline"
                    >
                      {pay.orderNumber}
                    </button>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-[#141416]">{pay.customerName}</div>
                    <div className="text-[11px] text-[#71717A]">{pay.customerEmail}</div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#555555]">
                    {pay.paymentMethod}
                  </td>

                  <td className="py-3.5 px-4 font-serif font-medium text-sm text-[#141416]">
                    Rs. {pay.amount.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                        pay.status === 'PAID'
                          ? 'bg-emerald-50 text-emerald-800'
                          : pay.status === 'PENDING'
                          ? 'bg-amber-50 text-amber-800'
                          : 'bg-red-50 text-red-800'
                      }`}
                    >
                      {pay.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <select
                      value={pay.status}
                      onChange={(e) => handleStatusChange(pay.orderNumber, e.target.value)}
                      className="px-2 py-1 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-[11px] font-mono cursor-pointer"
                    >
                      <option value="PAID">Mark PAID</option>
                      <option value="PENDING">Mark PENDING</option>
                      <option value="REFUNDED">Mark REFUNDED</option>
                      <option value="FAILED">Mark FAILED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
