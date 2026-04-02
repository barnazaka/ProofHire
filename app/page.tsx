'use client';

import Link from "next/link";
import { ShieldCheck, UserCircle, Briefcase, Zap, Lock, Globe, Fingerprint, ArrowRight, CheckCircle2, ChevronDown, Layers, Cpu, ShieldAlert, Wallet } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black font-sans text-zinc-900 dark:text-white transition-colors duration-300">

      {/* Header */}
      <header className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center backdrop-blur-lg bg-white/50 dark:bg-black/50 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter">ProofHire</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-indigo-600 transition-colors">Protocol</a>
          <a href="#privacy" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-indigo-600 transition-colors">Privacy</a>
          <a href="#features" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-indigo-600 transition-colors">Features</a>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/talent" className="hidden sm:block text-[10px] font-black uppercase tracking-widest px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl hover:opacity-80 transition-all">
            Launch App
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-48 pb-32 px-8 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
             <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full"></div>
             <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full"></div>
          </div>

          <div className="max-w-6xl mx-auto text-center space-y-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/30 rounded-full">
               <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
               <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Built for Midnight Network</span>
            </div>

            <h1 className="text-6xl md:text-[100px] font-black tracking-tightest leading-[0.8] uppercase italic">
              Privacy is <br />
              <span className="text-indigo-600">Non-Negotiable.</span>
            </h1>

            <p className="text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto font-medium leading-tight">
              The first professional marketplace where credentials are mathematically verified, yet identities remain entirely private.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
              <Link href="/talent" className="group w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-indigo-600 text-white rounded-2xl text-lg font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-500/40">
                Talent Login <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/recruiter" className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-2xl text-lg font-black uppercase tracking-widest hover:opacity-80 transition-all border border-zinc-200 dark:border-zinc-800">
                Recruiter Engine
              </Link>
            </div>
          </div>

          <div className="mt-32 flex flex-col items-center gap-4 animate-bounce opacity-40">
             <span className="text-[9px] font-black uppercase tracking-[0.4em]">Scroll to Explore</span>
             <ChevronDown className="w-4 h-4" />
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-32 px-8 bg-zinc-50 dark:bg-zinc-950 border-y border-zinc-200 dark:border-zinc-900">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
              <div>
                <h2 className="text-4xl md:text-6xl font-black uppercase italic leading-none tracking-tighter">The ZK Hiring <br />Protocol.</h2>
              </div>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-sm text-sm font-medium leading-relaxed">
                We've abstracted the complexity of Zero-Knowledge Proofs into a seamless hiring experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-1px bg-zinc-200 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="bg-white dark:bg-black p-12 space-y-6">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl">1</div>
                <h3 className="text-2xl font-black uppercase tracking-tight">Local Input</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium leading-relaxed">
                  Enter your credentials in our secure local environment. Data stays in browser memory—never touches a server.
                </p>
                <div className="pt-4 flex items-center gap-2 text-indigo-600">
                   <Lock className="w-4 h-4" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Client-Side Secure</span>
                </div>
              </div>

              <div className="bg-white dark:bg-black p-12 space-y-6">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl">2</div>
                <h3 className="text-2xl font-black uppercase tracking-tight">ZK Proof</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium leading-relaxed">
                  Generate mathematical proofs locally. Only cryptographic commitments are sent to the Midnight ledger.
                </p>
                <div className="pt-4 flex items-center gap-2 text-indigo-600">
                   <Cpu className="w-4 h-4" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Midnight Compact logic</span>
                </div>
              </div>

              <div className="bg-white dark:bg-black p-12 space-y-6">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl">3</div>
                <h3 className="text-2xl font-black uppercase tracking-tight">Verification</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium leading-relaxed">
                  Recruiters verify your claims against the blockchain. They see a "Valid" status, but never your name or PII.
                </p>
                <div className="pt-4 flex items-center gap-2 text-indigo-600">
                   <CheckCircle2 className="w-4 h-4" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Trustless matching</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Midnight Section */}
        <section id="privacy" className="py-32 px-8">
           <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                   <Layers className="w-3.5 h-3.5 text-zinc-500" />
                   <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">The Infrastructure</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
                  Powered by <br />
                  <span className="text-indigo-600">Midnight Network.</span>
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-lg font-medium leading-relaxed">
                  Midnight is a privacy-first blockchain built as a Cardano sidechain. It supports smart contracts that handle both private and public data using Zero-Knowledge Proofs.
                </p>
                <div className="grid grid-cols-2 gap-6">
                   <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                      <Zap className="w-6 h-6 text-indigo-600 mb-4" />
                      <h4 className="font-black text-xs uppercase tracking-widest mb-2">Dual Token</h4>
                      <p className="text-[10px] text-zinc-400 leading-relaxed">NIGHT for governance, DUST for computation resources.</p>
                   </div>
                   <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                      <ShieldAlert className="w-6 h-6 text-indigo-600 mb-4" />
                      <h4 className="font-black text-xs uppercase tracking-widest mb-2">Private Input</h4>
                      <p className="text-[10px] text-zinc-400 leading-relaxed">Sensitive data stays local. Only proofs enter the ledger.</p>
                   </div>
                </div>
              </div>

              <div className="relative group">
                 <div className="absolute inset-0 bg-indigo-600/10 blur-[100px] rounded-full group-hover:bg-indigo-600/20 transition-all"></div>
                 <div className="relative aspect-square bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 shadow-3xl flex flex-col p-12 overflow-hidden">
                    <div className="flex-1 flex flex-col items-center justify-center gap-8">
                       <Fingerprint className="w-32 h-32 text-indigo-600 animate-pulse" />
                       <div className="text-center space-y-2">
                          <span className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400">Security Core</span>
                          <p className="text-2xl font-black italic uppercase">Encryption Layer Active</p>
                       </div>
                    </div>
                    <div className="p-6 bg-indigo-600 text-white rounded-2xl flex items-center justify-between">
                       <span className="text-[10px] font-black uppercase tracking-widest">Network Status</span>
                       <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold">Midnight Preprod</span>
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-32 px-8 bg-zinc-900 text-white">
           <div className="max-w-6xl mx-auto space-y-20">
              <div className="text-center space-y-6">
                <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tightest">Engineered for <br />Enterprise Privacy.</h2>
                <div className="h-1 w-20 bg-indigo-600 mx-auto"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                 {[
                   { title: "Lace Wallet", desc: "Integrated authentication with Cardano's premier wallet.", icon: Wallet },
                   { title: "Compact DSL", desc: "Logic written in Midnight's statically typed language.", icon: Cpu },
                   { title: "DID Integration", desc: "Decentralized identifiers for trustless identity.", icon: Fingerprint },
                   { title: "Local Proofs", desc: "Zero data leakage. ZK proofs generated in-browser.", icon: Globe }
                 ].map((feat, i) => (
                   <div key={i} className="group p-8 bg-zinc-800 hover:bg-indigo-600 rounded-3xl border border-zinc-700 hover:border-indigo-500 transition-all duration-500">
                      <feat.icon className="w-10 h-10 mb-6 text-indigo-500 group-hover:text-white transition-colors" />
                      <h4 className="text-xl font-black uppercase tracking-tight mb-3 italic">{feat.title}</h4>
                      <p className="text-zinc-400 group-hover:text-white/80 text-xs font-medium leading-relaxed">
                        {feat.desc}
                      </p>
                   </div>
                 ))}
              </div>
           </div>
        </section>
      </main>

      <footer className="px-8 py-16 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-900 dark:bg-white rounded-lg">
                <ShieldCheck className="w-5 h-5 text-white dark:text-zinc-900" />
              </div>
              <span className="text-lg font-black tracking-tighter">ProofHire</span>
            </div>
            <p className="text-zinc-500 text-xs font-medium max-w-xs leading-relaxed">
              Decentralized, privacy-first recruitment infrastructure. Built for the era of sovereign identity.
            </p>
          </div>

          <div className="flex flex-wrap gap-12 lg:gap-24">
             <div className="space-y-4">
                <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Resources</h5>
                <ul className="space-y-2 text-xs font-black uppercase tracking-widest">
                   <li><a href="#" className="hover:text-indigo-600">Docs</a></li>
                   <li><a href="#" className="hover:text-indigo-600">Github</a></li>
                   <li><a href="#" className="hover:text-indigo-600">Midnight</a></li>
                </ul>
             </div>
             <div className="space-y-4">
                <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Identity</h5>
                <ul className="space-y-2 text-xs font-black uppercase tracking-widest">
                   <li><Link href="/talent" className="hover:text-indigo-600">Talent</Link></li>
                   <li><Link href="/recruiter" className="hover:text-indigo-600">Recruiter</Link></li>
                </ul>
             </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-20 pt-10 border-t border-zinc-100 dark:border-zinc-900 flex flex-col sm:flex-row justify-between items-center gap-6">
           <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.4em]">&copy; 2026 PROOFHIRE LABS. ALL PRIVACY RESERVED.</p>
           <div className="flex items-center gap-6 opacity-40 grayscale">
              <span className="text-[9px] font-black">MIDNIGHT</span>
              <span className="text-[9px] font-black">CARDANO</span>
              <span className="text-[9px] font-black">ZK-PROOFS</span>
           </div>
        </div>
      </footer>
    </div>
  );
}
