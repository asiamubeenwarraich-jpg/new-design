import React, { useState } from 'react';
import { CustomerInquiry, galleryDatabase } from '../../services/galleryDatabase';
import { Mail, Phone, Clock, CheckCircle, Trash2, ExternalLink } from 'lucide-react';

export const AdminInquiries: React.FC = () => {
  const inquiries = galleryDatabase.getInquiries();

  const handleStatus = (id: string, newStatus: CustomerInquiry['status']) => {
    galleryDatabase.updateInquiryStatus(id, newStatus);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this inquiry record?')) {
      galleryDatabase.deleteInquiry(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif text-[#141416] tracking-tight">
            Client Inquiries & VIP Commissions ({inquiries.length})
          </h2>
          <p className="text-xs text-[#71717A] mt-0.5">
            Bespoke commission requests and private collector communications.
          </p>
        </div>
      </div>

      {/* List */}
      {inquiries.length === 0 ? (
        <div className="bg-white border border-[#E5E5E8] rounded-lg p-12 text-center">
          <Mail className="w-8 h-8 text-[#A1A1AA] mx-auto mb-2" />
          <h3 className="text-sm font-medium text-[#141416]">No Inquiries Yet</h3>
          <p className="text-xs text-[#71717A] mt-1">
            Private viewing and bespoke commission inquiries will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className="bg-white border border-[#E5E5E8] rounded-lg p-5 space-y-3 hover:border-[#141416] transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#F0F0F2]">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                      inq.status === 'NEW'
                        ? 'bg-amber-100 text-amber-900'
                        : inq.status === 'REPLIED'
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-zinc-100 text-zinc-800'
                    }`}
                  >
                    {inq.status}
                  </span>
                  <span className="font-serif font-medium text-base text-[#141416]">
                    {inq.name}
                  </span>
                  <span className="text-xs text-[#71717A]">({inq.email})</span>
                  {inq.phone && (
                    <span className="text-xs text-[#71717A] font-mono">
                      • {inq.phone}
                    </span>
                  )}
                </div>

                <div className="text-[11px] font-mono text-[#71717A]">
                  {new Date(inq.createdAt || inq.date || Date.now()).toLocaleString()}
                </div>
              </div>

              <div>
                <div className="text-xs font-mono uppercase text-[#71717A] mb-1">
                  Subject: <strong className="text-[#141416] font-sans normal-case">{inq.subject}</strong>
                </div>
                <p className="text-xs text-[#555555] leading-relaxed bg-[#F9F9FB] p-3 rounded border border-[#E5E5E8]">
                  "{inq.message}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <a
                  href={`mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.subject)} - Art Gallery Studio`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#141416] hover:bg-black text-white text-xs font-mono uppercase rounded transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>

                <div className="flex items-center gap-2">
                  <select
                    value={inq.status}
                    onChange={(e) => handleStatus(inq.id, e.target.value as any)}
                    className="px-2 py-1 bg-[#F4F4F6] border border-[#DCDCE0] rounded text-xs font-mono cursor-pointer"
                  >
                    <option value="NEW">Status: NEW</option>
                    <option value="REPLIED">Status: REPLIED</option>
                    <option value="ARCHIVED">Status: ARCHIVED</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => handleDelete(inq.id)}
                    className="p-1.5 text-red-500 hover:text-red-700 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
