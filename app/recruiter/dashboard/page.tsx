'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Briefcase, ShieldCheck, ChevronRight, Search, Lock, Zap, Loader2, LogOut, Copy, Check, ClipboardList, UserCheck, Sparkles } from 'lucide-react';
import { shortenAddress } from '@/components/WalletIntegration';
import ThemeToggle from '@/components/ThemeToggle';
import { motion } from 'framer-motion';

export default function RecruiterDashboard() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({
    activeRequirements: 0,
    candidatesFound: 0,
    verificationsDone: 0
  });
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [primaryFilter, setPrimaryFilter] = useState('');
  const router = useRouter();

  useEffect(() => {
    const savedAddress = localStorage.getItem('user_address');
    const savedRole = localStorage.getItem('user_role');

    if (savedAddress && savedRole === 'recruiter') {
      setWalletAddress(savedAddress);
      setWalletConnected(true);

      // Load stats
      const savedReqs = localStorage.getItem('proofhire_requirements');
      if (savedReqs) {
        setStats(prev => ({ ...prev, activeRequirements: JSON.parse(savedReqs).length }));
      }
      const globalProofs = localStorage.getItem('proofhire_proofs_global');
      if (globalProofs) {
        setStats(prev => ({ ...prev, candidatesFound: JSON.parse(globalProofs).length }));
      }

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

  if (!walletConnected) {
    return (
      <div className="flex min-h-screen bg-white dark:bg-black items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  const NavCard = ({ href, title, description, icon: Icon, color }: any) => (
    <Link href={href} className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-zinc-200 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 rounded-[2rem] opacity-75 group-hover:opacity-100 transition duration-300 blur-sm group-hover:blur-md group-hover:from-indigo-500 group-hover:to-purple-600"></div>
      <div className="relative flex flex-col h-full p-8 bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 transition-transform duration-300 group-hover:-translate-y-1">
        <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform`}>
          <Icon className="w-7 h-7" />
        </div>
        <h3 className="text-2xl font-black mb-3 tracking-tight group-hover:text-indigo-500 transition-colors uppercase italic">{title}</h3>
        <p className="text-zinc-500 text-sm leading-relaxed mb-8 font-medium">{description}</p>
        <div className="mt-auto flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 group-hover:gap-3 transition-all">
          Initialize <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );

  const saveFilter = (e: React.FormEvent) => {
    e.preventDefault();
    if (primaryFilter.trim()) {
      localStorage.setItem('recruiter_primary_filter', primaryFilter.trim());
      setShowFilterModal(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black font-sans text-zinc-900 dark:text-white transition-colors duration-300">
      {showFilterModal && (
          <div id="filter-modal" className="fixed inset-0 z-[100] flex items-center justify-center p-8">
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
                    To optimize your ZK-candidate discovery engine, specify your primary hiring target.
                    This helps the protocol prioritize relevant proof commitments.
                 </p>
              </div>
              <form onSubmit={saveFilter} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Primary Hiring Role / Skill</label>
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
                    Set Command Focus
                 </button>
              </form>
            </motion.div>
          </div>
        )}

      <header className="px-10 py-6 flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/50 backdrop-blur-2xl sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/" className="mr-4 p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl transition-all">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-3">
             <div className="p-2 bg-zinc-900 dark:bg-zinc-100 rounded-xl shadow-lg shadow-black/20">
                <ShieldCheck className="w-6 h-6 text-white dark:text-zinc-900" />
             </div>
             <span className="text-2xl font-black tracking-tighter uppercase italic">Recruiter Engine</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-4 px-5 py-2.5 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:border-indigo-500"
            >
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-black font-mono tracking-tight">
                {shortenAddress(walletAddress || '')}
              </span>
              <div className="w-8 h-8 bg-zinc-900 dark:bg-zinc-100 rounded-xl flex items-center justify-center text-white dark:text-zinc-900 text-[10px] font-black italic shadow-inner">
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
        <div className="mb-16 flex items-end justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-7xl font-black tracking-tighter mb-4 italic leading-none"
            >
              RECRUITER<br /><span className="text-indigo-600">COMMAND.</span>
            </motion.h1>
            <p className="text-zinc-400 font-black text-xs uppercase tracking-widest italic flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Automated Trust Engine Active
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex gap-6"
          >
            <div className="px-10 py-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] flex items-center gap-6 min-w-[200px]">
              <div>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-2">Rules Deployed</p>
                <p className="text-3xl font-black italic leading-none">{stats.activeRequirements}</p>
              </div>
            </div>
            <div className="px-10 py-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] flex items-center gap-6 min-w-[200px]">
              <div>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-2">Candidates Found</p>
                <p className="text-3xl font-black italic leading-none">{stats.candidatesFound}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
          <NavCard
            href="/recruiter/requirements"
            title="Rule Builder"
            description="Define the mathematical requirements for your open positions. Specify skills and experience thresholds."
            icon={ClipboardList}
            color="bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900"
          />
          <NavCard
            href="/recruiter/candidates"
            title="ZK Browser"
            description="Explore verified candidates who have already proven they meet your requirements on the ledger."
            icon={Search}
            color="bg-indigo-600"
          />
          <NavCard
            href="/recruiter/verify"
            title="Proof Terminal"
            description="Directly verify a specific candidate proof hash against the Midnight smart contract."
            icon={UserCheck}
            color="bg-purple-600"
          />
        </div>

        <div className="p-16 rounded-[4rem] bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 overflow-hidden relative group border border-zinc-800 dark:border-zinc-200">
          <div className="absolute bottom-0 right-0 p-12 opacity-5 dark:opacity-[0.03] group-hover:scale-125 transition-transform duration-700">
            <Lock className="w-96 h-96" />
          </div>
          <div className="max-w-2xl relative z-10">
            <h2 className="text-5xl font-black tracking-tighter mb-6 italic uppercase leading-none">Trust, Without Exposure.</h2>
            <p className="text-zinc-400 dark:text-zinc-500 text-lg mb-10 font-medium leading-relaxed">
              Verify credentials through mathematical certainty. Every candidate in the ProofHire ecosystem is pre-authenticated by the Midnight protocol before you even see their profile.
            </p>
            <button className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-2xl">
              Initialize Trust Protocol
            </button>
          </div>
        </div>
      </main>

      <footer className="px-10 py-12 border-t border-zinc-200 dark:border-zinc-800 text-center flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-6">
           <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              Automated Compliance Active
           </span>
           <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
        </div>
        <div className="mt-4 md:mt-0 text-[11px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
           Midnight Smart Contract: <span className="text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-lg italic font-mono uppercase tracking-tight">ProofHireContract_v1.0</span>
        </div>
      </footer>
    </div>
  );
}
