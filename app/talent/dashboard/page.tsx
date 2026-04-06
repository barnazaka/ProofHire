'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, UserCircle, Wallet,
  ShieldCheck, ChevronRight, AlertTriangle,
  Fingerprint, Zap, Lock, Loader2,
  LogOut, Copy, Check, Award,
  LayoutDashboard, History, MessageSquare,
  UserCheck, Terminal, Globe,
  Cpu, Rocket, Briefcase, ZapIcon
} from 'lucide-react';
import { shortenAddress } from '@/components/WalletIntegration';
import ThemeToggle from '@/components/ThemeToggle';
import CVDashboard from '@/components/CVDashboard';

export default function TalentDashboard() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const router = useRouter();

  useEffect(() => {
    const savedAddress = localStorage.getItem('user_address');
    const savedRole = localStorage.getItem('user_role');

    if (savedAddress && savedRole === 'talent') {
      const onboarded = localStorage.getItem('onboarding_complete');
      if (onboarded !== 'true') {
        router.push('/talent/onboarding');
        return;
      }
      setWalletAddress(savedAddress);
      setWalletConnected(true);
    } else {
      router.push('/talent/auth');
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
      {/* LEFT SIDEBAR */}
      <aside className="w-80 border-r border-zinc-900 flex flex-col p-8 sticky top-0 h-screen">
         <div className="flex items-center gap-3 mb-16">
            <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20">
               <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">ProofHire.</span>
         </div>

         <div className="flex-1 space-y-2">
            <SidebarItem id="dashboard" icon={LayoutDashboard} label="Sovereign OS" />
            <SidebarItem id="requests" icon={MessageSquare} label="Interview Requests" status="0" />
            <SidebarItem id="status" icon={UserCheck} label="Hired Status" status="OFF" />
            <SidebarItem id="contracts" icon={Terminal} label="ZK Contracts" status="Active" />
         </div>

         <div className="mt-auto space-y-6">
            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-[2rem] space-y-4">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 italic">Midnight Mainnet</span>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">Gas Tank</p>
                  <p className="text-xl font-black italic text-white uppercase tracking-tighter">1,240.50 DUST</p>
               </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-6 py-4 bg-white/5 border border-white/10 hover:bg-rose-900/20 hover:border-rose-900/50 hover:text-rose-500 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest italic"
            >
               <LogOut className="w-4 h-4" />
               Disconnect Wallet
            </button>
         </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <header className="px-12 py-8 flex justify-between items-center bg-black/50 backdrop-blur-3xl border-b border-zinc-900 sticky top-0 z-50">
           <div className="flex flex-col">
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-indigo-500 italic">Talent Node</h2>
              <div className="flex items-center gap-3">
                 <Globe className="w-4 h-4 text-zinc-600" />
                 <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest italic">Global Marketplace Active</span>
              </div>
           </div>

           <div className="flex items-center gap-8">
              <ThemeToggle />

              <div className="relative group">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-5 pl-6 pr-3 py-3 bg-zinc-900 border border-zinc-800 rounded-[2rem] hover:border-indigo-600/50 transition-all shadow-2xl"
                >
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none">Identity Address</span>
                    <span className="text-xs font-black italic font-mono text-white tracking-tight">{shortenAddress(walletAddress || '')}</span>
                  </div>
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-[10px] font-black italic shadow-inner border-2 border-white/10">
                    {walletAddress?.slice(-2).toUpperCase()}
                  </div>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-4 w-72 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] shadow-3xl p-6 space-y-4 z-[60] animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="space-y-1 pb-4 border-b border-zinc-800">
                      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest italic">Lace Wallet v1.2</p>
                      <p className="text-sm font-black italic text-white uppercase tracking-tighter">Midnight Testnet</p>
                    </div>

                    <div className="space-y-2">
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

                       <Link
                         href="/talent/onboarding?edit=true"
                         className="w-full flex items-center gap-3 p-4 hover:bg-white/5 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white"
                       >
                         <Edit3 className="w-4 h-4" />
                         Reset CV Profile
                       </Link>
                    </div>
                  </div>
                )}
              </div>
           </div>
        </header>

        {/* PAGE BODY */}
        <main className="p-12 max-w-7xl w-full mx-auto">
          {activePage === 'dashboard' ? (
             <CVDashboard />
          ) : (
             <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-24 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] flex items-center justify-center text-zinc-700 animate-pulse">
                   <Terminal className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-2xl font-black italic uppercase tracking-tighter text-zinc-400">Node Synchronizing</h3>
                   <p className="text-xs font-medium text-zinc-600 uppercase tracking-[0.2em]">Accessing {activePage} encrypted state...</p>
                </div>
             </div>
          )}
        </main>
      </div>
    </div>
  );
}

const Edit3 = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);
