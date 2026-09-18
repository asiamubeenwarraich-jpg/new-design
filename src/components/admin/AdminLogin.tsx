import React, { useState } from 'react';
import { galleryDatabase, AdminRole, AdminSession } from '../../services/galleryDatabase';
import { Lock, Shield, Mail, Key, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export interface AdminLoginProps {
  onLoginSuccess: (session: AdminSession) => void;
  onNavigateHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onNavigateHome }) => {
  const [email, setEmail] = useState<string>('admin@gallery.com');
  const [password, setPassword] = useState<string>('admin123');
  const [selectedRole, setSelectedRole] = useState<AdminRole>('SUPER_ADMIN');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid administrator email address.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      try {
        const session = galleryDatabase.loginAdmin(email.trim(), selectedRole);
        onLoginSuccess(session);
      } catch (err: any) {
        setError(err.message || 'Authentication failed. Please check credentials.');
      } finally {
        setLoading(false);
      }
    }, 400);
  };

  const handleQuickLogin = (quickEmail: string, role: AdminRole) => {
    setEmail(quickEmail);
    setSelectedRole(role);
    setLoading(true);
    setTimeout(() => {
      const session = galleryDatabase.loginAdmin(quickEmail, role);
      onLoginSuccess(session);
    }, 250);
  };

  return (
    <div className="min-h-screen bg-[#F4F4F6] text-[#141416] flex flex-col justify-center items-center px-4 py-12 selection:bg-[#141416] selection:text-white">
      {/* Container Card */}
      <div className="w-full max-w-md bg-white border border-[#E5E5E8] shadow-sm rounded-lg p-6 sm:p-8">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 bg-[#141416] text-white rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-mono tracking-widest text-[#767676] uppercase block mb-1">
            Secure Management Console
          </span>
          <h1 className="text-2xl font-serif tracking-tight text-[#141416]">
            ART GALLERY ADMIN
          </h1>
          <p className="text-xs text-[#767676] mt-1 font-sans">
            calligraphy__by_ulain8261 Private Studio Desk
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#555555] mb-1.5">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#999999] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gallery.com"
                className="w-full pl-9 pr-3 py-2.5 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-sm text-[#141416] placeholder-[#999999] focus:outline-none focus:border-[#141416] focus:bg-white transition-all font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#555555] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-[#999999] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-sm text-[#141416] placeholder-[#999999] focus:outline-none focus:border-[#141416] focus:bg-white transition-all font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#555555] mb-1.5">
              Role Authority
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as AdminRole)}
              className="w-full px-3 py-2.5 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-sm text-[#141416] focus:outline-none focus:border-[#141416] focus:bg-white font-sans cursor-pointer"
            >
              <option value="SUPER_ADMIN">SUPER_ADMIN (Full Gallery & System Control)</option>
              <option value="ADMIN">ADMIN (Products, Orders, Customers, Sales)</option>
              <option value="EDITOR">EDITOR (Products & Content Management)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#141416] hover:bg-black text-white text-xs font-mono uppercase tracking-widest rounded transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
          >
            {loading ? (
              <span>Verifying Authorization...</span>
            ) : (
              <>
                <span>Sign In to Admin Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Quick Testing Login Helper */}
        <div className="mt-6 pt-5 border-t border-[#ECECED]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#777777] block mb-2.5 text-center">
            Instant Test Login Profiles
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@gallery.com', 'SUPER_ADMIN')}
              className="px-2 py-1.5 bg-[#F4F4F6] hover:bg-[#EBEBEF] text-[11px] font-sans text-[#141416] rounded border border-[#DCDCE0] transition-colors text-center cursor-pointer"
              title="Full access"
            >
              <span className="font-medium block">Super Admin</span>
              <span className="text-[9px] text-[#767676]">All Access</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('curator@gallery.com', 'ADMIN')}
              className="px-2 py-1.5 bg-[#F4F4F6] hover:bg-[#EBEBEF] text-[11px] font-sans text-[#141416] rounded border border-[#DCDCE0] transition-colors text-center cursor-pointer"
              title="Curator & Orders"
            >
              <span className="font-medium block">Curator</span>
              <span className="text-[9px] text-[#767676]">Catalog & Sales</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('editor@gallery.com', 'EDITOR')}
              className="px-2 py-1.5 bg-[#F4F4F6] hover:bg-[#EBEBEF] text-[11px] font-sans text-[#141416] rounded border border-[#DCDCE0] transition-colors text-center cursor-pointer"
              title="Content only"
            >
              <span className="font-medium block">Editor</span>
              <span className="text-[9px] text-[#767676]">Content</span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onNavigateHome}
            className="text-xs text-[#666666] hover:text-[#141416] underline underline-offset-4 cursor-pointer font-sans"
          >
            ← Return to Public Gallery Storefront
          </button>
        </div>
      </div>
    </div>
  );
};
