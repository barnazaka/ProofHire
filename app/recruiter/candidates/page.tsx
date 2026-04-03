'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Briefcase, Zap, Search, CheckCircle2, User, Award, Loader2, LogOut, Copy, Check, LayoutDashboard, FileText, Fingerprint, Shield } from 'lucide-react';
import { shortenAddress } from '@/components/WalletIntegration';
import ThemeToggle from '@/components/ThemeToggle';

interface CandidateProof {
  id: string;
  candidateId: string;
  type: string;
  timestamp: string;
  hash: string;
  status: string;
  isBadge?: boolean;
}

export default function RecruiterCandidates() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [proofs, setProofs] = useState<CandidateProof[]>([]);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [verified, setVerified] = useState<Record<string, boolean>>({});
  const router = useRouter();

  useEffect(() => {
    const savedAddress = localStorage.getItem('user_address');
    const savedRole = localStorage.getItem('user_role');

    if (savedAddress && savedRole === 'recruiter') {
      setWalletAddress(savedAddress);
      setWalletConnected(true);

      // Load proofs from "global" state
      const globalProofs = JSON.parse(localStorage.getItem('proofhire_proofs_global') || '[]');
      setProofs(globalProofs);
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

  const verifyProof = async (id: string) => {
    setVerifying(id);
    // Simulate Midnight network verification call
    await new Promise(resolve => setTimeout(resolve, 2500));
    setVerified(prev => ({ ...prev, [id]: true }));
    setVerifying(null);
  };

  if (!walletConnected) {
    return (
      <div className="flex min-h-screen bg-black items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black font-sans text-white">
      <header className="px-10 py-6 flex justify-between items-center border-b border-zinc-800 bg-black/50 backdrop-blur-2xl sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20">
                <ShieldCheck className="w-6 h-6 text-white" />
             </div>
             <span className="text-2xl font-black tracking-tighter uppercase italic">ZK Browser</span>
          </div>

          <nav className="hidden md:flex items-center gap-4">
            <Link href="/recruiter/dashboard" className="flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link href="/recruiter/requirements" className="flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
              <FileText className="w-4 h-4" />
              Job Requirements
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-4 px-5 py-2.5 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-sm transition-all hover:border-indigo-500"
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
              <div className="absolute right-0 mt-3 w-64 bg-zinc-900 border border-zinc-800 rounded-[2rem] shadow-2xl p-4 space-y-2 z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-zinc-800 mb-2">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Authenticated via</p>
                  <p className="text-sm font-black italic">Lace Wallet v1.2</p>
                </div>

                <button
                  onClick={copyAddress}
                  className="w-full flex items-center justify-between p-4 hover:bg-zinc-800 rounded-2xl transition-colors text-xs font-black uppercase tracking-widest"
                >
                  <span className="flex items-center gap-3">
                    <Copy className="w-4 h-4 text-zinc-400" />
                    {copied ? 'Copied!' : 'Copy Address'}
                  </span>
                  {copied && <Check className="w-4 h-4 text-green-500" />}
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-4 hover:bg-rose-900/20 text-rose-600 rounded-2xl transition-colors text-xs font-black uppercase tracking-widest"
                >
                  <LogOut className="w-4 h-4" />
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-8 lg:p-12">
        <div className="mb-12">
           <h2 className="text-4xl font-black italic uppercase tracking-tightest mb-2">Public Proof Ledger</h2>
           <p className="text-zinc-500 text-sm font-medium italic">Mathematicly verify candidate claims without exposing private identity data.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          {proofs.length === 0 ? (
            <div className="text-center py-32 bg-zinc-900/30 border-2 border-dashed border-zinc-800 rounded-[3rem] flex flex-col items-center gap-6">
               <div className="w-20 h-20 bg-zinc-800 rounded-3xl flex items-center justify-center border border-zinc-700 text-zinc-600">
                  <Fingerprint className="w-10 h-10" />
               </div>
               <div className="space-y-1">
                  <h3 className="text-xl font-black italic uppercase">No Proofs Found</h3>
                  <p className="text-zinc-500 text-sm max-w-[300px] mx-auto">Candidates have not yet published any cryptographic claims to the global ledger.</p>
               </div>
            </div>
          ) : (
            proofs.map(proof => (
              <div key={proof.id} className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8 transition-all hover:border-indigo-500/50 shadow-2xl relative overflow-hidden group">
                 <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center border border-zinc-700 shadow-inner group-hover:bg-indigo-600/10 transition-colors">
                       {proof.type.includes('Degree') ? <Award className="w-8 h-8 text-indigo-500" /> : <Shield className="w-8 h-8 text-indigo-500" />}
                    </div>
                    <div className="space-y-1">
                       <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">ID: {proof.candidateId}</span>
                          <div className="w-1.5 h-1.5 bg-zinc-700 rounded-full"></div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{proof.timestamp}</span>
                       </div>
                       <h3 className="text-2xl font-black italic uppercase tracking-tighter">{proof.type}</h3>
                       <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-600 bg-black/40 px-3 py-1 rounded-lg w-fit border border-white/5">
                          <Copy className="w-3 h-3" />
                          {proof.hash}
                       </div>
                    </div>
                 </div>

                 <div className="flex items-center gap-4 relative z-10">
                    {verified[proof.id] ? (
                       <div className="flex items-center gap-3 px-8 py-4 bg-emerald-600/10 border border-emerald-600/20 rounded-2xl text-emerald-500 font-black uppercase italic tracking-widest text-sm animate-in zoom-in-95 duration-500">
                          <CheckCircle2 className="w-5 h-5" />
                          Valid Proof
                       </div>
                    ) : (
                       <button
                         onClick={() => verifyProof(proof.id)}
                         disabled={verifying === proof.id}
                         className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-black uppercase italic tracking-widest text-sm hover:bg-zinc-200 transition-all shadow-xl active:scale-95 disabled:opacity-50"
                       >
                          {verifying === proof.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                          {verifying === proof.id ? 'Verifying Math...' : 'Verify Proof'}
                       </button>
                    )}

                    <button className="p-4 bg-zinc-800 hover:bg-zinc-700 rounded-2xl transition-colors border border-zinc-700">
                       <ArrowLeft className="w-5 h-5 text-zinc-400 rotate-180" />
                    </button>
                 </div>

                 {/* Background decoration */}
                 <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-600/5 blur-3xl rounded-full translate-x-16 -translate-y-16"></div>
              </div>
            ))
          )}
        </div>
      </main>

      <footer className="px-10 py-8 border-t border-zinc-800 text-center flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-6">
           <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              Trustless Ledger Sync Active
           </span>
           <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
        </div>
        <div className="mt-4 md:mt-0 text-[11px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
           Engine: <span className="text-indigo-600 bg-indigo-900/20 px-3 py-1 rounded-lg italic">Midnight-Testnet Verifier</span>
        </div>
        <div className="mt-4 md:mt-0 text-zinc-400 text-[10px] font-black uppercase tracking-widest">
          Proof verification happens on the Midnight ledger
        </div>
      </footer>
    </div>
  );
}
