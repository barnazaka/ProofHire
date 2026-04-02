'use client';

import Link from 'next/link';
import { ArrowLeft, User, Briefcase, ShieldCheck } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function LaunchPage() {
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
             <span className="text-2xl font-black tracking-tighter uppercase italic">Launch App</span>
          </div>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex flex-col justify-center items-center max-w-6xl mx-auto px-8 py-24">
        <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tightest leading-none">Choose Your <br /><span className="text-indigo-600">Access.</span></h1>
          <p className="text-xl text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
            Select a role to enter the ProofHire ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
           <Link href="/talent/login" className="group relative">
              <div className="p-10 h-full bg-zinc-50 dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 transition-all duration-500 hover:scale-[1.02] hover:border-indigo-600 flex flex-col items-center text-center">
                <div className="p-6 bg-zinc-100 dark:bg-zinc-800 rounded-3xl mb-6 group-hover:bg-indigo-600/10 transition-colors">
                  <User className="w-12 h-12 text-indigo-600" />
                </div>
                <h3 className="text-3xl font-black uppercase italic mb-4 tracking-tight">Talent</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mb-10 leading-relaxed">
                  Prove your skills, education, and experience without exposing your identity.
                </p>
                <div className="mt-auto px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl font-black uppercase italic tracking-tighter group-hover:bg-indigo-600 group-hover:text-white transition-all text-xs">
                  Sign In
                </div>
              </div>
           </Link>

           <Link href="/recruiter/login" className="group relative">
              <div className="p-10 h-full bg-zinc-50 dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 transition-all duration-500 hover:scale-[1.02] hover:border-indigo-600 flex flex-col items-center text-center">
                <div className="p-6 bg-zinc-100 dark:bg-zinc-800 rounded-3xl mb-6 group-hover:bg-indigo-600/10 transition-colors">
                  <Briefcase className="w-12 h-12 text-indigo-600" />
                </div>
                <h3 className="text-3xl font-black uppercase italic mb-4 tracking-tight">Recruiter</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mb-10 leading-relaxed">
                  Verify candidate claims instantly with on-chain cryptographic proofs.
                </p>
                <div className="mt-auto px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl font-black uppercase italic tracking-tighter group-hover:bg-indigo-600 group-hover:text-white transition-all text-xs">
                  Sign In
                </div>
              </div>
           </Link>
        </div>
      </main>
    </div>
  );
}
