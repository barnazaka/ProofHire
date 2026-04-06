'use client';

import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, CheckCircle2, ShieldAlert } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function ProtocolPage() {
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
             <span className="text-2xl font-black tracking-tighter uppercase italic">Protocol</span>
          </div>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex-1 max-w-4xl mx-auto pt-48 pb-32 px-8 space-y-20">
        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-6xl font-black uppercase italic tracking-tightest leading-none">The ProofHire <br /><span className="text-indigo-600">ZK Architecture.</span></h1>
          <p className="text-xl text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
            ProofHire is built on a "Privacy-First" execution model where sensitive data never enters the global state of the Midnight Network.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="p-10 bg-zinc-50 dark:bg-zinc-900 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 space-y-6">
              <Lock className="w-10 h-10 text-indigo-600" />
              <h3 className="text-2xl font-black uppercase italic">Local Execution</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                All business logic that handles Personally Identifiable Information (PII) runs exclusively within the user's browser or a local proof server.
              </p>
           </div>
           <div className="p-10 bg-zinc-50 dark:bg-zinc-900 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 space-y-6">
              <CheckCircle2 className="w-10 h-10 text-indigo-600" />
              <h3 className="text-2xl font-black uppercase italic">ZK Commitments</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                The smart contract only receives a mathematical commitment (a proof) that validates the claims without revealing the underlying inputs.
              </p>
           </div>
        </div>

        <section className="p-12 bg-indigo-600 text-white rounded-[3rem] space-y-6">
           <ShieldAlert className="w-12 h-12" />
           <h2 className="text-4xl font-black uppercase italic tracking-tighter">Enterprise Standard.</h2>
           <p className="text-indigo-100 font-medium leading-relaxed">
             By utilizing Midnight's dual-token model and private state transition logic, we ensure that corporate hiring pipelines are compliant with global privacy regulations (GDPR, CCPA) by default.
           </p>
        </section>
      </main>
    </div>
  );
}
