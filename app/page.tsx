'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShieldCheck, User, Briefcase, Zap, Lock, CheckCircle, ArrowRight, ChevronRight, Menu, X, Globe, Fingerprint, Layers, Cpu } from 'lucide-react';
import { useState, useEffect } from 'react';
import ThemeToggle from '@/components/ThemeToggle';

const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
  <Link href={href} className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">
    {children}
  </Link>
);

const FeatureCard = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="p-8 rounded-[2rem] bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl"
  >
    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 border border-indigo-500/20">
      <Icon className="w-6 h-6 text-indigo-500" />
    </div>
    <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
    <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
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
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      {/* Background Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      </div>

      {/* Header */}
      <header className={`fixed top-0 w-full z-50 px-6 py-4 transition-all duration-300 ${scrolled ? 'bg-black/60 backdrop-blur-xl border-b border-white/5' : ''}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">ProofHire</span>
          </div>

          <nav className="hidden md:flex items-center gap-10">
             <NavLink href="/protocol">Protocol</NavLink>
             <NavLink href="/privacy">Privacy</NavLink>
             <NavLink href="/features">Features</NavLink>
          </nav>

          <div className="flex items-center gap-4">
             <ThemeToggle />
             <Link href="/launch" className="hidden sm:flex px-6 py-2.5 bg-white text-black rounded-full font-bold text-sm hover:bg-zinc-200 transition-all shadow-xl hover:shadow-white/10 active:scale-95">
               Launch App
             </Link>
             <button className="md:hidden p-2 text-zinc-400" onClick={() => setMobileMenu(!mobileMenu)}>
                {mobileMenu ? <X /> : <Menu />}
             </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-40 pb-24 px-6 z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-indigo-400 mb-8">
               <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping"></span>
               Now Live on Midnight Testnet
             </div>
             <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.05]">
               Hire on proof. <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Not paper.</span>
             </h1>
             <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
               The first decentralized recruitment network powered by Zero-Knowledge Proofs.
               Prove your qualifications without revealing a single byte of personal data.
             </p>

             <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/talent/auth" className="w-full sm:w-auto px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-lg font-bold transition-all shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-2 group active:scale-95">
                  I'm a Talent <User className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/recruiter/auth" className="w-full sm:w-auto px-10 py-5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white rounded-2xl text-lg font-bold transition-all flex items-center justify-center gap-2 group active:scale-95">
                  I'm a Recruiter <Briefcase className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 px-6 z-10 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Zap}
              title="Zero Knowledge Proofs"
              desc="Proof of skills and degree generated locally in your browser. Raw PII never touches the ledger."
            />
            <FeatureCard
              icon={Layers}
              title="Lace Wallet Identity"
              desc="Secure authentication via Cardano's premier wallet. Your wallet address is your sovereign identity."
            />
            <FeatureCard
              icon={Cpu}
              title="On-Chain Verification"
              desc="Mathematical certainty for recruiters. Verify candidate claims in seconds with cryptographic proof."
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-6 z-10 relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-20 tracking-tight">The Trustless Pipeline.</h2>

          <div className="relative flex flex-col md:flex-row justify-between items-center gap-16 md:gap-8">
            {/* Horizontal Line */}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent hidden md:block -translate-y-12"></div>

            {[
              { icon: User, title: "Input Locally", desc: "Save credentials in your browser.", step: 1 },
              { icon: Zap, title: "Generate ZKP", desc: "Local cryptographic proving.", step: 2 },
              { icon: ShieldCheck, title: "Verify On-Chain", desc: "Recruiter confirms proof.", step: 3 }
            ].map((s, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="relative flex flex-col items-center max-w-[240px] z-10"
              >
                <div className="w-24 h-24 rounded-[2rem] bg-black border border-zinc-800 flex items-center justify-center mb-8 relative shadow-2xl">
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500">
                    {s.step}
                  </div>
                  <s.icon className="w-10 h-10 text-indigo-500" />
                </div>
                <h4 className="text-xl font-bold mb-2">{s.title}</h4>
                <p className="text-zinc-500 text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 z-10 relative">
        <div className="max-w-4xl mx-auto rounded-[3rem] bg-indigo-600 p-16 text-center relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">Ready to re-engineer trust?</h2>
              <Link href="/launch" className="px-10 py-5 bg-white text-indigo-600 rounded-2xl text-lg font-bold hover:bg-zinc-100 transition-all shadow-2xl active:scale-95 inline-flex items-center gap-2 group">
                 Enter the Protocol <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
           </div>
        </div>
      </section>

      <footer className="py-16 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-3 opacity-60">
              <ShieldCheck className="w-5 h-5 text-indigo-500" />
              <span className="text-lg font-bold">ProofHire</span>
           </div>
           <div className="flex items-center gap-8 text-zinc-500 text-sm font-medium">
              <a href="#" className="hover:text-white transition-colors">Docs</a>
              <a href="#" className="hover:text-white transition-colors">Github</a>
              <a href="#" className="hover:text-white transition-colors">Midnight Network</a>
           </div>
           <p className="text-zinc-600 text-xs uppercase tracking-widest font-medium">
             © 2026 ProofHire Protocol. All Rights Reserved.
           </p>
        </div>
      </footer>
    </div>
  );
}
