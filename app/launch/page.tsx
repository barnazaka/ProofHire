'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, User, Briefcase, Zap, Lock, Globe, Fingerprint, Layers, Cpu } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const RoleCard = ({ href, icon: Icon, title, desc, cta }: { href: string, icon: any, title: string, desc: string, cta: string }) => (
  <motion.div
    whileHover={{ y: -8, scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className="group h-full"
  >
    <Link href={href} className="flex flex-col h-full p-12 bg-zinc-900/40 border border-zinc-800 rounded-[3rem] backdrop-blur-3xl hover:border-indigo-500/50 hover:bg-zinc-800/40 transition-all duration-500 relative overflow-hidden text-center items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <div className="w-24 h-24 rounded-[2rem] bg-indigo-500/10 flex items-center justify-center mb-10 border border-indigo-500/20 group-hover:scale-110 transition-transform duration-500 relative z-10 shadow-2xl">
        <Icon className="w-10 h-10 text-indigo-500" />
      </div>

      <h3 className="text-4xl font-bold mb-6 text-white tracking-tight relative z-10 italic uppercase font-black">{title}</h3>
      <p className="text-zinc-400 text-lg mb-12 leading-relaxed relative z-10 font-medium">
        {desc}
      </p>

      <div className="mt-auto px-10 py-4 bg-white text-black rounded-2xl font-black uppercase italic tracking-tighter group-hover:bg-indigo-600 group-hover:text-white transition-all text-sm relative z-10 shadow-xl active:scale-95">
        {cta}
      </div>
    </Link>
  </motion.div>
);

export default function LaunchPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500 selection:text-white overflow-hidden relative flex flex-col">
      {/* Background Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      </div>

      <header className="px-10 py-8 flex justify-between items-center relative z-20">
        <Link href="/" className="group flex items-center gap-4 text-zinc-400 hover:text-white transition-colors">
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl group-hover:bg-zinc-800 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold uppercase tracking-[0.2em]">Exit Engine</span>
        </Link>
        <div className="flex items-center gap-6">
           <ThemeToggle />
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Midnight Active</span>
           </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center items-center max-w-6xl mx-auto px-8 py-20 relative z-10 w-full">
        <div className="text-center mb-24 space-y-6 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400 text-xs font-black uppercase tracking-[0.3em] mb-4"
          >
             <ShieldCheck className="w-4 h-4" />
             Access Controlled by ProofHire
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl font-black uppercase italic tracking-tightest leading-none drop-shadow-2xl"
          >
            Choose Your <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Access.</span>
          </motion.h1>
          <motion.p
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.4 }}
             className="text-xl text-zinc-500 font-medium leading-relaxed italic"
          >
            Select a role to enter the ProofHire ecosystem. Authenticate with Lace Wallet to unlock the protocol.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl relative">
           <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
           >
              <RoleCard
                href="/talent/auth"
                icon={User}
                title="Talent"
                desc="Prove your skills, education, and experience without exposing your identity. Secure local proof generation."
                cta="Enter Talent OS"
              />
           </motion.div>

           <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
           >
              <RoleCard
                href="/recruiter/auth"
                icon={Briefcase}
                title="Recruiter"
                desc="Verify candidate claims instantly with on-chain cryptographic proofs. Trust but verify, mathematically."
                cta="Enter Recruiter Engine"
              />
           </motion.div>
        </div>
      </main>

      <footer className="px-10 py-10 flex flex-col md:flex-row justify-between items-center relative z-10 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
         <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest">
            <Globe className="w-4 h-4 text-indigo-500" />
            Decentralized Verification Protocol v1.0
         </div>
         <div className="h-[1px] flex-1 mx-10 bg-zinc-800 hidden md:block"></div>
         <div className="flex items-center gap-8">
            <Fingerprint className="w-5 h-5" />
            <Layers className="w-5 h-5" />
            <Cpu className="w-5 h-5" />
         </div>
      </footer>
    </div>
  );
}
