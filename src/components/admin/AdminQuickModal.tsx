import React, { useState, useEffect } from 'react';
import { galleryDatabase, OrderRecord, SentEmail } from '../../services/galleryDatabase';
import { Painting } from '../../data/paintings';
import { AdminPacksManager } from './AdminPacksManager';
import { 
  Database, 
  Tag, 
  ShoppingBag, 
  Mail, 
  X, 
  Check, 
  AlertTriangle, 
  RefreshCw, 
  DollarSign, 
  Shield,
  Package,
  Plus,
  Gift
} from 'lucide-react';

interface AdminQuickModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'inventory' | 'packs' | 'orders' | 'emails';
}

export const AdminQuickModal: React.FC<AdminQuickModalProps> = ({ 
  isOpen, 
  onClose,
  defaultTab = 'inventory'
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'packs' | 'orders' | 'emails'>(defaultTab);
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [emails, setEmails] = useState<SentEmail[]>([]);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Add painting form states
  const [showAddPainting, setShowAddPainting] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState<number>(35000);
  const [newStatus, setNewStatus] = useState<'NEW' | 'available' | 'sold_out'>('NEW');
  const [newIsGift, setNewIsGift] = useState(false);
  const [newImage, setNewImage] = useState('/images/hero-painting.jpg');
  const [newMedium, setNewMedium] = useState('Oil on Canvas');

  const loadData = () => {
    setPaintings(galleryDatabase.getPaintings());
    setOrders(galleryDatabase.getOrders());
    setEmails(galleryDatabase.getSentEmails());
  };

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      loadData();
      const unsub = galleryDatabase.subscribe(loadData);
      return () => unsub();
    }
  }, [isOpen, defaultTab]);

  if (!isOpen) return null;

  const handleStartEditPrice = (painting: Painting) => {
    setEditingPriceId(painting.id);
    setTempPrice(String(painting.price));
  };

  const handleSavePrice = (id: string) => {
    const num = parseInt(tempPrice.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(num) && num > 0) {
      galleryDatabase.updatePaintingPrice(id, num);
      setEditingPriceId(null);
      setFeedbackMsg(`Price updated in database! Recalculated with Rs. ${num.toLocaleString()}`);
      setTimeout(() => setFeedbackMsg(null), 4000);
    }
  };

  const handleStatusChange = (id: string, newStatus: any) => {
    galleryDatabase.updatePaintingStatus(id, newStatus);
    setFeedbackMsg(`Status updated to ${newStatus.toUpperCase()}! Public pages synced.`);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleToggleGift = (id: string, currentVal: boolean | undefined) => {
    const newVal = !currentVal;
    galleryDatabase.updatePaintingGift(id, newVal);
    setFeedbackMsg(`Gift status updated to ${newVal ? 'YES (Visible in /gifts)' : 'NO'}!`);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleCreatePainting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    galleryDatabase.createPainting({
      title: newTitle.trim(),
      price: Number(newPrice),
      status: newStatus,
      isGift: newIsGift,
      image: newImage.trim() || '/images/hero-painting.jpg',
      medium: newMedium.trim() || 'Oil on Canvas',
    });

    setFeedbackMsg(`Product "${newTitle}" added to database with status: ${newStatus.toUpperCase()}!`);
    setShowAddPainting(false);
    setNewTitle('');
    setNewPrice(35000);
    setNewStatus('NEW');
    setNewIsGift(false);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleResetDatabase = () => {
    if (confirm('Reset database to default original artworks?')) {
      galleryDatabase.resetPaintingsDatabase();
      setFeedbackMsg('Database restored to default catalog.');
      setTimeout(() => setFeedbackMsg(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-2xl border border-[#D9D9D9] max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden text-[#141416]">
        {/* Modal Header */}
        <div className="bg-[#141416] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-sm font-bold tracking-wider uppercase">Art Gallery Database & Admin Panel</h2>
              <p className="text-[11px] text-[#A0A0A3]">Live database inventory, gift flags, status controls, and packs management</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="text-[#A0A0A3] hover:text-white p-1 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert */}
        {feedbackMsg && (
          <div className="bg-[#EBF7EE] border-b border-[#CDEBD4] px-6 py-2.5 text-xs text-[#2E7D32] flex items-center gap-2 font-medium">
            <Check className="w-4 h-4 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#E1E3E5] bg-[#F8F9FA] px-4 sm:px-6 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`py-3 px-3 sm:px-4 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'inventory'
                ? 'border-[#141416] text-[#141416] bg-white'
                : 'border-transparent text-[#707070] hover:text-[#141416]'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Paintings Inventory ({paintings.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('packs')}
            className={`py-3 px-3 sm:px-4 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'packs'
                ? 'border-[#141416] text-[#141416] bg-white'
                : 'border-transparent text-[#707070] hover:text-[#141416]'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Packs Management (/admin/packs)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-3 sm:px-4 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'orders'
                ? 'border-[#141416] text-[#141416] bg-white'
                : 'border-transparent text-[#707070] hover:text-[#141416]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Orders ({orders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('emails')}
            className={`py-3 px-3 sm:px-4 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'emails'
                ? 'border-[#141416] text-[#141416] bg-white'
                : 'border-transparent text-[#707070] hover:text-[#141416]'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Emails Log ({emails.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* TAB 1: INVENTORY */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E1E3E5] gap-3 text-xs">
                <p className="text-[#555558]">
                  Products with <strong>Status = NEW</strong> automatically show on <code className="bg-[#F0F0F2] px-1 py-0.5">/paintings/new</code>. Items with <strong>Gift = YES</strong> show on <code className="bg-[#F0F0F2] px-1 py-0.5">/gifts</code>.
                </p>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setShowAddPainting(!showAddPainting)}
                    className="px-3 py-1.5 bg-[#141416] text-white hover:bg-black rounded text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showAddPainting ? 'Close Form' : '+ Add Painting'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetDatabase}
                    className="px-3 py-1.5 bg-white border border-[#D9D9D9] hover:bg-[#F2F2F2] rounded text-[11px] font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Add New Painting Form */}
              {showAddPainting && (
                <form onSubmit={handleCreatePainting} className="bg-[#F8F9FA] border border-[#E1E3E5] p-4 rounded-sm space-y-3 text-xs">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#141416]">Add New Painting to Database</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#555558] mb-1">Painting Title *</label>
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="e.g., Lyrical Whispers in Gold"
                        required
                        className="w-full px-2.5 py-1.5 bg-white border border-[#D0D0D4] rounded outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#555558] mb-1">Price (PKR) *</label>
                      <input
                        type="number"
                        min="0"
                        step="500"
                        value={newPrice}
                        onChange={(e) => setNewPrice(Number(e.target.value))}
                        required
                        className="w-full px-2.5 py-1.5 bg-white border border-[#D0D0D4] rounded outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#555558] mb-1">Status</label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#D0D0D4] rounded outline-none"
                      >
                        <option value="NEW">NEW (Visible in /paintings/new)</option>
                        <option value="available">AVAILABLE</option>
                        <option value="sold_out">SOLD_OUT</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#555558] mb-1">Is this a Gift?</label>
                      <select
                        value={newIsGift ? 'YES' : 'NO'}
                        onChange={(e) => setNewIsGift(e.target.value === 'YES')}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#D0D0D4] rounded outline-none font-semibold"
                      >
                        <option value="YES">YES (Display in /gifts)</option>
                        <option value="NO">NO</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#555558] mb-1">Medium</label>
                      <input
                        type="text"
                        value={newMedium}
                        onChange={(e) => setNewMedium(e.target.value)}
                        placeholder="Oil & Mixed Media"
                        className="w-full px-2.5 py-1.5 bg-white border border-[#D0D0D4] rounded outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#555558] mb-1">Image URL</label>
                    <input
                      type="text"
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      placeholder="/images/hero-painting.jpg"
                      className="w-full px-2.5 py-1.5 bg-white border border-[#D0D0D4] rounded outline-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#141416] text-white hover:bg-black rounded font-semibold text-xs uppercase tracking-wider cursor-pointer"
                    >
                      Save Product to Database
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddPainting(false)}
                      className="px-3 py-2 bg-[#E1E3E5] hover:bg-[#D0D0D4] rounded text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Painting Inventory List */}
              <div className="divide-y divide-[#E1E3E5]">
                {paintings.map((painting) => {
                  const isSoldOut = painting.status === 'sold_out' || painting.status === 'SOLD_OUT';
                  const isNew = painting.status === 'NEW' || painting.status === 'new';
                  const isGift = Boolean(painting.isGift);

                  return (
                    <div key={painting.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={painting.image || (painting as any).primaryImage || '/images/hero-painting.jpg'} 
                          alt={painting.title} 
                          className="w-12 h-12 rounded object-cover border border-[#D9D9D9] shrink-0 bg-[#EFEFEF]" 
                        />
                        <div className="min-w-0">
                          <h4 className="font-semibold text-[#141416] truncate">{painting.title}</h4>
                          <span className="text-[11px] text-[#707070] block">{painting.artist} • {painting.medium}</span>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className={`inline-block px-2 py-0.5 text-[9px] font-bold uppercase rounded ${
                              isSoldOut 
                                ? 'bg-red-100 text-red-700' 
                                : isNew 
                                  ? 'bg-[#141416] text-white' 
                                  : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {painting.status.toUpperCase()}
                            </span>
                            {isGift && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-bold bg-amber-100 text-amber-900 rounded uppercase">
                                <Gift className="w-2.5 h-2.5" />
                                Gift
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right controls */}
                      <div className="flex flex-wrap items-center gap-3 shrink-0">
                        {/* Status dropdown */}
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] uppercase text-[#707070]">Status:</span>
                          <select
                            value={painting.status}
                            onChange={(e) => handleStatusChange(painting.id, e.target.value)}
                            className="px-2 py-1 bg-white border border-[#D0D0D4] rounded text-xs font-medium"
                          >
                            <option value="NEW">NEW</option>
                            <option value="available">AVAILABLE</option>
                            <option value="sold_out">SOLD_OUT</option>
                          </select>
                        </div>

                        {/* Gift toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleGift(painting.id, painting.isGift)}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer transition-colors border ${
                            isGift
                              ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                              : 'bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          Gift: {isGift ? 'YES' : 'NO'}
                        </button>

                        {/* Price editor */}
                        {editingPriceId === painting.id ? (
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-xs">Rs.</span>
                            <input
                              type="number"
                              value={tempPrice}
                              onChange={(e) => setTempPrice(e.target.value)}
                              className="w-24 px-2 py-1 text-xs border border-[#1773B0] rounded outline-none font-mono"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleSavePrice(painting.id)}
                              className="px-2 py-1 bg-[#141416] text-white rounded text-xs font-semibold cursor-pointer"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingPriceId(null)}
                              className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="text-right">
                            <span className="font-mono font-bold text-xs text-[#141416] block">
                              Rs. {painting.price.toLocaleString()}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleStartEditPrice(painting)}
                              className="text-[11px] text-[#8C6D3B] hover:underline cursor-pointer"
                            >
                              Edit Price
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: PACKS MANAGEMENT */}
          {activeTab === 'packs' && (
            <AdminPacksManager />
          )}

          {/* TAB 3: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#707070]">
                  No orders recorded yet. Complete a checkout test to view the order pipeline!
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div key={ord.orderNumber} className="border border-[#E1E3E5] rounded-md p-4 bg-[#FBFBFA] space-y-3 text-xs">
                      <div className="flex items-center justify-between border-b border-[#E1E3E5] pb-2 font-mono">
                        <span className="font-bold text-[#141416]">#{ord.orderNumber}</span>
                        <span className="text-[#707070]">{new Date(ord.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="font-semibold text-[#141416]">Customer:</p>
                          <p>{ord.customer.firstName} {ord.customer.lastName}</p>
                          <p className="text-[#707070]">{ord.customer.email}</p>
                          <p className="text-[#707070]">{ord.customer.phone}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-[#141416]">Shipping Address:</p>
                          <p>{ord.customer.address}, {ord.customer.city}</p>
                          <p className="text-[#707070]">{ord.customer.country}</p>
                        </div>
                      </div>
                      <div className="border-t border-[#E1E3E5] pt-2">
                        <p className="font-semibold text-[#141416] mb-1">Items Ordered:</p>
                        <div className="space-y-1">
                          {ord.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-[11px]">
                              <span>{item.title} (x{item.quantity})</span>
                              <span className="font-mono">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between font-bold text-xs pt-2 border-t border-[#E1E3E5] mt-2">
                          <span>Total Paid (COD):</span>
                          <span className="font-mono text-[#141416]">Rs. {ord.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: EMAILS */}
          {activeTab === 'emails' && (
            <div className="space-y-3">
              {emails.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#707070]">
                  No emails sent yet. Place an order to test email generation!
                </div>
              ) : (
                emails.map((em) => (
                  <div key={em.id} className="border border-[#E1E3E5] rounded p-3 bg-white text-xs space-y-1">
                    <div className="flex justify-between font-semibold">
                      <span>To: {em.to}</span>
                      <span className="text-[#707070] font-normal">{new Date(em.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="text-[11px] text-[#555558] font-medium">{em.subject}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#F8F9FA] px-6 py-3 border-t border-[#E1E3E5] text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#141416] hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded cursor-pointer"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
