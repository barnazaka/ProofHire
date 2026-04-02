import Link from "next/link";
import { ShieldCheck, UserCircle, Briefcase, Zap, Lock, Globe, Fingerprint, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 font-sans dark:bg-black text-zinc-900 dark:text-zinc-100 selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <header className="relative px-10 py-8 flex justify-between items-center z-20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/20 rotate-[-5deg]">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tightest">ProofHire</span>
        </div>
        <nav className="hidden md:flex items-center gap-10">
          <a href="#" className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-indigo-600 transition-colors">Protocol</a>
          <a href="#" className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-indigo-600 transition-colors">Security</a>
          <a href="#" className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-indigo-600 transition-colors">Network</a>
        </nav>
        <div className="flex items-center gap-4">
           <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
           <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Midnight Mainnet Node active</span>
        </div>
      </header>

      <main className="relative flex-1 flex flex-col items-center justify-center px-6 py-20 z-10">
        <div className="max-w-5xl w-full space-y-20 text-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl shadow-black/5 border border-zinc-100 dark:border-zinc-800 animate-in fade-in slide-in-from-top-4 duration-700">
              <Zap className="w-4 h-4 text-indigo-600 fill-indigo-600/20" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 dark:text-zinc-400">Revolutionizing Web3 Recruitment</span>
            </div>

            <h1 className="text-7xl md:text-9xl font-black tracking-tightest leading-[0.85] text-zinc-900 dark:text-white animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
               Hiring with <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-600">Pure Zero Knowledge.</span>
            </h1>

            <p className="text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
               The world's first privacy-preserving talent marketplace built on the Midnight Network. Prove your worth without ever revealing your identity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            <Link
              href="/talent"
              className="group relative flex flex-col items-start p-10 bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl shadow-black/5 border border-zinc-100 dark:border-zinc-800 hover:border-indigo-500 transition-all hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 group-hover:rotate-12 transition-all duration-700">
                 <UserCircle className="w-48 h-48 text-indigo-600" />
              </div>
              <div className="p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl mb-8 group-hover:bg-indigo-600 group-hover:rotate-[-5deg] transition-all duration-500">
                <UserCircle className="w-10 h-10 text-indigo-600 group-hover:text-white" />
              </div>
              <h2 className="text-3xl font-black mb-3 text-zinc-900 dark:text-white">Talent Portal</h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-left font-medium leading-relaxed">
                Generate local ZK proofs for your credentials. Own your data, reveal only what's necessary.
              </p>
              <div className="mt-10 flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-xs group-hover:gap-4 transition-all">
                 Establish Identity <ArrowRight className="w-4 h-4" />
              </div>
            </Link>

            <Link
              href="/recruiter"
              className="group relative flex flex-col items-start p-10 bg-zinc-900 dark:bg-white rounded-[3rem] shadow-2xl shadow-indigo-500/10 border border-transparent hover:border-indigo-500 transition-all hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 group-hover:rotate-12 transition-all duration-700">
                 <Briefcase className="w-48 h-48 text-white dark:text-zinc-900" />
              </div>
              <div className="p-5 bg-white/10 dark:bg-zinc-100 rounded-3xl mb-8 group-hover:bg-indigo-600 group-hover:rotate-[5deg] transition-all duration-500">
                <Briefcase className="w-10 h-10 text-white dark:text-zinc-900 group-hover:text-white" />
              </div>
              <h2 className="text-3xl font-black mb-3 text-white dark:text-zinc-900">Recruiter Engine</h2>
              <p className="text-zinc-400 dark:text-zinc-500 text-left font-medium leading-relaxed">
                Verify candidate claims instantly with mathematical certainty. Zero PII, 100% compliance.
              </p>
              <div className="mt-10 flex items-center gap-2 text-white dark:text-zinc-900 font-black uppercase tracking-widest text-xs group-hover:gap-4 transition-all">
                 Launch Engine <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>

          {/* Trust Bar */}
          <div className="pt-20 opacity-40 animate-in fade-in duration-1000 delay-1000">
             <div className="flex flex-wrap justify-center items-center gap-16 md:gap-32">
                <div className="flex flex-col items-center gap-2">
                   <Globe className="w-8 h-8" />
                   <span className="text-[10px] font-black uppercase tracking-[0.3em]">Decentralized</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                   <Lock className="w-8 h-8" />
                   <span className="text-[10px] font-black uppercase tracking-[0.3em]">Private State</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                   <Fingerprint className="w-8 h-8" />
                   <span className="text-[10px] font-black uppercase tracking-[0.3em]">Identity</span>
                </div>
             </div>
          </div>
        </div>
      </main>

      <footer className="relative px-10 py-12 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-8 bg-white/30 dark:bg-black/30 backdrop-blur-md z-20">
        <div className="flex items-center gap-10">
           <div className="flex flex-col">
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Architecture</span>
              <span className="text-xs font-black">Zero-Knowledge Mesh</span>
           </div>
           <div className="w-[1px] h-8 bg-zinc-200 dark:bg-zinc-800"></div>
           <div className="flex flex-col">
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Infrastructure</span>
              <span className="text-xs font-black">Midnight Preprod</span>
           </div>
        </div>
        <div className="text-center md:text-right">
          <p className="text-zinc-500 text-[11px] font-black uppercase tracking-widest mb-1 italic">BUILDING THE FUTURE OF PRIVATE WORK</p>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.5em]">&copy; 2026 PROOFHIRE LABS</p>
        </div>
      </footer>
    </div>
  );
}
