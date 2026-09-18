import React, { useState } from 'react';
import { OrderRecord, galleryDatabase } from '../../services/galleryDatabase';
import {
  ArrowLeft,
  Printer,
  CheckCircle,
  Truck,
  CreditCard,
  User,
  MapPin,
  Package,
  Calendar,
  Save,
} from 'lucide-react';

export interface AdminOrderDetailProps {
  orderNumber: string;
  onBack: () => void;
}

export const AdminOrderDetail: React.FC<AdminOrderDetailProps> = ({
  orderNumber,
  onBack,
}) => {
  const order = galleryDatabase.getOrderById(orderNumber);

  const [orderStatus, setOrderStatus] = useState<OrderRecord['orderStatus']>(
    order?.orderStatus || 'PROCESSING'
  );
  const [paymentStatus, setPaymentStatus] = useState<OrderRecord['paymentStatus']>(
    order?.paymentStatus || 'PENDING'
  );
  const [savedFeedback, setSavedFeedback] = useState(false);

  if (!order) {
    return (
      <div className="bg-white border border-[#E5E5E8] rounded-lg p-12 text-center space-y-4">
        <h3 className="text-lg font-serif text-[#141416]">Order Not Found</h3>
        <p className="text-xs text-[#71717A]">
          Could not locate order "{orderNumber}" in the gallery database.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-[#141416] text-white text-xs font-mono uppercase rounded"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const handleUpdateStatus = () => {
    galleryDatabase.updateOrderStatus(order.orderNumber, orderStatus);
    galleryDatabase.updatePaymentStatus(order.orderNumber, paymentStatus);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const customerName =
    order.customerName ||
    `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-[#71717A] hover:text-[#141416] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Orders</span>
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F4F4F6] text-[#141416] text-xs font-mono uppercase rounded border border-[#DCDCE0] transition-colors cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5 text-[#71717A]" />
          <span>Print Slip / Invoice</span>
        </button>
      </div>

      {/* Header Card */}
      <div className="bg-white border border-[#E5E5E8] rounded-lg p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-serif text-[#141416]">
              Order {order.orderNumber}
            </h2>
            <span
              className={`px-2.5 py-0.5 rounded text-xs font-mono uppercase font-bold ${
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
          </div>
          <p className="text-xs text-[#71717A] mt-1 font-mono">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="text-right sm:border-l sm:border-[#E5E5E8] sm:pl-6">
          <span className="text-[10px] font-mono text-[#71717A] uppercase block">
            Total Acquisition Amount
          </span>
          <span className="text-2xl font-serif font-medium text-[#141416]">
            Rs. {order.total.toLocaleString()}
          </span>
          <span className="text-xs font-mono text-emerald-700 block mt-0.5">
            Payment: {order.paymentStatus} ({order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'})
          </span>
        </div>
      </div>

      {/* Status Controls Card */}
      <div className="bg-[#FAF8F5] border border-[#E5DECE] rounded-lg p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
          <div>
            <label className="block text-xs font-mono uppercase text-[#555555] mb-1">
              Fulfillment Status
            </label>
            <select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value as any)}
              className="w-full px-3 py-2 bg-white border border-[#DCDCE0] rounded text-xs font-mono text-[#141416]"
            >
              <option value="PENDING">PENDING</option>
              <option value="PROCESSING">PROCESSING</option>
              <option value="SHIPPED">SHIPPED</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#555555] mb-1">
              Payment Status
            </label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value as any)}
              className="w-full px-3 py-2 bg-white border border-[#DCDCE0] rounded text-xs font-mono text-[#141416]"
            >
              <option value="PENDING">PENDING</option>
              <option value="PAID">PAID</option>
              <option value="FAILED">FAILED</option>
              <option value="REFUNDED">REFUNDED</option>
            </select>
          </div>
        </div>

        <div className="shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={handleUpdateStatus}
            className="px-4 py-2.5 bg-[#141416] hover:bg-black text-white text-xs font-mono uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Update Status</span>
          </button>
          {savedFeedback && (
            <span className="text-[11px] text-emerald-700 font-mono block mt-1 text-right">
              ✓ Saved to DB
            </span>
          )}
        </div>
      </div>

      {/* Grid of Details: Items + Customer Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Purchased Items (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-[#E5E5E8] rounded-lg p-5 space-y-4">
          <h3 className="text-sm font-serif font-medium text-[#141416] pb-2 border-b border-[#E5E5E8]">
            Purchased Artworks ({order.items.length})
          </h3>

          <div className="divide-y divide-[#F0F0F2]">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.image || '/images/hero-painting.jpg'}
                    alt={item.title}
                    className="w-14 h-14 object-cover rounded bg-[#E5E5E8] shrink-0 border border-[#E5E5E8]"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-medium text-[#141416] truncate">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-[#71717A]">
                      by {item.artist}
                    </p>
                    <span className="text-[10px] font-mono text-[#A1A1AA]">
                      Qty: {item.quantity} × Rs. {item.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-serif font-medium text-[#141416]">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Totals Breakdown */}
          <div className="pt-3 border-t border-[#E5E5E8] space-y-1.5 text-xs">
            <div className="flex justify-between text-[#71717A]">
              <span>Subtotal</span>
              <span className="font-mono">Rs. {order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#71717A]">
              <span>Shipping ({order.shippingMethod.name})</span>
              <span className="font-mono">Rs. {order.shippingFee.toLocaleString()}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount ({order.discountCode || 'Promo'})</span>
                <span className="font-mono">-Rs. {order.discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-serif font-medium text-[#141416] pt-2 border-t border-[#E5E5E8]">
              <span>Grand Total</span>
              <span className="font-mono">Rs. {order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Customer & Shipping Summary (1 Col) */}
        <div className="space-y-4">
          <div className="bg-white border border-[#E5E5E8] rounded-lg p-5 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E5E5E8]">
              <User className="w-4 h-4 text-[#71717A]" />
              <h3 className="text-sm font-serif font-medium text-[#141416]">
                Collector Information
              </h3>
            </div>

            <div className="text-xs space-y-1 text-[#555555]">
              <div className="font-medium text-[#141416] text-sm">
                {customerName}
              </div>
              <div>{order.customerEmail}</div>
              <div>{order.customerPhone || order.shippingAddress.phone}</div>
              <div className="pt-1 text-[11px] text-[#71717A]">
                Marketing Consent: {order.marketingConsent ? 'Subscribed' : 'No'}
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E5E5E8] rounded-lg p-5 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E5E5E8]">
              <MapPin className="w-4 h-4 text-[#71717A]" />
              <h3 className="text-sm font-serif font-medium text-[#141416]">
                Delivery Address
              </h3>
            </div>

            <div className="text-xs space-y-1 text-[#555555] leading-relaxed">
              <div>{order.shippingAddress.address}</div>
              {order.shippingAddress.apartment && (
                <div>Apt / Suite: {order.shippingAddress.apartment}</div>
              )}
              <div>
                {order.shippingAddress.city}
                {order.shippingAddress.postalCode && ` - ${order.shippingAddress.postalCode}`}
              </div>
              <div className="font-medium text-[#141416]">{order.shippingAddress.country}</div>
              <div className="text-[11px] font-mono text-[#71717A] pt-1">
                Estimated Delivery: {order.shippingMethod.estimatedDays}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
