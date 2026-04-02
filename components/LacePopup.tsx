'use client';

import { ShieldCheck, X, Wallet, Fingerprint, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface LacePopupProps {
  isOpen: boolean;
  onClose: () => void;
  status: string | null;
  address?: string;
}

export default function LacePopup({ isOpen, onClose, status, address }: LacePopupProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      const timer = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!show && !isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>

      <div className={`relative w-full max-w-[400px] bg-zinc-900 border border-zinc-800 rounded-[2rem] shadow-3xl overflow-hidden transition-all duration-500 transform ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>
        {/* Lace Header */}
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-gradient-to-r from-zinc-900 to-zinc-800">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                 <ShieldCheck className="w-6 h-6 text-black" />
              </div>
              <div className="flex flex-col">
                 <span className="text-sm font-black text-white uppercase tracking-tighter">Lace Wallet</span>
                 <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Connect Request</span>
              </div>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
              <X className="w-5 h-5 text-zinc-500" />
           </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
           <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                 <div className="absolute -inset-4 bg-indigo-600/20 blur-xl rounded-full animate-pulse"></div>
                 <div className="relative w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-700">
                    <Fingerprint className="w-10 h-10 text-indigo-500" />
                 </div>
              </div>
              <div className="space-y-1">
                 <h3 className="text-xl font-black text-white uppercase italic">Authentication</h3>
                 <p className="text-zinc-500 text-xs font-medium max-w-[240px] mx-auto leading-relaxed">
                    ProofHire Protocol is requesting permission to view your public address and sign a message.
                 </p>
              </div>
           </div>

           <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-4 space-y-3">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-600">
                 <span>Status</span>
                 <span className="text-indigo-500">Active</span>
              </div>
              <div className="h-[2px] bg-zinc-800 rounded-full overflow-hidden">
                 <div className={`h-full bg-indigo-600 transition-all duration-[2000ms] ${status ? 'w-full' : 'w-1/3'}`}></div>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
                 {status?.includes('Connecting') || status?.includes('Signing') ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                 ) : (
                    <Wallet className="w-3 h-3" />
                 )}
                 <span>{status || 'Waiting for interaction...'}</span>
              </div>
           </div>

           {address && (
              <div className="flex items-center justify-between p-4 bg-indigo-600/10 border border-indigo-600/20 rounded-xl">
                 <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Connected</span>
                 <span className="text-[10px] font-mono text-white truncate max-w-[150px]">{address}</span>
              </div>
           )}

           <div className="grid grid-cols-2 gap-4">
              <button
                onClick={onClose}
                className="py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Cancel
              </button>
              <button
                className="py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
              >
                Confirm
              </button>
           </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-black/40 text-center">
           <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em]">Securely Encrypted by Midnight Network</p>
        </div>
      </div>
    </div>
  );
}
