'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShieldCheck, User, Briefcase, Zap, Lock, CheckCircle, ArrowRight, ChevronRight, Menu, X, Globe, Fingerprint, Layers, Cpu, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import ThemeToggle from '@/components/ThemeToggle';

const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
  <Link href={href} className="text-zinc-400 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest italic">
    {children}
  </Link>
);

const FeatureCard = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <motion.div
    whileHover={{ y: -10, scale: 1.02 }}
    className="p-10 rounded-[3rem] bg-zinc-900 border border-zinc-800 backdrop-blur-3xl shadow-2xl relative overflow-hidden group"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:bg-indigo-600/20 transition-all duration-500"></div>
    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-8 border border-indigo-500/20 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all duration-500">
      <Icon className="w-8 h-8 text-indigo-500 group-hover:text-white transition-colors" />
    </div>
    <h3 className="text-2xl font-black mb-4 text-white italic uppercase tracking-tighter">{title}</h3>
    <p className="text-zinc-500 text-sm leading-relaxed font-medium">{desc}</p>
  </motion.div>
);

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-indigo-600 selection:text-white overflow-x-hidden">
      {/* Background Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      </div>

      {/* Header */}
      <header className={`fixed top-0 w-full z-50 px-8 py-6 transition-all duration-500 ${scrolled ? 'bg-black/60 backdrop-blur-3xl border-b border-zinc-900 py-4' : ''}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-600/30 border border-white/10">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter italic uppercase">ProofHire.</span>
          </div>

          <nav className="hidden md:flex items-center gap-12">
             <NavLink href="/protocol">The Protocol</NavLink>
             <NavLink href="/privacy">Privacy First</NavLink>
             <NavLink href="/features">Features</NavLink>
          </nav>

          <div className="flex items-center gap-6">
             <ThemeToggle />
             <Link href="/launch" className="hidden sm:flex px-8 py-3 bg-white text-black rounded-2xl font-black text-xs uppercase italic tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-3xl active:scale-95">
               Launch Terminal
             </Link>
             <button className="md:hidden p-2 text-zinc-400" onClick={() => setMobileMenu(!mobileMenu)}>
                {mobileMenu ? <X /> : <Menu />}
             </button>
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
               <Sparkles className="w-4 h-4 animate-pulse" />
               Midnight Preview Mainnet Active
             </div>
             <h1 className="text-7xl md:text-[9.5rem] font-black tracking-tightest mb-10 leading-[0.85] italic uppercase drop-shadow-2xl">
               Hire on <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-600">Proof.</span>
             </h1>
             <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-16 leading-relaxed font-medium italic">
               The first sovereign recruitment network powered by Zero-Knowledge Proofs.
               Verify skills, not identities.
             </p>

             <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <Link href="/talent/auth" className="w-full sm:w-auto px-12 py-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] text-sm font-black uppercase italic tracking-widest transition-all shadow-3xl shadow-indigo-600/40 flex items-center justify-center gap-4 group active:scale-95">
                  Enter Talent OS <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
                <Link href="/recruiter/auth" className="w-full sm:w-auto px-12 py-6 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white rounded-[2rem] text-sm font-black uppercase italic tracking-widest transition-all flex items-center justify-center gap-4 group active:scale-95">
                  Recruiter Engine <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
             </div>

             <div className="pt-20">
                <a
                  href="https://chromewebstore.google.com/detail/lace/gafhhkghbfjjkeiendhlofajokpaflmk"
                  target="_blank"
                  className="inline-flex items-center gap-3 px-8 py-4 border border-zinc-800 rounded-3xl text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:border-indigo-600 transition-all group"
                >
                  <ShieldCheck className="w-5 h-5 text-indigo-500 group-hover:animate-bounce" />
                  Install Lace Wallet to Connect
                </a>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-32 px-8 z-10 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard
              icon={Zap}
              title="ZK Circuits"
              desc="Skills and education verified locally via Groth16 proofs. Your raw PII data never leaves your browser node."
            />
            <FeatureCard
              icon={Fingerprint}
              title="Lace Identity"
              desc="DApp Connector v4.x integration for sovereign authentication. Your wallet address is your private key to the network."
            />
            <FeatureCard
              icon={Cpu}
              title="On-Chain Logic"
              desc="Mathematical certainty for hiring managers. Verify complex candidate claims in milliseconds with ZK-SNARKs."
            />
          </div>
        </div>
      </section>

      {/* Trust Pipeline Visual */}
      <section className="py-40 px-8 z-10 relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center space-y-32">
          <div className="space-y-4">
             <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tightest">The Trustless <span className="text-indigo-600">Pipeline.</span></h2>
             <p className="text-zinc-500 font-black uppercase tracking-[0.4em] text-xs">Sovereign Data Flow v1.0.4</p>
          </div>

          <div className="relative flex flex-col md:flex-row justify-between items-center gap-20 md:gap-10">
            {/* Horizontal Connection Line */}
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent hidden md:block -translate-y-20"></div>

            {[
              { icon: Lock, title: "Encrypt Local", desc: "Save PII in your browser vault.", step: "NODE_01" },
              { icon: Zap, title: "Local Proving", desc: "ZKP generated on your CPU.", step: "ZK_GEN" },
              { icon: ShieldCheck, title: "Anchor Proof", desc: "Commit proof hash to Midnight.", step: "TX_INIT" }
            ].map((s, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.6 }}
                className="relative flex flex-col items-center max-w-[280px] z-10 group"
              >
                <div className="w-32 h-32 rounded-[3rem] bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-10 relative shadow-3xl group-hover:border-indigo-500 group-hover:shadow-indigo-600/20 transition-all duration-500">
                  <div className="absolute -top-4 -right-4 px-3 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-[8px] font-black text-indigo-500 uppercase tracking-widest shadow-xl">
                    {s.step}
                  </div>
                  <s.icon className="w-12 h-12 text-indigo-500 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h4 className="text-2xl font-black italic uppercase text-white mb-4 tracking-tighter">{s.title}</h4>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed italic">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security CTA Section */}
      <section className="py-40 px-8 z-10 relative">
        <div className="max-w-5xl mx-auto rounded-[4rem] bg-indigo-600 p-20 text-center relative overflow-hidden shadow-2xl shadow-indigo-600/40">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
           <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 blur-[80px] rounded-full"></div>
           <div className="relative z-10 space-y-12">
              <div className="space-y-4">
                 <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tightest leading-none">Architect the <br />Future of Work.</h2>
                 <p className="text-indigo-100 font-bold text-lg italic max-w-xl mx-auto leading-relaxed">
                    Join the first recruitment protocol where privacy is a mathematical constant, not a promise.
                 </p>
              </div>
              <Link href="/launch" className="px-12 py-6 bg-white text-black rounded-[2rem] text-sm font-black uppercase italic tracking-widest hover:bg-black hover:text-white transition-all shadow-3xl active:scale-95 inline-flex items-center gap-4 group">
                 Initialize Terminal <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform duration-500" />
              </Link>
           </div>
        </div>
      </section>

      <footer className="py-24 border-t border-zinc-900 relative z-10">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-12">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                 <ShieldCheck className="w-6 h-6 text-indigo-500" />
              </div>
              <span className="text-2xl font-black italic uppercase tracking-tighter">ProofHire.</span>
           </div>
           <div className="flex items-center gap-12 text-zinc-500 text-[10px] font-black uppercase tracking-widest italic">
              <a href="#" className="hover:text-white transition-colors">Whitepaper</a>
              <a href="#" className="hover:text-white transition-colors">SDK Docs</a>
              <a href="#" className="hover:text-white transition-colors">Midnight Network</a>
           </div>
           <p className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.3em] italic">
             © 2026 Sovereign Systems. All Rights Reserved.
           </p>
        </div>
      </footer>
    </div>
  );
}
