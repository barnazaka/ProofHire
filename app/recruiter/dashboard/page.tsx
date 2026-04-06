'use client';

import { useState, useEffect } from 'react';
import {
  ShieldCheck, LayoutDashboard, User, MessageSquare, Settings, LogOut, Loader2, Fingerprint, Lock, Globe, Copy, Wallet
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';

export default function RecruiterDashboard() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const address = localStorage.getItem('proofhire_wallet_address');
    setWalletAddress(address);
  }, []);

  const SidebarItem = ({ icon: Icon, label, active = false }: any) => (
    <button className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black uppercase italic text-[10px] tracking-widest ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-zinc-500 hover:bg-zinc-900 hover:text-white'}`}>
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans flex">
      {/* Sidebar */}
      <aside className="w-80 border-r border-zinc-900 p-8 flex flex-col justify-between sticky top-0 h-screen">
        <div className="space-y-12">
           <div className="flex items-center gap-3 px-2">
             <ShieldCheck className="w-8 h-8 text-indigo-500" />
             <span className="text-2xl font-black italic uppercase tracking-tighter">Recruiter OS</span>
           </div>

           <nav className="space-y-2">
              <SidebarItem icon={LayoutDashboard} label="Overview" active />
              <SidebarItem icon={User} label="Talent Search" />
              <SidebarItem icon={MessageSquare} label="Shortlist" />
              <SidebarItem icon={Settings} label="Requirements" />
           </nav>
        </div>

        <button
          onClick={() => {
             localStorage.clear();
             router.push('/');
          }}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-zinc-500 hover:bg-red-500/10 hover:text-red-500 transition-all font-black uppercase italic text-[10px] tracking-widest"
        >
           <LogOut className="w-4 h-4" />
           Logout Recruiter
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-12 overflow-y-auto">
         <header className="flex justify-between items-center mb-16">
            <div className="space-y-1">
               <h1 className="text-4xl font-black italic uppercase tracking-tighter">Hiring <span className="text-indigo-600">Dashboard.</span></h1>
               <p className="text-zinc-500 text-sm font-medium italic">Active node: {walletAddress?.slice(0, 16)}...</p>
            </div>
            <div className="flex items-center gap-6">
                <div className="px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center gap-3">
                   <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Midnight Ledger Online</span>
                </div>
                <ThemeToggle />
            </div>
         </header>

         <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 space-y-8">
               <div className="p-12 bg-indigo-600 rounded-[3rem] text-white relative overflow-hidden group shadow-3xl shadow-indigo-600/30">
                  <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
                     <Globe className="w-48 h-48" />
                  </div>
                  <div className="space-y-8 relative z-10">
                     <div className="space-y-4">
                        <h2 className="text-6xl font-black uppercase italic tracking-tightest leading-none">Global <br /> Talent Pool.</h2>
                        <p className="text-white/70 text-lg font-medium italic max-w-sm">Discover and verify candidates with mathematical certainty using Zero-Knowledge Proofs.</p>
                     </div>
                     <button
                       onClick={() => router.push('/marketplace')}
                       className="px-10 py-5 bg-white text-black rounded-2xl font-black uppercase italic text-[10px] tracking-widest hover:bg-black hover:text-white transition-all shadow-xl"
                     >
                        Open Search Engine
                     </button>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-8">
                  <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] space-y-6">
                     <div className="flex justify-between items-start">
                        <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center border border-indigo-600/20 text-indigo-500">
                           <MessageSquare className="w-6 h-6" />
                        </div>
                        <span className="text-[24px] font-black italic tracking-tighter">0</span>
                     </div>
                     <div>
                        <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Pending Requests</h3>
                        <p className="text-zinc-500 text-[10px] font-medium italic uppercase tracking-widest mt-1">Verification Access</p>
                     </div>
                  </div>

                  <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] space-y-6">
                     <div className="flex justify-between items-start">
                        <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center border border-indigo-600/20 text-indigo-500">
                           <Lock className="w-6 h-6" />
                        </div>
                        <span className="text-[24px] font-black italic tracking-tighter">0</span>
                     </div>
                     <div>
                        <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">ZK Verifications</h3>
                        <p className="text-zinc-500 text-[10px] font-medium italic uppercase tracking-widest mt-1">Total On-Chain Calls</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="space-y-8">
               <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] space-y-8">
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-600 italic">System Health</h3>
                  <div className="space-y-6">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <Fingerprint className="w-4 h-4 text-indigo-500" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">Indexer</span>
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-green-500">Online</span>
                     </div>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <ShieldCheck className="w-4 h-4 text-indigo-500" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">WASM Prover</span>
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-green-500">Online</span>
                     </div>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <Wallet className="w-4 h-4 text-indigo-500" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">Lace Wallet</span>
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-green-500">Connected</span>
                     </div>
                  </div>
               </div>

               <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-600 italic">Recruiter Identity</h3>
                  <div className="p-4 bg-black rounded-2xl border border-zinc-800 flex items-center justify-between overflow-hidden">
                     <code className="text-[10px] text-indigo-500 truncate mr-4">{walletAddress || 'Searching...'}</code>
                     <Copy className="w-3 h-3 text-zinc-700 flex-shrink-0 cursor-pointer hover:text-white" onClick={() => {
                        navigator.clipboard.writeText(walletAddress || '');
                        alert('Address copied!');
                     }} />
                  </div>
               </div>
            </div>
         </div>
      </main>
    </div>
  );
}
