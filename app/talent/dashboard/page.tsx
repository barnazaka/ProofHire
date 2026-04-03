'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, UserCircle, Wallet, ShieldCheck, ChevronRight, AlertTriangle, Fingerprint, Zap, Lock, Loader2, LogOut, Copy, Check, Award } from 'lucide-react';
import ClaimForm from '@/components/ClaimForm';
import ProofGenerator from '@/components/ProofGenerator';
import { shortenAddress } from '@/components/WalletIntegration';
import ThemeToggle from '@/components/ThemeToggle';

export default function TalentDashboard() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedAddress = localStorage.getItem('user_address');
    const savedRole = localStorage.getItem('user_role');

    if (savedAddress && savedRole === 'talent') {
      setWalletAddress(savedAddress);
      setWalletConnected(true);
    } else {
      // Not authenticated or wrong role, redirect to auth
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
      <div className="flex min-h-screen bg-white dark:bg-black items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black font-sans text-zinc-900 dark:text-white transition-colors duration-300">
      <header className="px-10 py-6 flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/50 backdrop-blur-2xl sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/" className="mr-4 p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl transition-all">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-3">
             <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20">
                <ShieldCheck className="w-6 h-6 text-white" />
             </div>
             <span className="text-2xl font-black tracking-tighter uppercase italic">Talent OS</span>
          </div>

          <nav className="hidden md:flex items-center gap-4">
            <Link href="/talent/profile" className="flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-white transition-colors text-xs font-black uppercase tracking-widest border border-white/5 rounded-xl bg-white/5">
              <UserCircle className="w-4 h-4" />
              Sovereign Profile
            </Link>
            <Link href="/talent/proofs" className="flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
              <Award className="w-4 h-4" />
              Proof Factory
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-4 px-5 py-2.5 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:border-indigo-500"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-black font-mono tracking-tight">
                {shortenAddress(walletAddress || '')}
              </span>
              <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-[10px] font-black italic shadow-inner">
                {walletAddress?.slice(-2).toUpperCase()}
              </div>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] shadow-2xl p-4 space-y-2 z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 mb-2">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Authenticated via</p>
                  <p className="text-sm font-black italic">Lace Wallet v1.2</p>
                </div>

                <button
                  onClick={copyAddress}
                  className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-2xl transition-colors text-xs font-black uppercase tracking-widest"
                >
                  <span className="flex items-center gap-3">
                    <Copy className="w-4 h-4 text-zinc-400" />
                    {copied ? 'Copied!' : 'Copy Address'}
                  </span>
                  {copied && <Check className="w-4 h-4 text-green-500" />}
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-4 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-600 rounded-2xl transition-colors text-xs font-black uppercase tracking-widest"
                >
                  <LogOut className="w-4 h-4" />
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-screen-2xl mx-auto w-full p-8 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 h-full animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="lg:col-span-5 h-full">
            <ClaimForm />
          </div>
          <div className="lg:col-span-7 h-full">
            <ProofGenerator />
          </div>
        </div>
      </main>

      <footer className="px-10 py-8 border-t border-zinc-200 dark:border-zinc-800 text-center flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-6">
           <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              Private State Verification Active
           </span>
           <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
        </div>
        <div className="mt-4 md:mt-0 text-[11px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
           Protocol: <span className="text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-lg italic">Midnight Compact v0.22</span>
        </div>
        <div className="mt-4 md:mt-0 text-zinc-400 text-[10px] font-black uppercase tracking-widest">
          No personal data leaves this device
        </div>
      </footer>
    </div>
  );
}
