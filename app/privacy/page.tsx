'use client';

import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Fingerprint, ShieldOff, EyeOff } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black font-sans text-zinc-900 dark:text-white transition-colors duration-300">
      <header className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center backdrop-blur-lg bg-white/50 dark:bg-black/50 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-4">
          <Link href="/" className="mr-4 p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl transition-all">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-3">
             <div className="p-2 bg-indigo-600 rounded-xl">
                <ShieldCheck className="w-6 h-6 text-white" />
             </div>
             <span className="text-2xl font-black tracking-tighter uppercase italic">Privacy</span>
          </div>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex-1 max-w-4xl mx-auto pt-48 pb-32 px-8 space-y-20">
        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-6xl font-black uppercase italic tracking-tightest leading-none">Privacy is the <br /><span className="text-indigo-600">Default State.</span></h1>
          <p className="text-xl text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed italic border-l-4 border-indigo-600 pl-8">
            "Your data is only your business until you choose to prove a specific attribute about it."
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="p-10 bg-zinc-50 dark:bg-zinc-900 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 space-y-6">
              <ShieldOff className="w-10 h-10 text-indigo-600" />
              <h3 className="text-2xl font-black uppercase italic">Zero PII On-Chain</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                Personally Identifiable Information (PII) is never written to the blockchain. We utilize transient memory and local storage for data handling.
              </p>
           </div>
           <div className="p-10 bg-zinc-50 dark:bg-zinc-900 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 space-y-6">
              <EyeOff className="w-10 h-10 text-indigo-600" />
              <h3 className="text-2xl font-black uppercase italic">Selective Reveal</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                Candidates maintain granular control. You choose to prove you have a degree without revealing which university or what year.
              </p>
           </div>
        </div>

        <section className="p-12 bg-zinc-900 text-white rounded-[3rem] border border-white/10 space-y-6">
           <Fingerprint className="w-12 h-12 text-indigo-500" />
           <h2 className="text-4xl font-black uppercase italic tracking-tighter">Sovereign Identity.</h2>
           <p className="text-zinc-400 font-medium leading-relaxed">
             ProofHire leverages the Midnight Network to create a trustless ecosystem. We've removed the need for centralized databases, eliminating the risk of massive data breaches in the recruitment industry.
           </p>
        </section>
      </main>
    </div>
  );
}
