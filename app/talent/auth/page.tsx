'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, User, Zap, Lock, Globe, Loader2, Fingerprint, Award, CheckCircle2 } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import LacePopup from '@/components/LacePopup';

export default function TalentAuthPage() {
  const [activeTab, setActiveTab] = useState<'signup' | 'login'>('login');
  const [isConnecting, setIsConnecting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupStatus, setPopupStatus] = useState<string | null>(null);
  const [mockAddress, setMockAddress] = useState<string | null>(null);
  const addressRef = useRef<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    addressRef.current = mockAddress;
  }, [mockAddress]);

  const handleConnect = async () => {
    console.log('Auth: handleConnect triggered');
    setIsConnecting(true);
    setShowPopup(true);
    setPopupStatus('Connecting to Lace Wallet...');

    try {
      const { connectLaceWallet } = await import('@/components/WalletIntegration');
      const connection = await connectLaceWallet();

      if (connection) {
        setMockAddress(connection.address);
        setPopupStatus('Wallet Connected. Awaiting Confirmation.');
      } else {
        setPopupStatus('Lace Wallet NOT Found. Please install the extension.');
        setIsConnecting(false);
      }
    } catch (err: any) {
      setPopupStatus(`Connection Error: ${err.message}`);
      setIsConnecting(false);
    }
  };

  const handleConfirm = async () => {
    console.log('Auth: handleConfirm started');
    setPopupStatus('Requesting ZK-Identity Signature...');

    let addr = addressRef.current;
    if (!addr) {
      console.log('Auth: mockAddress not ready in ref, waiting...');
      let attempts = 0;
      await new Promise(resolve => {
        const check = setInterval(() => {
          attempts++;
          if (addressRef.current) {
             addr = addressRef.current;
             clearInterval(check);
             resolve(true);
          }
          if (attempts > 100) {
            console.error('Auth: Wait for mockAddress timed out');
            clearInterval(check);
            resolve(false);
          }
        }, 100);
      });
    }

    try {
      const { signData } = await import('@/components/WalletIntegration');
      const signature = await signData(addr || '', `Authenticate ProofHire as Talent: ${Date.now()}`);

      if (!signature) {
        setPopupStatus('Signature Rejected. Access Denied.');
        return;
      }

      console.log('Auth: Signature received:', signature);
      setPopupStatus('Sovereign Identity Verified.');
    } catch (err: any) {
      setPopupStatus(`Signature Error: ${err.message}`);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Auth: Verification complete, using address:', addr);
    if (addr) {
      console.log('Auth: Redirecting with address:', addr);
      localStorage.setItem('user_address', addr);
      localStorage.setItem('user_role', 'talent');

      const onboarded = localStorage.getItem('onboarding_complete');
      if (onboarded === 'true') {
        router.push('/talent/dashboard');
      } else {
        router.push('/talent/onboarding');
      }
    } else {
      console.error('Auth: No mockAddress found during confirm');
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

      <main className="relative z-10 w-full max-w-7xl px-8 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-32">
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
                       ZK Pipeline Active
                    </div>
                 </div>
                 <div className="flex gap-4 opacity-50">
                    <Fingerprint className="w-6 h-6" />
                    <Award className="w-6 h-6" />
                    <Globe className="w-6 h-6" />
                 </div>
              </motion.div>
           </div>

           {/* Floating elements */}
           <motion.div
              animate={{ x: [0, 10, 0], y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute -top-6 -right-6 p-6 bg-zinc-900/80 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-xl"
           >
              <Lock className="w-8 h-8 text-indigo-500" />
           </motion.div>
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
                    Authenticate with Lace Wallet to unlock your private talent OS.
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

              <div className="p-12 pt-8 flex flex-col items-center gap-10">
                 <button
                   onClick={handleConnect}
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
                    {isConnecting ? 'Awaiting Signature...' : 'Connect Lace Wallet'}
                 </button>

                 <div className="space-y-4">
                    <div className="flex items-center gap-3 justify-center">
                       <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Identity Bound to Wallet</span>
                    </div>
                    <p className="text-[10px] font-medium text-zinc-600 leading-relaxed text-center px-6">
                       Your wallet address is your sovereign identity.
                       No personal information leaves your local environment.
                    </p>
                 </div>
              </div>
           </div>
        </motion.div>
      </main>

      <AnimatePresence>
        {showPopup && (
          <LacePopup
            isOpen={showPopup}
            onClose={() => { setShowPopup(false); setIsConnecting(false); }}
            onConfirm={handleConfirm}
            status={popupStatus}
            address={mockAddress || undefined}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
