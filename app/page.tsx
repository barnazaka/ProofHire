'use client';

import Link from "next/link";
import { ShieldCheck, UserCircle, Briefcase, Zap, Lock, Globe, Fingerprint, ArrowRight, CheckCircle2, ChevronDown, Layers, Cpu, ShieldAlert, Wallet } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black font-sans text-zinc-900 dark:text-white transition-colors duration-300">

      {/* Header */}
      <header className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center backdrop-blur-lg bg-white/50 dark:bg-black/50 border-b border-zinc-200 dark:border-zinc-800 transition-all">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative p-2.5 bg-black rounded-xl shadow-2xl border border-white/10">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="text-xl font-black tracking-tighter uppercase italic text-zinc-900 dark:text-white">ProofHire</span>
            <span className="text-[8px] font-black tracking-[0.4em] uppercase text-indigo-600 ml-0.5">Protocol v1.0</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-10">
          <Link href="/protocol" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors relative group">
            Protocol
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-indigo-600 transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/privacy" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors relative group">
            Privacy
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-indigo-600 transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/features" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors relative group">
            Features
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-indigo-600 transition-all group-hover:w-full"></span>
          </Link>
        </nav>

        <div className="flex items-center gap-6">
          <ThemeToggle />
          <Link href="/launch" className="group relative overflow-hidden px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-indigo-500/20">
            <span className="relative z-10 text-indigo-600 dark:text-indigo-600 font-black mr-2 uppercase italic">Launch</span>
            <span className="relative z-10">Engine</span>
            <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-64 pb-32 px-8 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
             <div className="absolute top-0 right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[160px] rounded-full animate-pulse"></div>
             <div className="absolute bottom-0 left-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[160px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] dark:opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
            <div className="space-y-12 animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full">
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
                 <span className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em]">Zero-Knowledge Pipeline Active</span>
              </div>

              <h1 className="text-7xl md:text-9xl font-black tracking-tightest leading-[0.8] uppercase italic text-zinc-900 dark:text-white drop-shadow-2xl">
                Sovereign <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-600">Credentials.</span>
              </h1>

              <div className="flex items-center gap-10">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 mb-1">Access Type A</span>
                  <span className="text-xl font-black uppercase italic tracking-tighter">Talent OS</span>
                </div>
                <div className="w-[1px] h-10 bg-zinc-200 dark:border-zinc-800"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 mb-1">Access Type B</span>
                  <span className="text-xl font-black uppercase italic tracking-tighter">Recruiter Engine</span>
                </div>
              </div>

              <p className="text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 max-w-xl font-medium leading-tight border-l-4 border-indigo-600 pl-8 italic">
                Mathematically guaranteed verification without disclosure. Re-engineering trust for the 2026 talent economy.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6 pt-8">
                <Link href="/launch" className="group w-full sm:w-auto flex items-center justify-center gap-4 px-12 py-6 bg-indigo-600 text-white rounded-2xl text-lg font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-500/40 hover:-translate-y-1">
                  Authenticate <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex items-center gap-6 opacity-40">
                   <div className="h-[1px] w-12 bg-zinc-400"></div>
                   <span className="text-[10px] font-black uppercase tracking-widest">Secured by Midnight</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:block relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 blur-3xl rounded-full"></div>
               <div className="relative aspect-[4/3] bg-zinc-900 rounded-[3rem] border border-white/10 shadow-3xl overflow-hidden group">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 w-full p-12 space-y-4">
                     <div className="flex items-center gap-2">
                        <Lock className="w-5 h-5 text-indigo-500" />
                        <span className="text-xs font-black uppercase tracking-[0.3em] text-white">Private State Verifier</span>
                     </div>
                     <div className="h-[2px] w-full bg-white/10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-indigo-600 w-1/3 animate-ping"></div>
                     </div>
                     <p className="text-[10px] font-mono text-zinc-400">0x6461746120707269766163792069732068756d616e207269676874</p>
                  </div>
               </div>
               {/* Floating elements */}
               <div className="absolute -top-6 -right-6 p-6 bg-white dark:bg-zinc-800 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-700 animate-bounce transition-all hover:rotate-12">
                  <Zap className="w-8 h-8 text-indigo-600" />
               </div>
               <div className="absolute -bottom-10 -left-10 p-8 bg-indigo-600 rounded-[2.5rem] shadow-2xl animate-pulse">
                  <ShieldCheck className="w-12 h-12 text-white" />
               </div>
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
              <span className="text-lg font-black tracking-tighter uppercase italic">ProofHire</span>
            </div>
            <p className="text-zinc-500 text-xs font-medium max-w-xs leading-relaxed">
              Decentralized, privacy-first recruitment infrastructure. Re-engineering trust through zero-knowledge proofs on the Midnight Network.
            </p>
          </div>

          <div className="flex flex-wrap gap-12 lg:gap-24">
             <div className="space-y-4">
                <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Resources</h5>
                <ul className="space-y-2 text-xs font-black uppercase tracking-widest">
                   <li><a href="https://docs.midnight.network/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600">Docs</a></li>
                   <li><a href="https://github.com/midnightntwrk" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600">Github</a></li>
                   <li><a href="https://midnight.network/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600">Midnight</a></li>
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
