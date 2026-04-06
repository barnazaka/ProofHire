'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck, ArrowRight, ArrowLeft,
  User, GraduationCap, Briefcase,
  Code2, Loader2, CheckCircle2,
  Zap, Fingerprint, Mail, Phone, Lock, Save,
  X, Search, MessageSquare, Target, LogOut, Copy, Check, Filter, Globe, Calendar, MapPin, Target as TargetIcon,
  ChevronRight
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'talent' | 'recruiter'>('talent');

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-indigo-600 selection:text-white overflow-x-hidden">
      {/* Background Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 px-8 py-6 bg-black/60 backdrop-blur-3xl border-b border-zinc-900">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-600/30 border border-white/10">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter italic uppercase">ProofHire.</span>
          </div>
          <div className="flex items-center gap-6">
             <ThemeToggle />
             <Link href="/marketplace" className="hidden sm:flex px-8 py-3 bg-white text-black rounded-2xl font-black text-xs uppercase italic tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-3xl active:scale-95">
               Open Marketplace
             </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-64 pb-32 px-8 z-10">
        <div className="max-w-6xl mx-auto text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
             <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-10 italic">
               <Zap className="w-4 h-4 animate-pulse" />
               Midnight WASM Proving Active
             </div>
             <h1 className="text-7xl md:text-[9.5rem] font-black tracking-tightest mb-10 leading-[0.85] italic uppercase drop-shadow-2xl">
               Hire on <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-600">Proof.</span>
             </h1>
             <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-16 leading-relaxed font-medium italic">
               The first sovereign recruitment network powered by Zero-Knowledge Proofs.
               Verify qualifications, protect identities.
             </p>

             <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <Link href="/talent/onboarding" className="w-full sm:w-auto px-12 py-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] text-sm font-black uppercase italic tracking-widest transition-all shadow-3xl shadow-indigo-600/40 flex items-center justify-center gap-4 group active:scale-95">
                  Enter Talent OS <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
                <Link href="/marketplace" className="w-full sm:w-auto px-12 py-6 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white rounded-[2rem] text-sm font-black uppercase italic tracking-widest transition-all flex items-center justify-center gap-4 group active:scale-95">
                  Recruiter Engine <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-32 px-8 z-10 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
             <FeatureCard
               icon={Fingerprint}
               title="ZK Proving"
               desc="Credentials like degrees and skills are verified locally using WASM-based ZK circuits. Raw data never touches the network."
             />
             <FeatureCard
               icon={ShieldCheck}
               title="Lace Identity"
               desc="Sovereign authentication via Lace Wallet. Your wallet address is your global contributor ID on the Midnight ledger."
             />
             <FeatureCard
               icon={Lock}
               title="Private State"
               desc="Encryption-at-rest for PII. Contact details are stored in your local browser vault, never on-chain or on a server."
             />
          </div>
        </div>
      </section>

      <footer className="py-24 border-t border-zinc-900 relative z-10">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                 <ShieldCheck className="w-6 h-6 text-indigo-500" />
              </div>
              <span className="text-2xl font-black italic uppercase tracking-tighter">ProofHire.</span>
           </div>
           <p className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.3em] italic">
             © 2026 Sovereign Systems. Midnight Preview Testnet Node v4.0.1
           </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="p-10 rounded-[3rem] bg-zinc-900 border border-zinc-800 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-8 border border-indigo-500/20 group-hover:bg-indigo-600 transition-all duration-500">
        <Icon className="w-8 h-8 text-indigo-500 group-hover:text-white transition-colors" />
      </div>
      <h3 className="text-2xl font-black mb-4 text-white italic uppercase tracking-tighter">{title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed font-medium italic">{desc}</p>
    </div>
  );
}
