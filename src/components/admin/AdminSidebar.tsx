import React from 'react';
import { AdminRole, AdminSession } from '../../services/galleryDatabase';
import {
  LayoutDashboard,
  Palette,
  Sparkles,
  CheckCircle2,
  FolderTree,
  Gift,
  Package,
  Boxes,
  ShoppingBag,
  CreditCard,
  Users,
  Tag,
  Home,
  MessageSquare,
  Mail,
  Settings,
  ShieldCheck,
  FileText,
  ExternalLink,
  LogOut,
  X,
} from 'lucide-react';

export type AdminTab =
  | 'dashboard'
  | 'products'
  | 'product-new'
  | 'product-edit'
  | 'new-paintings'
  | 'sold-paintings'
  | 'categories'
  | 'gifts'
  | 'packs'
  | 'inventory'
  | 'orders'
  | 'order-detail'
  | 'payments'
  | 'customers'
  | 'customer-detail'
  | 'discounts'
  | 'homepage'
  | 'messages'
  | 'newsletter'
  | 'settings'
  | 'users'
  | 'audit-log';

export interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  session: AdminSession | null;
  onLogout: () => void;
  onNavigateHome: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  pendingOrdersCount?: number;
  unreadMessagesCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  session,
  onLogout,
  onNavigateHome,
  isOpenMobile,
  onCloseMobile,
  pendingOrdersCount = 0,
  unreadMessagesCount = 0,
}) => {
  const role: AdminRole = session?.user?.role || 'SUPER_ADMIN';

  const navItems = [
    {
      group: 'OVERVIEW',
      items: [
        { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      group: 'CATALOG',
      items: [
        { id: 'products' as AdminTab, label: 'Products', icon: Palette },
        { id: 'new-paintings' as AdminTab, label: 'New Paintings', icon: Sparkles },
        { id: 'sold-paintings' as AdminTab, label: 'Sold Paintings', icon: CheckCircle2 },
        { id: 'categories' as AdminTab, label: 'Categories', icon: FolderTree },
        { id: 'gifts' as AdminTab, label: 'Gifts', icon: Gift },
        { id: 'packs' as AdminTab, label: 'Packs', icon: Package },
        { id: 'inventory' as AdminTab, label: 'Inventory', icon: Boxes },
      ],
    },
    {
      group: 'SALES',
      items: [
        {
          id: 'orders' as AdminTab,
          label: 'Orders',
          icon: ShoppingBag,
          badge: pendingOrdersCount > 0 ? `${pendingOrdersCount}` : undefined,
        },
        { id: 'payments' as AdminTab, label: 'Payments', icon: CreditCard },
        { id: 'customers' as AdminTab, label: 'Customers', icon: Users },
        { id: 'discounts' as AdminTab, label: 'Discounts', icon: Tag },
      ],
    },
    {
      group: 'CONTENT',
      items: [
        { id: 'homepage' as AdminTab, label: 'Homepage', icon: Home },
        {
          id: 'messages' as AdminTab,
          label: 'Messages',
          icon: MessageSquare,
          badge: unreadMessagesCount > 0 ? `${unreadMessagesCount}` : undefined,
        },
        { id: 'newsletter' as AdminTab, label: 'Newsletter', icon: Mail },
      ],
    },
    {
      group: 'SYSTEM',
      items: [
        { id: 'settings' as AdminTab, label: 'Settings', icon: Settings },
        ...(role === 'SUPER_ADMIN'
          ? [
              { id: 'users' as AdminTab, label: 'Admin Users', icon: ShieldCheck },
              { id: 'audit-log' as AdminTab, label: 'Audit Log', icon: FileText },
            ]
          : []),
      ],
    },
  ];

  const handleTabClick = (tab: AdminTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container (Desktop: fixed left 260px; Mobile: Drawer 280px) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#141416] text-[#E4E4E7] flex flex-col border-r border-[#26262A] transition-transform duration-250 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Banner */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-[#26262A] shrink-0 bg-[#101012]">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono tracking-widest text-[#88888D] uppercase leading-none">
              Art Gallery Console
            </span>
            <span className="text-sm font-serif tracking-wider text-white font-medium mt-1">
              ART GALLERY ADMIN
            </span>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-[#88888D] hover:text-white rounded hover:bg-[#26262A] transition-colors cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
          {navItems.map((group) => (
            <div key={group.group}>
              <div className="px-3 mb-1.5 text-[10px] font-mono tracking-widest text-[#71717A] uppercase">
                {group.group}
              </div>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  // Handle active tab matching (including sub-views like product-new matching products)
                  const isActive =
                    currentTab === item.id ||
                    (item.id === 'products' && (currentTab === 'product-new' || currentTab === 'product-edit')) ||
                    (item.id === 'orders' && currentTab === 'order-detail') ||
                    (item.id === 'customers' && currentTab === 'customer-detail');

                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => handleTabClick(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-sans transition-colors cursor-pointer text-left ${
                          isActive
                            ? 'bg-[#27272A] text-white font-medium shadow-xs'
                            : 'text-[#A1A1AA] hover:text-white hover:bg-[#1E1E22]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={`w-4 h-4 shrink-0 ${
                              isActive ? 'text-white' : 'text-[#71717A]'
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="ml-2 px-1.5 py-0.5 text-[10px] font-mono bg-white text-[#141416] rounded-full font-bold">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer & User Profile */}
        <div className="p-3 border-t border-[#26262A] bg-[#101012] shrink-0 space-y-2">
          {/* Quick link to public website */}
          <button
            type="button"
            onClick={onNavigateHome}
            className="w-full flex items-center justify-between px-3 py-2 bg-[#1A1A1E] hover:bg-[#26262A] text-[#D4D4D8] hover:text-white text-xs rounded border border-[#2E2E33] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#A1A1AA]" />
              <span>Public Storefront</span>
            </span>
            <span className="text-[10px] font-mono text-[#71717A]">LIVE</span>
          </button>

          {/* User info & logout */}
          <div className="pt-2 flex items-center justify-between px-2">
            <div className="min-w-0 flex-1 mr-2">
              <div className="text-xs text-white font-medium truncate">
                {session?.user?.name || 'Admin User'}
              </div>
              <div className="text-[10px] font-mono text-[#A1A1AA] flex items-center gap-1.5 truncate">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span className="truncate">{session?.user?.role || 'SUPER_ADMIN'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onLogout}
              title="Sign Out"
              className="p-1.5 text-[#71717A] hover:text-white hover:bg-[#26262A] rounded transition-colors cursor-pointer shrink-0"
              aria-label="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
