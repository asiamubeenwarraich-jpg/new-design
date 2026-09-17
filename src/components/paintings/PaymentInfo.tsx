import React from 'react';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export const PaymentInfo: React.FC = () => {
  return (
    <div 
      id="painting-payment-info-box" 
      className="w-full p-4 rounded-[2px] bg-[#FAFAF8] border border-[#EBEBEB] flex flex-col space-y-3"
    >
      <div className="flex items-center justify-between border-b border-[#E8E8E8] pb-2.5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#111111]" />
          <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#111111]">
            SECURE CHECKOUT
          </span>
        </div>
        <span className="text-[10px] text-[#777777] tracking-wider uppercase font-mono">
          256-bit SSL
        </span>
      </div>

      {/* Payment methods row */}
      <div className="flex flex-col space-y-1.5">
        <span className="text-[11px] text-[#666666]">
          Pay securely using:
        </span>
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[#333333]">
          <span className="px-2.5 py-1 bg-white border border-[#DCDCD8] rounded-[2px] text-[11px] font-bold text-[#1A1F71] shadow-2xs">
            VISA
          </span>
          <span className="px-2.5 py-1 bg-white border border-[#DCDCD8] rounded-[2px] text-[11px] font-bold text-[#EB001B] shadow-2xs">
            Mastercard
          </span>
          <span className="px-2.5 py-1 bg-white border border-[#DCDCD8] rounded-[2px] text-[11px] font-bold text-[#003087] shadow-2xs">
            PayPal
          </span>
          <span className="px-2.5 py-1 bg-white border border-[#DCDCD8] rounded-[2px] text-[10px] font-medium text-[#555555] shadow-2xs">
            Bank Transfer
          </span>
        </div>
      </div>

      {/* Trust bullet points */}
      <div className="pt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#777777]">
        <div className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
          <span>Secure payment</span>
        </div>
        <div className="flex items-center gap-1">
          <Lock className="w-3 h-3 text-[#555555]" />
          <span>Encrypted checkout</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
          <span>Safe & trusted gallery</span>
        </div>
      </div>
    </div>
  );
};
