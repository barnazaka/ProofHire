'use client';

import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Zap, Layers, Cpu, Fingerprint } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function FeaturesPage() {
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
             <span className="text-2xl font-black tracking-tighter uppercase italic">Features</span>
          </div>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex-1 max-w-6xl mx-auto pt-48 pb-32 px-8">
        <section className="mb-24 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tightest leading-none">Built for <br /><span className="text-indigo-600">Scale.</span></h1>
          <p className="text-xl text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed max-w-2xl">
            A comprehensive suite of tools for candidates and recruiters to interact in a privacy-preserving environment.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {[
             { title: "Proof Factory", desc: "Local ZK generation for education, skills, and experience claims.", icon: Zap },
             { title: "Lace Integration", desc: "Native wallet support for authentication and message signing.", icon: Layers },
             { title: "Compact Engine", desc: "Powered by Midnight's high-performance statically typed DSL.", icon: Cpu },
             { title: "Verifiable DID", desc: "Decentralized identifiers integrated with the Cardano sidechain.", icon: Fingerprint },
             { title: "Selective Reveal", desc: "Allowing candidates to disclose attributes at their discretion.", icon: ShieldCheck },
             { title: "Ledger Analytics", desc: "Private-state proof verification on the Midnight testnet.", icon: Cpu }
           ].map((feature, i) => (
              <div key={i} className="p-10 bg-zinc-50 dark:bg-zinc-900 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 hover:border-indigo-600 transition-all group">
                <feature.icon className="w-10 h-10 text-indigo-600 mb-8 transition-transform group-hover:scale-125" />
                <h3 className="text-2xl font-black uppercase italic mb-4">{feature.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </div>
           ))}
        </div>
      </main>
    </div>
  );
}
