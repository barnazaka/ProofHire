'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Briefcase, ShieldCheck,
  ChevronRight, Search, Lock, Zap,
  Loader2, LogOut, Copy, Check,
  ClipboardList, UserCheck, Sparkles,
  LayoutDashboard, MessageSquare, Target,
  Users, Terminal, Globe, Filter, X
} from 'lucide-react';
import { shortenAddress } from '@/components/WalletIntegration';
import ThemeToggle from '@/components/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import CandidateMarketplace from '@/components/CandidateMarketplace';

export default function RecruiterDashboard() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activePage, setActivePage] = useState('marketplace');
  const [primaryFilter, setPrimaryFilter] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedAddress = localStorage.getItem('user_address');
    const savedRole = localStorage.getItem('user_role');

    if (savedAddress && savedRole === 'recruiter') {
      setWalletAddress(savedAddress);
      setWalletConnected(true);

      const savedFilter = localStorage.getItem('recruiter_primary_filter');
      if (!savedFilter) {
        setShowFilterModal(true);
      } else {
        setPrimaryFilter(savedFilter);
      }
    } else {
      router.push('/recruiter/auth');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user_address');
    localStorage.removeItem('user_role');
    setWalletAddress(null);
    setWalletConnected(false);
    setShowDropdown(false);
    router.push('/');
  };

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const saveFilter = (e: React.FormEvent) => {
    e.preventDefault();
    if (primaryFilter.trim()) {
      localStorage.setItem('recruiter_primary_filter', primaryFilter.trim());
      setShowFilterModal(false);
    }
  };

  if (!walletConnected) {
    return (
      <div className="flex min-h-screen bg-black items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  const SidebarItem = ({ id, icon: Icon, label, status }: { id: string, icon: any, label: string, status?: string }) => (
    <button
      onClick={() => setActivePage(id)}
      className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all group ${activePage === id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-zinc-500 hover:bg-zinc-900 hover:text-white'}`}
    >
      <div className="flex items-center gap-4">
        <Icon className={`w-5 h-5 ${activePage === id ? 'text-white' : 'text-zinc-600 group-hover:text-indigo-500'} transition-colors`} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">{label}</span>
      </div>
      {status && (
        <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase ${activePage === id ? 'bg-white/20 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
          {status}
        </span>
      )}
    </button>
  );

  return (
    <div className="flex min-h-screen bg-black text-white font-sans selection:bg-indigo-600">
      {showFilterModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-3xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-[3.5rem] p-16 shadow-3xl text-center space-y-10"
            >
              <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-indigo-600/20">
                 <Search className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-4">
                 <h2 className="text-4xl font-black italic uppercase tracking-tightest text-white">Target Focus.</h2>
                 <p className="text-zinc-500 font-medium text-sm leading-relaxed px-8">
                    Specify your primary hiring target to calibrate the ZK discovery engine.
                 </p>
              </div>
              <form onSubmit={saveFilter} className="space-y-6">
                 <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 pl-2">Primary Hiring Role</label>
                    <input
                      autoFocus
                      value={primaryFilter}
                      onChange={(e) => setPrimaryFilter(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-2xl p-6 text-xl font-black italic text-white focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-zinc-800"
                      placeholder="e.g. Senior Rust Engineer"
                    />
                 </div>
                 <button
                   type="submit"
                   className="w-full py-6 bg-white text-black rounded-2xl font-black uppercase italic tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-xl"
                 >
                    Set Focus Area
                 </button>
              </form>
            </motion.div>
          </div>
        )}

      {/* LEFT SIDEBAR */}
      <aside className="w-80 border-r border-zinc-900 flex flex-col p-8 sticky top-0 h-screen">
         <div className="flex items-center gap-3 mb-16">
            <div className="p-2 bg-zinc-100 rounded-xl shadow-lg shadow-white/10">
               <ShieldCheck className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">Recruiter Engine.</span>
         </div>

         <div className="flex-1 space-y-2">
            <SidebarItem id="marketplace" icon={Search} label="Talent Marketplace" />
            <SidebarItem id="rules" icon={ClipboardList} label="Hiring Rules" status="1 Active" />
            <SidebarItem id="candidates" icon={Users} label="Sovereign Shortlist" status="0" />
            <SidebarItem id="terminal" icon={Terminal} label="Verification Console" />
         </div>

         <div className="mt-auto space-y-6">
            <div className="p-6 bg-indigo-600 rounded-[2rem] space-y-4 shadow-xl shadow-indigo-600/20">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-indigo-100/60 italic">Midnight Indexer</span>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-indigo-100/60 uppercase tracking-widest leading-none">Scanning Block</p>
                  <p className="text-xl font-black italic text-white uppercase tracking-tighter">#2,481,209</p>
               </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-6 py-4 bg-white/5 border border-white/10 hover:bg-rose-900/20 hover:border-rose-900/50 hover:text-rose-500 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest italic"
            >
               <LogOut className="w-4 h-4" />
               Disconnect Engine
            </button>
         </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <header className="px-12 py-8 flex justify-between items-center bg-black/50 backdrop-blur-3xl border-b border-zinc-900 sticky top-0 z-50">
           <div className="flex flex-col">
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-indigo-500 italic">Command Center</h2>
              <div className="flex items-center gap-3">
                 <Target className="w-4 h-4 text-zinc-600" />
                 <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest italic">{primaryFilter || 'General Focus'}</span>
              </div>
           </div>

           <div className="flex items-center gap-8">
              <button
                onClick={() => setShowFilterModal(true)}
                className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-colors"
              >
                 <Filter className="w-5 h-5 text-zinc-400" />
              </button>
              <ThemeToggle />

              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-5 pl-6 pr-3 py-3 bg-zinc-900 border border-zinc-800 rounded-[2rem] hover:border-indigo-600/50 transition-all shadow-2xl"
                >
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none">Command Address</span>
                    <span className="text-xs font-black italic font-mono text-white tracking-tight">{shortenAddress(walletAddress || '')}</span>
                  </div>
                  <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center text-black text-[10px] font-black italic shadow-inner border-2 border-white/10">
                    {walletAddress?.slice(-2).toUpperCase()}
                  </div>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-4 w-72 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] shadow-3xl p-6 space-y-4 z-[60] animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="space-y-1 pb-4 border-b border-zinc-800">
                      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest italic">Lace Wallet v1.2</p>
                      <p className="text-sm font-black italic text-white uppercase tracking-tighter">Midnight Testnet</p>
                    </div>
                    <button
                      onClick={copyAddress}
                      className="w-full flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white"
                    >
                      <span className="flex items-center gap-3">
                        <Copy className="w-4 h-4" />
                        {copied ? 'Copied!' : 'Copy Wallet'}
                      </span>
                      {copied && <Check className="w-4 h-4 text-green-500" />}
                    </button>
                  </div>
                )}
              </div>
           </div>
        </header>

        {/* PAGE BODY */}
        <main className="p-12 max-w-7xl w-full mx-auto">
          {activePage === 'marketplace' ? (
             <div className="space-y-12">
                <div className="flex items-end justify-between">
                   <div className="space-y-2">
                      <h1 className="text-6xl font-black italic uppercase tracking-tightest leading-none">Talent<br /><span className="text-indigo-600">Marketplace.</span></h1>
                      <div className="flex items-center gap-3">
                         <Users className="w-4 h-4 text-zinc-600" />
                         <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">Displaying sovereign nodes matching focus: {primaryFilter}</p>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <div className="px-6 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col gap-1">
                         <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Active Candidates</span>
                         <span className="text-2xl font-black italic text-white leading-none">248</span>
                      </div>
                      <div className="px-6 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col gap-1">
                         <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Midnight Block</span>
                         <span className="text-2xl font-black italic text-indigo-500 leading-none">2.4M</span>
                      </div>
                   </div>
                </div>

                <CandidateMarketplace />
             </div>
          ) : (
             <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-24 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] flex items-center justify-center text-zinc-700 animate-pulse">
                   <Target className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-2xl font-black italic uppercase tracking-tighter text-zinc-400">Rule Logic Initializing</h3>
                   <p className="text-xs font-medium text-zinc-600 uppercase tracking-[0.2em]">Synchronizing {activePage} with Midnight ledger...</p>
                </div>
             </div>
          )}
        </main>
      </div>
    </div>
  );
}
