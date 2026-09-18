import React, { useState, useEffect } from 'react';
import { Painting } from '../../data/paintings';
import { galleryDatabase, AdminSession } from '../../services/galleryDatabase';
import { AdminSidebar, AdminTab } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminDashboardOverview } from './AdminDashboardOverview';
import { AdminProductsList } from './AdminProductsList';
import { AdminProductForm } from './AdminProductForm';
import { AdminNewPaintings } from './AdminNewPaintings';
import { AdminSoldPaintings } from './AdminSoldPaintings';
import { AdminCategories } from './AdminCategories';
import { AdminGifts } from './AdminGifts';
import { AdminPacks } from './AdminPacks';
import { AdminInventory } from './AdminInventory';
import { AdminOrders } from './AdminOrders';
import { AdminOrderDetail } from './AdminOrderDetail';
import { AdminPayments } from './AdminPayments';
import { AdminCustomers } from './AdminCustomers';
import { AdminDiscounts } from './AdminDiscounts';
import { AdminInquiries } from './AdminInquiries';
import { AdminSettings } from './AdminSettings';

export interface AdminLayoutProps {
  session: AdminSession;
  onLogout: () => void;
  onViewPublicStore: () => void;
  onViewProductPublic: (painting: Painting) => void;
  onNavigatePublicNew: () => void;
  onNavigatePublicSold: () => void;
  onNavigatePublicGifts: () => void;
  onNavigatePublicPacks: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  session,
  onLogout,
  onViewPublicStore,
  onViewProductPublic,
  onNavigatePublicNew,
  onNavigatePublicSold,
  onNavigatePublicGifts,
  onNavigatePublicPacks,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [viewingOrderNumber, setViewingOrderNumber] = useState<string | null>(null);
  const [globalSearch, setGlobalSearch] = useState('');

  // Re-render when database updates
  const [, setDbVersion] = useState(0);
  useEffect(() => {
    const unsub = galleryDatabase.subscribe(() => {
      setDbVersion((v) => v + 1);
    });
    return unsub;
  }, []);

  const handleSelectTab = (tab: AdminTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    if (tab !== 'product-edit') {
      setEditingProductId(null);
    }
    if (tab !== 'orders') {
      setViewingOrderNumber(null);
    }
  };

  const handleEditProduct = (id: string) => {
    setEditingProductId(id);
    setActiveTab('product-edit');
  };

  const handleViewOrder = (orderNumber: string) => {
    setViewingOrderNumber(orderNumber);
    setActiveTab('orders');
  };

  return (
    <div className="min-h-screen bg-[#F8F8FA] flex text-[#141416] antialiased">
      {/* Sidebar for Desktop & Drawer for Mobile */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onLogout={onLogout}
        onViewPublicWebsite={onViewPublicStore}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Header */}
        <AdminHeader
          activeTab={activeTab}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onViewPublicWebsite={onViewPublicStore}
          onAddNewPainting={() => handleSelectTab('product-new')}
          onLogout={onLogout}
          adminName={session.user.name}
          adminEmail={session.user.email}
          adminRole={session.user.role}
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
        />

        {/* Dynamic Admin Body View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <AdminDashboardOverview
              onSelectTab={handleSelectTab}
              onEditProduct={handleEditProduct}
              onViewOrder={handleViewOrder}
            />
          )}

          {activeTab === 'products' && (
            <AdminProductsList
              onSelectTab={handleSelectTab}
              onEditProduct={handleEditProduct}
              onViewProductPublic={onViewProductPublic}
            />
          )}

          {activeTab === 'product-new' && (
            <AdminProductForm
              productId={null}
              onBack={() => handleSelectTab('products')}
              onViewProductPublic={onViewProductPublic}
              onSelectTab={handleSelectTab}
            />
          )}

          {activeTab === 'product-edit' && (
            <AdminProductForm
              productId={editingProductId}
              onBack={() => handleSelectTab('products')}
              onViewProductPublic={onViewProductPublic}
              onSelectTab={handleSelectTab}
            />
          )}

          {activeTab === 'new-paintings' && (
            <AdminNewPaintings
              onSelectTab={handleSelectTab}
              onEditProduct={handleEditProduct}
              onViewProductPublic={onViewProductPublic}
            />
          )}

          {activeTab === 'sold-paintings' && (
            <AdminSoldPaintings
              onSelectTab={handleSelectTab}
              onEditProduct={handleEditProduct}
              onViewProductPublic={onViewProductPublic}
              onNavigatePublicSold={onNavigatePublicSold}
            />
          )}

          {activeTab === 'categories' && <AdminCategories />}

          {activeTab === 'gifts' && (
            <AdminGifts
              onSelectTab={handleSelectTab}
              onViewProductPublic={onViewProductPublic}
              onNavigatePublicGifts={onNavigatePublicGifts}
            />
          )}

          {activeTab === 'packs' && (
            <AdminPacks
              onSelectTab={handleSelectTab}
              onNavigatePublicPacks={onNavigatePublicPacks}
            />
          )}

          {activeTab === 'inventory' && <AdminInventory />}

          {activeTab === 'orders' && (
            viewingOrderNumber ? (
              <AdminOrderDetail
                orderNumber={viewingOrderNumber}
                onBack={() => setViewingOrderNumber(null)}
              />
            ) : (
              <AdminOrders onSelectOrder={handleViewOrder} />
            )
          )}

          {activeTab === 'payments' && (
            <AdminPayments onSelectOrder={handleViewOrder} />
          )}

          {activeTab === 'customers' && (
            <AdminCustomers onSelectOrder={handleViewOrder} />
          )}

          {activeTab === 'discounts' && <AdminDiscounts />}

          {activeTab === 'inquiries' && <AdminInquiries />}

          {activeTab === 'settings' && <AdminSettings />}
        </main>
      </div>
    </div>
  );
};
