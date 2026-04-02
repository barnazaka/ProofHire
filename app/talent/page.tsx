'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, UserCircle, Wallet, ShieldCheck, ChevronRight, AlertTriangle, Fingerprint, Zap, Lock, Loader2, LogOut, Copy, Check } from 'lucide-react';
import ClaimForm from '@/components/ClaimForm';
import ProofGenerator from '@/components/ProofGenerator';
import { connectLaceWallet, isLaceInstalled, shortenAddress } from '@/components/WalletIntegration';
import ThemeToggle from '@/components/ThemeToggle';

export default function TalentDashboard() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isLacePresent, setIsLacePresent] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsLacePresent(isLaceInstalled());
    const savedAddress = localStorage.getItem('proofhire_wallet');
    if (savedAddress) {
      setWalletAddress(savedAddress);
      setWalletConnected(true);
    }
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    const result = await connectLaceWallet() as any;
    if (result && result.address) {
      setWalletAddress(result.address);
      setWalletConnected(true);
      localStorage.setItem('proofhire_wallet', result.address);
    }
    setIsConnecting(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('proofhire_wallet');
    setWalletAddress(null);
    setWalletConnected(false);
    setShowDropdown(false);
  };

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {!walletConnected ? (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="group relative flex items-center gap-3 px-8 py-3.5 bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl active:scale-95 disabled:opacity-50"
            >
              {isConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wallet className="w-4 h-4" />}
              {isConnecting ? 'Authenticating...' : 'Connect Lace'}
            </button>
          ) : (
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
          )}
        </div>
      </header>

      <main className="flex-1 max-w-screen-2xl mx-auto w-full p-8 lg:p-12">
        {!walletConnected ? (
          <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="relative mb-12">
               <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] rounded-full"></div>
               <div className="relative p-10 bg-white dark:bg-zinc-900 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-none border border-zinc-100 dark:border-zinc-800 ring-1 ring-black/5">
                  <Fingerprint className="w-24 h-24 text-indigo-600" />
               </div>
               <div className="absolute -top-4 -right-4 p-4 bg-amber-500 rounded-3xl shadow-xl shadow-amber-500/20 rotate-12">
                  <Lock className="w-8 h-8 text-white" />
               </div>
            </div>

            <h2 className="text-6xl font-black tracking-tightest mb-6 max-w-2xl bg-clip-text text-transparent bg-gradient-to-br from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-600 leading-tight">
               Secure your career with <span className="text-indigo-600">Zero Knowledge.</span>
            </h2>
            <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-xl mb-12 font-medium leading-relaxed">
              Your professional identity belongs to you. Connect your wallet to build verified, private-state credentials on the Midnight Network.
            </p>

            {!isLacePresent && (
              <div className="mb-12 p-5 bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100/50 dark:border-indigo-900/50 rounded-3xl flex items-center gap-5 text-indigo-700 dark:text-indigo-300 max-w-lg mx-auto text-left shadow-sm">
                <div className="p-3 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm">
                   <AlertTriangle className="w-6 h-6 text-indigo-500" />
                </div>
                <div>
                   <p className="text-sm font-black uppercase tracking-widest mb-1">Extension Required</p>
                   <p className="text-xs font-medium leading-relaxed opacity-80">
                      Lace Wallet is not detected. We will use a secure, temporary identity for this session.
                   </p>
                </div>
              </div>
            )}

            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="group relative flex items-center gap-4 px-12 py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-500/40 hover:scale-[1.03] active:scale-[0.97] overflow-hidden"
            >
              {isConnecting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform" />}
              {isConnecting ? 'Verifying Node...' : 'Establish Secure Connection'}
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>

            <p className="mt-10 text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em]">
               Protocols by <span className="text-zinc-600 dark:text-zinc-300 underline underline-offset-4 decoration-indigo-500/50">IOG</span> & <span className="text-zinc-600 dark:text-zinc-300 underline underline-offset-4 decoration-indigo-500/50">Midnight</span>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 h-full animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="lg:col-span-5 h-full">
              <ClaimForm />
            </div>
            <div className="lg:col-span-7 h-full">
              <ProofGenerator />
            </div>
          </div>
        )}
      </main>

      <footer className="px-10 py-8 border-t border-zinc-200 dark:border-zinc-800 text-center flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-6">
           <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              Private State Verification Active
           </span>
           <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
        </div>
        <div className="mt-4 md:mt-0 text-[11px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
           Built for the <span className="text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-lg">Midnight Hackathon 2026</span>
        </div>
        <div className="mt-4 md:mt-0 text-zinc-400 text-[10px] font-black uppercase tracking-widest">
          No personal data leaves this device
        </div>
      </footer>
    </div>
  );
}
