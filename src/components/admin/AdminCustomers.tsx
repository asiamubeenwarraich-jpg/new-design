import React, { useState } from 'react';
import { Customer, OrderRecord, galleryDatabase } from '../../services/galleryDatabase';
import { Users, Search, ShoppingBag, Eye, X } from 'lucide-react';

export interface AdminCustomersProps {
  onSelectOrder: (orderNumber: string) => void;
}

export const AdminCustomers: React.FC<AdminCustomersProps> = ({ onSelectOrder }) => {
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<{
    customer: Customer;
    orders: OrderRecord[];
  } | null>(null);

  const customers = galleryDatabase.getCustomers();

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase().trim();
    return (
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      (c.city || '').toLowerCase().includes(q)
    );
  });

  const handleOpenCustomer = (id: string) => {
    const data = galleryDatabase.getCustomerById(id);
    if (data) setSelectedCustomer(data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif text-[#141416] tracking-tight">
            Collector Directory ({filtered.length})
          </h2>
          <p className="text-xs text-[#71717A] mt-0.5">
            Profiles, acquisition frequency, and lifetime acquisition value.
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white border border-[#E5E5E8] rounded-lg p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-[#999999] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search collectors by name, email, phone, or city..."
            className="w-full pl-9 pr-3 py-2 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs text-[#141416] focus:outline-none focus:border-[#141416]"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-[#E5E5E8] rounded-lg overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F9F9FB] border-b border-[#E5E5E8] text-[10px] font-mono uppercase tracking-wider text-[#71717A]">
              <tr>
                <th className="py-3 px-4">Collector Name</th>
                <th className="py-3 px-4">Contact Details</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4 text-center">Acquisitions</th>
                <th className="py-3 px-4">Total Spent (PKR)</th>
                <th className="py-3 px-4">Last Order</th>
                <th className="py-3 px-4 text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E8]">
              {filtered.map((cust) => (
                <tr
                  key={cust.id}
                  onClick={() => handleOpenCustomer(cust.id)}
                  className="hover:bg-[#FDFDFE] cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-medium text-[#141416]">
                    {cust.name}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-[#141416]">{cust.email}</div>
                    <div className="text-[11px] text-[#71717A] font-mono">{cust.phone}</div>
                  </td>

                  <td className="py-3.5 px-4 text-[#555555]">
                    {cust.city || 'Pakistan'}
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono font-medium">
                    <span className="px-2 py-0.5 bg-[#F4F4F6] rounded">
                      {cust.ordersCount}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-serif font-medium text-sm text-[#141416]">
                    Rs. {cust.totalSpent.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4 text-[#71717A] font-mono text-[11px]">
                    {new Date(cust.lastOrderAt).toLocaleDateString()}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      className="px-2.5 py-1 text-xs font-mono text-[#141416] bg-[#F4F4F6] hover:bg-[#EAEAEF] rounded inline-flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3 text-[#71717A]" />
                      <span>History</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Drawer Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 border border-[#E5E5E8] shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E8]">
              <div>
                <h3 className="text-base font-serif font-medium text-[#141416]">
                  {selectedCustomer.customer.name}
                </h3>
                <p className="text-xs text-[#71717A]">
                  Collector since {new Date(selectedCustomer.customer.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="text-[#71717A] hover:text-[#141416]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-[#F9F9FB] rounded-lg text-xs">
              <div>
                <span className="text-[10px] font-mono text-[#71717A] uppercase block">Email</span>
                <span className="font-medium text-[#141416]">{selectedCustomer.customer.email}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#71717A] uppercase block">Phone</span>
                <span className="font-medium text-[#141416]">{selectedCustomer.customer.phone}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#71717A] uppercase block">Total Spent</span>
                <span className="font-serif font-medium text-[#141416]">
                  Rs. {selectedCustomer.customer.totalSpent.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#71717A] uppercase block">Total Orders</span>
                <span className="font-medium text-[#141416]">
                  {selectedCustomer.customer.ordersCount} orders
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#71717A] mb-2">
                Order Acquisition History ({selectedCustomer.orders.length})
              </h4>
              <div className="divide-y divide-[#F0F0F2] border border-[#E5E5E8] rounded-lg overflow-hidden">
                {selectedCustomer.orders.map((o) => (
                  <div
                    key={o.orderNumber}
                    onClick={() => {
                      setSelectedCustomer(null);
                      onSelectOrder(o.orderNumber);
                    }}
                    className="p-3 flex items-center justify-between hover:bg-[#F9F9FB] cursor-pointer"
                  >
                    <div>
                      <div className="font-mono text-xs font-medium text-blue-700">
                        {o.orderNumber}
                      </div>
                      <div className="text-[11px] text-[#71717A]">
                        {new Date(o.createdAt).toLocaleDateString()} • {o.items.length} item(s)
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-serif font-medium text-[#141416]">
                        Rs. {o.total.toLocaleString()}
                      </div>
                      <span className="text-[10px] font-mono text-emerald-800">
                        {o.orderStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
