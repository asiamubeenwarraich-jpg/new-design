import React from 'react';
import { Painting } from '../../data/paintings';
import { OrderRecord, galleryDatabase } from '../../services/galleryDatabase';
import {
  Palette,
  Sparkles,
  CheckCircle2,
  ShoppingBag,
  Clock,
  CheckCircle,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Plus,
  Tag,
  ExternalLink,
} from 'lucide-react';
import { AdminTab } from './AdminSidebar';

export interface AdminDashboardOverviewProps {
  onSelectTab: (tab: AdminTab) => void;
  onSelectOrder: (orderNumber: string) => void;
  onEditProduct: (id: string) => void;
  onNavigateHome: () => void;
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({
  onSelectTab,
  onSelectOrder,
  onEditProduct,
  onNavigateHome,
}) => {
  const stats = galleryDatabase.getDashboardStats();
  const settings = galleryDatabase.getStoreSettings();

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white border border-[#E5E5E8] rounded-lg p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#71717A] block mb-1">
            Studio Headquarters
          </span>
          <h2 className="text-xl sm:text-2xl font-serif text-[#141416] tracking-tight">
            Welcome to Art Gallery Control Desk
          </h2>
          <p className="text-xs text-[#71717A] mt-1 font-sans">
            Single-source inventory, active acquisitions, and fine art fulfillment for {settings.storeName}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onSelectTab('product-new')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#141416] hover:bg-black text-white text-xs font-mono uppercase tracking-wider rounded transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Artwork</span>
          </button>
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#F4F4F6] hover:bg-[#EAEAEF] text-[#141416] text-xs font-mono uppercase tracking-wider rounded border border-[#DCDCE0] transition-colors cursor-pointer"
          >
            <span>Live Store</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#71717A]" />
          </button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
        {/* TOTAL PRODUCTS */}
        <div
          onClick={() => onSelectTab('products')}
          className="bg-white border border-[#E5E5E8] rounded-lg p-3.5 sm:p-4 hover:border-[#141416] transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1.5 text-[#71717A]">
            <span className="text-[10px] font-mono uppercase tracking-wider">Products</span>
            <Palette className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl sm:text-2xl font-serif font-medium text-[#141416]">
            {stats.totalProducts}
          </div>
          <span className="text-[10px] text-[#71717A] font-sans">Total catalog</span>
        </div>

        {/* AVAILABLE */}
        <div
          onClick={() => onSelectTab('products')}
          className="bg-white border border-[#E5E5E8] rounded-lg p-3.5 sm:p-4 hover:border-[#141416] transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1.5 text-emerald-600">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717A]">Available</span>
            <CheckCircle className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl sm:text-2xl font-serif font-medium text-emerald-700">
            {stats.availablePaintings}
          </div>
          <span className="text-[10px] text-[#71717A] font-sans">In inventory</span>
        </div>

        {/* NEW PAINTINGS */}
        <div
          onClick={() => onSelectTab('new-paintings')}
          className="bg-white border border-[#E5E5E8] rounded-lg p-3.5 sm:p-4 hover:border-[#141416] transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1.5 text-amber-600">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717A]">New</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl sm:text-2xl font-serif font-medium text-amber-700">
            {stats.newPaintings}
          </div>
          <span className="text-[10px] text-[#71717A] font-sans">Status = NEW</span>
        </div>

        {/* SOLD */}
        <div
          onClick={() => onSelectTab('sold-paintings')}
          className="bg-white border border-[#E5E5E8] rounded-lg p-3.5 sm:p-4 hover:border-[#141416] transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1.5 text-[#71717A]">
            <span className="text-[10px] font-mono uppercase tracking-wider">Sold</span>
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl sm:text-2xl font-serif font-medium text-[#71717A]">
            {stats.soldPaintings}
          </div>
          <span className="text-[10px] text-[#71717A] font-sans">Archived</span>
        </div>

        {/* ORDERS */}
        <div
          onClick={() => onSelectTab('orders')}
          className="bg-white border border-[#E5E5E8] rounded-lg p-3.5 sm:p-4 hover:border-[#141416] transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1.5 text-[#71717A]">
            <span className="text-[10px] font-mono uppercase tracking-wider">Orders</span>
            <ShoppingBag className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl sm:text-2xl font-serif font-medium text-[#141416]">
            {stats.totalOrders}
          </div>
          <span className="text-[10px] text-[#71717A] font-sans">All orders</span>
        </div>

        {/* PENDING */}
        <div
          onClick={() => onSelectTab('orders')}
          className="bg-white border border-[#E5E5E8] rounded-lg p-3.5 sm:p-4 hover:border-[#141416] transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1.5 text-amber-600">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717A]">Pending</span>
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl sm:text-2xl font-serif font-medium text-amber-700">
            {stats.pendingOrders}
          </div>
          <span className="text-[10px] text-[#71717A] font-sans">Needs action</span>
        </div>

        {/* COMPLETED */}
        <div
          onClick={() => onSelectTab('orders')}
          className="bg-white border border-[#E5E5E8] rounded-lg p-3.5 sm:p-4 hover:border-[#141416] transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1.5 text-emerald-600">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717A]">Fulfilled</span>
            <CheckCircle className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl sm:text-2xl font-serif font-medium text-emerald-700">
            {stats.completedOrders}
          </div>
          <span className="text-[10px] text-[#71717A] font-sans">Delivered</span>
        </div>

        {/* REVENUE */}
        <div
          onClick={() => onSelectTab('orders')}
          className="bg-white border border-[#E5E5E8] rounded-lg p-3.5 sm:p-4 hover:border-[#141416] transition-colors cursor-pointer col-span-2 sm:col-span-1 lg:col-span-1"
        >
          <div className="flex items-center justify-between mb-1.5 text-indigo-600">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717A]">Revenue</span>
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <div className="text-base sm:text-lg font-serif font-medium text-[#141416] truncate" title={`Rs. ${stats.revenue.toLocaleString()}`}>
            Rs. {(stats.revenue / 1000).toFixed(0)}k
          </div>
          <span className="text-[10px] text-[#71717A] font-sans">PKR sales</span>
        </div>
      </div>

