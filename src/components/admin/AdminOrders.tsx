import React, { useState, useMemo } from 'react';
import { OrderRecord, galleryDatabase } from '../../services/galleryDatabase';
import { ShoppingBag, Search, Eye, Filter, ArrowRight, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { AdminTab } from './AdminSidebar';

export interface AdminOrdersProps {
  onSelectOrder: (orderNumber: string) => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({ onSelectOrder }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<string>('ALL');

  const orders = galleryDatabase.getOrders();

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        o.orderNumber.toLowerCase().includes(q) ||
        (o.customerName || '').toLowerCase().includes(q) ||
        (o.customerEmail || '').toLowerCase().includes(q) ||
        (o.customerPhone || '').toLowerCase().includes(q) ||
        (o.shippingAddress?.city || '').toLowerCase().includes(q);

      if (!matchSearch) return false;
      if (statusFilter !== 'ALL' && o.orderStatus !== statusFilter) return false;
      if (paymentFilter !== 'ALL' && o.paymentStatus !== paymentFilter) return false;

      return true;
    });
  }, [orders, search, statusFilter, paymentFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif text-[#141416] tracking-tight">
            Orders Management ({filteredOrders.length})
          </h2>
          <p className="text-xs text-[#71717A] mt-0.5">
            Acquisitions, insured packing, logistics, and fulfillment records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs font-mono text-[#71717A]">
            Total Volume: <strong className="text-[#141416]">{orders.length} orders</strong>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#E5E5E8] rounded-lg p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#999999] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order # (ART-XXXXXX), client name, email, or city..."
            className="w-full pl-9 pr-3 py-2 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs text-[#141416] focus:outline-none focus:border-[#141416]"
          />
        </div>

        <div className="w-full md:w-44">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-2.5 py-2 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs text-[#141416] font-sans focus:outline-none focus:border-[#141416]"
          >
            <option value="ALL">Order Status: All</option>
            <option value="PENDING">PENDING</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>

        <div className="w-full md:w-44">
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full px-2.5 py-2 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs text-[#141416] font-sans focus:outline-none focus:border-[#141416]"
          >
            <option value="ALL">Payment: All</option>
            <option value="PAID">PAID</option>
            <option value="PENDING">PENDING</option>
            <option value="REFUNDED">REFUNDED</option>
            <option value="FAILED">FAILED</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white border border-[#E5E5E8] rounded-lg p-12 text-center">
          <ShoppingBag className="w-8 h-8 text-[#A1A1AA] mx-auto mb-2" />
          <h3 className="text-sm font-medium text-[#141416]">No Orders Found</h3>
          <p className="text-xs text-[#71717A] mt-1">
            No orders match the specified filters or search term.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-[#E5E5E8] rounded-lg overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F9F9FB] border-b border-[#E5E5E8] text-[10px] font-mono uppercase tracking-wider text-[#71717A]">
                <tr>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Collector / Customer</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Fulfillment</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E8]">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.orderNumber}
                    onClick={() => onSelectOrder(order.orderNumber)}
                    className="hover:bg-[#FDFDFE] transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-mono font-medium text-[#141416]">
                      {order.orderNumber}
                    </td>

                    <td className="py-3.5 px-4 text-[#71717A] font-mono text-[11px]">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#141416]">
                        {order.customerName || `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`}
                      </div>
                      <div className="text-[11px] text-[#71717A]">
                        {order.customerEmail} • {order.shippingAddress.city}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-xs font-mono text-[#141416]">
                        {order.items.length} piece(s)
                      </div>
                      <div className="text-[10px] text-[#71717A] truncate max-w-[140px]">
                        {order.items.map((it) => it.title).join(', ')}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-serif font-medium text-sm text-[#141416]">
                      Rs. {order.total.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                          order.paymentStatus === 'PAID'
                            ? 'bg-emerald-50 text-emerald-800'
                            : order.paymentStatus === 'PENDING'
                            ? 'bg-amber-50 text-amber-800'
                            : 'bg-red-50 text-red-800'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                      <div className="text-[10px] text-[#71717A] mt-0.5">
                        {order.paymentMethod === 'cod' ? 'COD' : 'Online'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                          order.orderStatus === 'DELIVERED'
                            ? 'bg-emerald-100 text-emerald-900'
                            : order.orderStatus === 'SHIPPED'
                            ? 'bg-blue-100 text-blue-900'
                            : order.orderStatus === 'PROCESSING'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-zinc-100 text-zinc-800'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectOrder(order.orderNumber);
                        }}
                        className="px-2.5 py-1 text-xs font-mono text-[#141416] bg-[#F4F4F6] hover:bg-[#EAEAEF] rounded inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3 text-[#71717A]" />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
