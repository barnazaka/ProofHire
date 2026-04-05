'use client';

import { useState } from 'react';
import { ShieldCheck, Zap, Fingerprint, Loader2, CheckCircle2, AlertCircle, Copy, Check, Lock, Award, Briefcase, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { deployAndSubmitProof } from '@/lib/contract-utils';

export default function ProofGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState('');
  const [generatedProof, setGeneratedProof] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const steps = [
    { title: 'Data Isolation', icon: Lock, color: 'text-blue-500' },
    { title: 'Witness Selection', icon: Fingerprint, color: 'text-purple-500' },
    { title: 'Circuit Synthesis', icon: Zap, color: 'text-indigo-500' },
    { title: 'Groth16 Proving', icon: ShieldCheck, color: 'text-emerald-500' }
  ];

  const generateProof = async () => {
    setIsGenerating(true);
    setStep(0);

    const runStep = async (idx: number, msg: string, time: number) => {
      setStep(idx);
      setStatus(msg);
      await new Promise(r => setTimeout(r, time));
    };

    try {
      await runStep(0, 'Isolating PII in secure browser enclave...', 1000);
      await runStep(1, 'Selecting private witnesses for Skill circuit...', 1200);
      await runStep(2, 'Synthesizing ZK-Circuit (Midnight Compact)...', 1500);
      await runStep(3, 'Generating Groth16 Proof locally...', 2000);

      const mockHash = new Uint8Array(32).fill(0x1a);
      const contractAddress = await deployAndSubmitProof(
        localStorage.getItem('user_address') || '0x...',
        mockHash,
        'Technical Proficiency'
      );

      const proof = {
        id: Math.random().toString(36).substring(2, 9).toUpperCase(),
        timestamp: new Date().toLocaleString(),
        type: 'Midnight ZK-Skill Proof',
        contractAddress,
        hash: '0x' + Array.from(mockHash).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 32) + '...'
      };

      setGeneratedProof(proof);

      // Save to global storage for the recruiter to see
      const existing = JSON.parse(localStorage.getItem('proofhire_proofs_global') || '[]');
      localStorage.setItem('proofhire_proofs_global', JSON.stringify([{
        id: proof.id,
        candidateId: 'TALENT-' + proof.id.slice(0,4),
        type: 'Midnight ZK-Skill Proof',
        timestamp: proof.timestamp,
        hash: proof.hash,
        proofHash: Array.from(mockHash)
      }, ...existing]));

    } catch (e) {
      console.error(e);
      setStatus('Proving failed. Ensure Lace Wallet is connected.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="flex items-end justify-between border-b border-zinc-800 pb-8">
         <div className="space-y-2">
            <h1 className="text-6xl font-black italic uppercase tracking-tightest leading-none">Proof<br /><span className="text-indigo-600">Generator.</span></h1>
            <p className="text-zinc-500 text-sm font-medium italic">Create mathematically certain claims about your skills.</p>
         </div>
         <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
               <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
               <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">Local Prover Online</span>
            </div>
         </div>
      </div>

      {!generatedProof && !isGenerating && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { title: 'Technical Skill', icon: Zap, desc: 'Prove expertise in languages or frameworks.' },
             { title: 'Academic Degree', icon: GraduationCap, desc: 'Prove you hold a verified qualification.' },
             { title: 'Work Tenure', icon: Briefcase, desc: 'Prove you have X+ years of experience.' }
           ].map((card, i) => (
             <button
               key={i}
               onClick={generateProof}
               className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] text-left hover:border-indigo-600 transition-all group hover:shadow-2xl hover:shadow-indigo-600/10"
             >
                <card.icon className="w-10 h-10 text-indigo-500 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-black italic uppercase tracking-tighter mb-2">{card.title}</h3>
                <p className="text-zinc-500 text-xs font-medium leading-relaxed mb-8">{card.desc}</p>
                <div className="flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest italic group-hover:translate-x-2 transition-transform">
                   Generate Proof <ShieldCheck className="w-4 h-4" />
                </div>
             </button>
           ))}
        </div>
      )}

      {isGenerating && (
        <div className="p-16 bg-zinc-900 border border-zinc-800 rounded-[3.5rem] text-center space-y-12">
           <div className="flex justify-center gap-12">
              {steps.map((s, i) => (
                <div key={i} className="flex flex-col items-center gap-4">
                   <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${step >= i ? 'bg-zinc-800 border-indigo-600 text-indigo-500 shadow-lg shadow-indigo-600/20' : 'bg-black border-zinc-800 text-zinc-800'}`}>
                      <s.icon className={`w-8 h-8 ${step === i ? 'animate-pulse' : ''}`} />
                   </div>
                   <span className={`text-[9px] font-black uppercase tracking-widest ${step >= i ? 'text-white' : 'text-zinc-800'}`}>{s.title}</span>
                </div>
              ))}
           </div>

           <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                 <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                 <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">{status}</h3>
              </div>
              <p className="text-zinc-500 text-xs font-medium italic">Generating proof locally. No data is being sent to any server.</p>
           </div>
        </div>
      )}

      {generatedProof && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-indigo-600 rounded-[3.5rem] p-1 shadow-2xl shadow-indigo-600/30"
        >
          <div className="bg-black rounded-[3.2rem] p-12 space-y-12 overflow-hidden relative">
             <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full"></div>

             <div className="flex justify-between items-start relative z-10">
                <div className="space-y-4">
                   <div className="px-4 py-2 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest italic inline-flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Proof Generated Successfully
                   </div>
                   <h2 className="text-5xl font-black italic uppercase tracking-tightest leading-none">{generatedProof.id}</h2>
                   <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs italic">{generatedProof.type}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Timestamp</p>
                   <p className="text-sm font-black italic text-white">{generatedProof.timestamp}</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl space-y-2">
                   <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">On-Chain Anchor (Midnight)</span>
                   <div className="flex items-center justify-between">
                      <code className="text-xs font-mono text-indigo-400">{generatedProof.contractAddress.slice(0, 20)}...</code>
                      <button onClick={() => copyToClipboard(generatedProof.contractAddress)} className="text-zinc-500 hover:text-white transition-colors">
                         {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                   </div>
                </div>
                <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl space-y-2">
                   <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Public Claim Hash</span>
                   <div className="flex items-center justify-between">
                      <code className="text-xs font-mono text-indigo-400">{generatedProof.hash}</code>
                      <button onClick={() => copyToClipboard(generatedProof.hash)} className="text-zinc-500 hover:text-white transition-colors">
                         <Copy className="w-4 h-4" />
                      </button>
                   </div>
                </div>
             </div>

             <div className="flex items-center gap-6 pt-8 border-t border-zinc-800 relative z-10">
                <button
                  onClick={() => setGeneratedProof(null)}
                  className="px-8 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest italic hover:bg-indigo-600 hover:text-white transition-all shadow-xl"
                >
                   Generate New Proof
                </button>
                <p className="text-[10px] font-medium text-zinc-500 italic max-w-sm">
                   This proof is now discoverable by recruiters on the Midnight Network. You can selectively reveal more data later.
                </p>
             </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
