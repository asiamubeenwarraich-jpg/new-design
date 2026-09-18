import React from 'react';
import { AdminSession } from '../../services/galleryDatabase';
import { Menu, ExternalLink, Bell, Search, ShieldCheck } from 'lucide-react';
import { AdminTab } from './AdminSidebar';

export interface AdminHeaderProps {
  currentTab: AdminTab;
  session: AdminSession | null;
  onOpenMobileSidebar: () => void;
  onNavigateHome: () => void;
  pendingOrdersCount?: number;
  unreadMessagesCount?: number;
  onSelectTab: (tab: AdminTab) => void;
}

const TAB_TITLES: Record<AdminTab, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Live Gallery Overview & Analytics' },
  products: { title: 'Products Catalog', subtitle: 'Manage Artworks, Dimensions & Inventory' },
  'product-new': { title: 'Add New Artwork', subtitle: 'Publish New Painting to Gallery Catalog' },
  'product-edit': { title: 'Edit Artwork', subtitle: 'Update Painting Details, Pricing & Availability' },
  'new-paintings': { title: 'New Paintings', subtitle: 'Artworks with Status = NEW' },
  'sold-paintings': { title: 'Sold Paintings', subtitle: 'Archived & Sold Pieces' },
  categories: { title: 'Categories', subtitle: 'Manage Artwork Disciplines & Styles' },
  gifts: { title: 'Curated Gifts', subtitle: 'Paintings Designated for Art Collector Gifting' },
  packs: { title: 'Artwork Packs & Suites', subtitle: 'Multi-Piece Collector Suites & Bundles' },
  inventory: { title: 'Inventory & Stock', subtitle: 'Original Pieces Stock Quantities' },
  orders: { title: 'Orders Management', subtitle: 'Acquisitions, Fulfillment & Delivery Tracking' },
  'order-detail': { title: 'Order Details', subtitle: 'Order Summary, Invoicing & Packaging' },
  payments: { title: 'Payments & Transactions', subtitle: 'Direct Bank Transfers & Cash on Delivery' },
  customers: { title: 'Collector Directory', subtitle: 'Client Profiles & Purchase Histories' },
  'customer-detail': { title: 'Customer Profile', subtitle: 'Acquisitions & Contact Records' },
  discounts: { title: 'Discount Codes & Promotions', subtitle: 'Vouchers, Promotional Coupons & Caps' },
  homepage: { title: 'Homepage Configuration', subtitle: 'Hero Display, Banners & Featured Selections' },
  messages: { title: 'Collector Inquiries', subtitle: 'Inquiries, Commissions & Direct Inquiries' },
  newsletter: { title: 'Newsletter Subscribers', subtitle: 'VIP Collector Digest Subscribers' },
  settings: { title: 'Store Settings', subtitle: 'Gallery Profile, Shipping Rates & Policies' },
  users: { title: 'Admin Users & Roles', subtitle: 'Role-Based Access Management' },
  'audit-log': { title: 'Security Audit Log', subtitle: 'Immutable System Activity Records' },
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentTab,
  session,
  onOpenMobileSidebar,
  onNavigateHome,
  pendingOrdersCount = 0,
  unreadMessagesCount = 0,
  onSelectTab,
}) => {
  const currentMeta = TAB_TITLES[currentTab] || {
    title: 'Admin Management',
    subtitle: 'Art Gallery Management Console',
  };

  const totalNotifications = pendingOrdersCount + unreadMessagesCount;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#E5E5E8] flex items-center justify-between px-4 sm:px-6">
      {/* Left: Mobile hamburger & breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 -ml-2 text-[#555555] hover:text-[#141416] hover:bg-[#F4F4F6] rounded transition-colors cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-serif tracking-tight text-[#141416] truncate font-medium">
              {currentMeta.title}
            </h1>
            <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 bg-[#F4F4F6] text-[#71717A] rounded uppercase">
              Admin
            </span>
          </div>
          <p className="hidden md:block text-[11px] text-[#71717A] truncate font-sans">
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Actions, Notifications, View Public */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Notifications Button */}
        <button
          type="button"
          onClick={() => onSelectTab(pendingOrdersCount > 0 ? 'orders' : 'messages')}
          className="relative p-2 text-[#555555] hover:text-[#141416] hover:bg-[#F4F4F6] rounded transition-colors cursor-pointer"
          title={`${totalNotifications} Pending notifications`}
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {totalNotifications > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          )}
        </button>

        {/* Public Storefront Link */}
        <button
          type="button"
          onClick={onNavigateHome}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono tracking-wider uppercase text-[#141416] bg-[#F4F4F6] hover:bg-[#EAEAEF] border border-[#DCDCE0] rounded transition-colors cursor-pointer"
          title="Open Public Art Gallery Store"
        >
          <span>View Site</span>
          <ExternalLink className="w-3 h-3 text-[#71717A]" />
        </button>

        {/* User Pill */}
        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-[#E5E5E8]">
          <div className="w-7 h-7 bg-[#141416] text-white rounded-full flex items-center justify-center text-xs font-mono font-medium">
            {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="hidden lg:block text-left">
            <span className="block text-xs font-medium text-[#141416] leading-tight">
              {session?.user?.name || 'Administrator'}
            </span>
            <span className="block text-[10px] font-mono text-[#71717A] leading-tight">
              {session?.user?.role || 'SUPER_ADMIN'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