      {/* Low Stock Warning Alert if any */}
      {stats.lowStockPaintings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900">
          <div className="flex items-start sm:items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <div className="text-xs font-mono uppercase font-bold tracking-wider">
                Low Inventory Notice: {stats.lowStockPaintings.length} Piece(s) at or below threshold
              </div>
              <div className="text-xs text-amber-800 mt-0.5">
                {stats.lowStockPaintings.map((p) => p.title).join(', ')}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSelectTab('inventory')}
            className="self-start sm:self-auto px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-mono uppercase tracking-wider rounded transition-colors cursor-pointer shrink-0"
          >
            Review Inventory
          </button>
        </div>
      )}

      {/* Dual Column: Recent Orders + Recent Artworks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders Card */}
        <div className="bg-white border border-[#E5E5E8] rounded-lg p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E5E5E8]">
            <div>
              <h3 className="text-sm font-serif font-medium text-[#141416]">
                Recent Orders
              </h3>
              <p className="text-[11px] text-[#71717A]">
                Latest collector acquisitions and checkouts
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSelectTab('orders')}
              className="text-xs font-mono uppercase text-[#141416] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {stats.recentOrders.length === 0 ? (
            <p className="text-xs text-[#71717A] py-6 text-center">
              No orders recorded yet.
            </p>
          ) : (
            <div className="divide-y divide-[#F0F0F2]">
              {stats.recentOrders.map((order) => (
                <div
                  key={order.orderNumber}
                  onClick={() => onSelectOrder(order.orderNumber)}
                  className="py-3 flex items-center justify-between hover:bg-[#F9F9FB] -mx-2 px-2 rounded cursor-pointer transition-colors"
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-medium text-[#141416]">
                        {order.orderNumber}
                      </span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.2 rounded uppercase ${
                          order.orderStatus === 'DELIVERED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.orderStatus === 'SHIPPED'
                            ? 'bg-blue-100 text-blue-800'
                            : order.orderStatus === 'PROCESSING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-zinc-100 text-zinc-800'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                    <p className="text-xs text-[#71717A] truncate mt-0.5">
                      {order.customerName || order.customerEmail} • {order.items.length} item(s)
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-serif font-medium text-[#141416] block">
                      Rs. {order.total.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-mono text-[#71717A]">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recently Added Paintings */}
        <div className="bg-white border border-[#E5E5E8] rounded-lg p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E5E5E8]">
            <div>
              <h3 className="text-sm font-serif font-medium text-[#141416]">
                Catalog Artworks
              </h3>
              <p className="text-[11px] text-[#71717A]">
                Recent additions and updated gallery pieces
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSelectTab('products')}
              className="text-xs font-mono uppercase text-[#141416] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-[#F0F0F2]">
            {stats.recentPaintings.map((painting) => {
              const isSold =
                painting.status === 'sold_out' ||
                painting.status === 'SOLD_OUT' ||
                (painting.stockQuantity !== undefined && painting.stockQuantity <= 0);

              return (
                <div
                  key={painting.id}
                  onClick={() => onEditProduct(painting.id)}
                  className="py-2.5 flex items-center justify-between hover:bg-[#F9F9FB] -mx-2 px-2 rounded cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    <img
                      src={painting.image || '/images/hero-painting.jpg'}
                      alt={painting.title}
                      className="w-10 h-10 object-cover rounded bg-[#E5E5E8] shrink-0"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-[#141416] truncate">
                        {painting.title}
                      </div>
                      <div className="text-[11px] text-[#71717A] truncate">
                        {painting.category || 'Calligraphy'} • {painting.dimensions}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-serif font-medium text-[#141416] block">
                      {painting.formattedPrice}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded uppercase ${
                        isSold
                          ? 'bg-zinc-100 text-zinc-600'
                          : painting.status === 'NEW'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isSold ? 'SOLD' : painting.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Access Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => onSelectTab('new-paintings')}
          className="bg-white border border-[#E5E5E8] rounded-lg p-4 hover:border-[#141416] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2 mb-2 text-amber-700">
            <Sparkles className="w-4 h-4" />
            <h4 className="text-xs font-mono uppercase tracking-wider font-bold">
              New Paintings Section
            </h4>
          </div>
          <p className="text-xs text-[#71717A]">
            Manage all pieces flagged with Status = NEW. Public site displays them live under /paintings/new.
          </p>
        </div>

        <div
          onClick={() => onSelectTab('packs')}
          className="bg-white border border-[#E5E5E8] rounded-lg p-4 hover:border-[#141416] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2 mb-2 text-[#141416]">
            <Tag className="w-4 h-4" />
            <h4 className="text-xs font-mono uppercase tracking-wider font-bold">
              Art Packs & Suites
            </h4>
          </div>
          <p className="text-xs text-[#71717A]">
            Create and edit 3-piece and 5-piece miniature canvas gift packs with custom pricing.
          </p>
        </div>

        <div
          onClick={() => onSelectTab('discounts')}
          className="bg-white border border-[#E5E5E8] rounded-lg p-4 hover:border-[#141416] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2 mb-2 text-emerald-700">
            <Tag className="w-4 h-4" />
            <h4 className="text-xs font-mono uppercase tracking-wider font-bold">
              Promotional Coupons
            </h4>
          </div>
          <p className="text-xs text-[#71717A]">
            Active coupons like ART10 and WELCOME5 validated securely during customer checkout.
          </p>
        </div>
      </div>
    </div>
  );
};
