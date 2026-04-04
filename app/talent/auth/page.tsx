'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, User, Zap, Lock, Globe, Loader2, Fingerprint, Award, CheckCircle2, AlertTriangle, ExternalLink, Info } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { connectLaceWallet, shortenAddress } from '@/components/WalletIntegration';

export default function TalentAuthPage() {
  const [activeTab, setActiveTab] = useState<'signup' | 'login'>('login');
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Auto-reconnect check
    const savedConnected = localStorage.getItem('proofhire_wallet_connected');
    const role = localStorage.getItem('user_role');
    if (savedConnected === 'true' && role === 'talent') {
      handleConnect(true);
    }
  }, []);

  const handleConnect = async (isAuto = false) => {
    setIsConnecting(true);
    setError(null);

    try {
      const connection = await connectLaceWallet();

      if (connection) {
        setWalletAddress(connection.address);
        localStorage.setItem('user_address', connection.address);
        localStorage.setItem('proofhire_wallet_address', connection.address);
        localStorage.setItem('proofhire_wallet_connected', 'true');
        localStorage.setItem('user_role', 'talent');

        // Successful connection
        if (!isAuto) {
           await new Promise(resolve => setTimeout(resolve, 1000));
        }

        const onboarded = localStorage.getItem('onboarding_complete');
        if (onboarded === 'true') {
          router.push('/talent/dashboard');
        } else {
          router.push('/talent/onboarding');
        }
      } else {
        if (!isAuto) {
          setError('Lace Wallet extension NOT detected.');
        }
        setIsConnecting(false);
      }
    } catch (err: any) {
      console.error('Connection failed:', err);
      setError(`Connection failed. Make sure Lace is set to Preview network and try again.`);
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500 selection:text-white overflow-hidden relative flex items-center justify-center">
      {/* Background Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900/10 via-black to-purple-900/10"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <header className="fixed top-0 w-full z-20 px-10 py-8 flex justify-between items-center">
        <Link href="/launch" className="group flex items-center gap-4 text-zinc-400 hover:text-white transition-colors">
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl group-hover:bg-zinc-800 transition-colors shadow-2xl">
            <ArrowLeft className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold uppercase tracking-[0.2em]">Exit Terminal</span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="relative z-10 w-full max-w-7xl px-8 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-32 py-20">
        {/* Visual Decoration */}
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8 }}
           className="hidden lg:block flex-1 max-w-md relative"
        >
           <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] rounded-full"></div>
           <div className="relative aspect-square rounded-[4rem] border border-white/10 overflow-hidden shadow-3xl flex items-center justify-center bg-zinc-900/30 backdrop-blur-3xl group">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-30 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
              <motion.div
                 animate={{ y: [0, -10, 0] }}
                 transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                 className="relative z-10 p-12 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-2xl shadow-inner flex flex-col items-center gap-8"
              >
                 <div className="w-24 h-24 rounded-[2rem] bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-600/40">
                    <User className="w-12 h-12 text-white" />
                 </div>
                 <div className="space-y-4 text-center">
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter">Sovereign Talent</h3>
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/5">
                       <Zap className="w-3 h-3 text-indigo-400" />
                       Midnight Preview Active
                    </div>
                 </div>
                 <div className="flex gap-4 opacity-50">
                    <Fingerprint className="w-6 h-6" />
                    <Award className="w-6 h-6" />
                    <Globe className="w-6 h-6" />
                 </div>
              </motion.div>
           </div>
        </motion.div>

        {/* Auth Card */}
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.6 }}
           className="w-full max-w-md"
        >
           <div className="bg-zinc-900/60 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] shadow-3xl overflow-hidden flex flex-col">
              <div className="p-12 pb-8 flex flex-col items-center text-center">
                 <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center mb-8 shadow-2xl shadow-indigo-600/20">
                    <ShieldCheck className="w-10 h-10 text-white" />
                 </div>
                 <h2 className="text-3xl font-black italic uppercase tracking-tightest mb-4">Talent Gateway</h2>
                 <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-[240px]">
                    Connect your Lace Wallet to enter the ProofHire ecosystem on Midnight Preview.
                 </p>
              </div>

              <div className="px-12 pb-4">
                 <div className="flex p-1.5 bg-black/40 rounded-2xl border border-white/5">
                    <button
                      onClick={() => setActiveTab('login')}
                      className={`flex-1 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'login' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                       Log In
                    </button>
                    <button
                      onClick={() => setActiveTab('signup')}
                      className={`flex-1 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'signup' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                       Sign Up
                    </button>
                 </div>
              </div>

              <div className="p-12 pt-8 flex flex-col items-center gap-6">
                 <div className="w-full p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-indigo-400">
                       <Info className="w-4 h-4 flex-shrink-0" />
                       <span className="text-[9px] font-black uppercase tracking-widest">Network Requirements</span>
                    </div>
                    <ul className="text-[9px] font-medium text-zinc-500 space-y-1.5 list-decimal pl-4 leading-relaxed">
                       <li>Open Lace extension, go to Settings &gt; Midnight</li>
                       <li>Set Network to Preview</li>
                       <li>Set Proof Server to: https://lace-proof-pub.preview.midnight.network</li>
                       <li>Save and refresh this page before connecting</li>
                    </ul>
                 </div>

                 {error && (
                   <div className="w-full p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex flex-col gap-3">
                      <div className="flex items-center gap-3 text-rose-500">
                         <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                         <span className="text-[10px] font-black uppercase tracking-widest leading-tight">{error}</span>
                      </div>
                      <a
                        href="https://chromewebstore.google.com/detail/lace/gafhhkghbfjjkeiendhlofajokpaflmk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 py-2 bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-colors"
                      >
                         Install Lace Wallet <ExternalLink className="w-3 h-3" />
                      </a>
                   </div>
                 )}

                 <button
                   onClick={() => handleConnect(false)}
                   disabled={isConnecting}
                   className="w-full flex items-center justify-center gap-4 py-6 bg-white text-black rounded-3xl font-black uppercase italic tracking-widest hover:bg-zinc-200 transition-all shadow-xl active:scale-95 disabled:opacity-50 group"
                 >
                    {isConnecting ? (
                      <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                         <ShieldCheck className="w-5 h-5 text-white" />
                      </div>
                    )}
                    {isConnecting ? 'Establishing...' : 'Connect Lace Wallet'}
                 </button>

                 <div className="space-y-4">
                    <div className="flex items-center gap-3 justify-center">
                       <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Midnight DApp Connector</span>
                    </div>
                    <p className="text-[10px] font-medium text-zinc-600 leading-relaxed text-center px-6">
                       Your shielded address is your sovereign identity.
                       No personal information leaves your local environment.
                    </p>
                 </div>
              </div>
           </div>
        </motion.div>
      </main>
    </div>
  );
}
