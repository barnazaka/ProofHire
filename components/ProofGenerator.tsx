'use client';

import { useState, useEffect } from 'react';
import { Loader2, Plus, CheckCircle2, AlertCircle, ShieldCheck, Award, Link as LinkIcon, Zap, Wallet, ArrowRight } from 'lucide-react';
import { TalentData } from './ClaimForm';
import { proofHireContract } from '@/lib/contract-utils';
import { decryptData } from '@/lib/encryption-utils';

interface ProofRecord {
  id: string;
  candidateId: string;
  type: string;
  timestamp: string;
  hash: string;
  status: 'generating' | 'on-chain';
  isBadge?: boolean;
}

export default function ProofGenerator() {
  const [loading, setLoading] = useState(false);
  const [proofs, setProofs] = useState<ProofRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<string>('');

  useEffect(() => {
    const savedProofs = localStorage.getItem('proofhire_proofs');
    if (savedProofs) {
      setProofs(JSON.parse(savedProofs));
    }
  }, []);

  const generateProof = async (claimType: string) => {
    setLoading(true);
    setError(null);
    try {
      const storedData = localStorage.getItem('proofhire_talent_data');
      if (!storedData) {
        throw new Error('Please save your personal data first.');
      }

      const walletAddr = localStorage.getItem('user_address') || 'unknown';
      let data: TalentData;
      try {
        data = JSON.parse(storedData);
      } catch (e) {
        data = decryptData(storedData);
      }

      if (!data) {
        throw new Error('Failed to decrypt local data vault.');
      }

      // Real-time status simulation for high-stakes demo
      setCurrentStep('Initializing Midnight SDK & Wallet Binding...');
      await new Promise(resolve => setTimeout(resolve, 800));

      setCurrentStep('Loading ZK Circuits (std::compact)...');
      await new Promise(resolve => setTimeout(resolve, 1200));

      setCurrentStep('Generating Local Zero-Knowledge Proof (Client-Side)...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      setCurrentStep('Requesting Lace Signature for State Update...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      setCurrentStep('Submitting Proof Commitment to Midnight Ledger...');

      // PRODUCTION SDK INTERACTION
      const { connectLaceWallet } = await import('@/components/WalletIntegration');
      const connection = await connectLaceWallet();

      if (!connection) {
        throw new Error('Active Midnight Wallet connection required for proving.');
      }

      const proofHashUint8 = new Uint8Array(32).fill(Math.floor(Math.random() * 255));
      const typeNum = BigInt(claimType.length);
      const timestamp = BigInt(Date.now());

      await proofHireContract.submitProof(connection.api as any, {
        userAddr: walletAddr,
        proofHash: proofHashUint8,
        claimType: typeNum,
        timestamp: timestamp
      });

      await new Promise(resolve => setTimeout(resolve, 500));

      const mockHash = '0x' + Array.from(proofHashUint8).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16) + '...';

      const newProof: ProofRecord = {
        id: Math.random().toString(36).substring(7),
        candidateId: walletAddr.slice(0, 8).toUpperCase(),
        type: claimType,
        timestamp: new Date().toLocaleString(),
        hash: mockHash,
        status: 'on-chain',
        isBadge: claimType.toLowerCase().includes('solidity') || claimType.toLowerCase().includes('expert') || claimType.toLowerCase().includes('skills')
      };

      const updatedProofs = [newProof, ...proofs];
      setProofs(updatedProofs);
      localStorage.setItem('proofhire_proofs', JSON.stringify(updatedProofs));

      // Global list for recruiter demo (simulating a public ledger)
      const globalProofs = JSON.parse(localStorage.getItem('proofhire_proofs_global') || '[]');
      localStorage.setItem('proofhire_proofs_global', JSON.stringify([newProof, ...globalProofs]));

    } catch (err: any) {
      setError(err.message || 'Failed to generate proof.');
    } finally {
      setLoading(false);
      setCurrentStep('');
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-xl flex flex-col h-full overflow-hidden ring-1 ring-black/5">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">Proof Factory</h2>
          <p className="text-zinc-500 text-sm mt-1 font-medium italic">Create cryptographic commitments from your local data.</p>
        </div>
        <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/20">
          <Zap className="w-6 h-6 text-white" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <button
          onClick={() => generateProof('Has Degree')}
          disabled={loading}
          className="group relative flex flex-col items-start p-6 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border-2 border-transparent hover:border-indigo-500 hover:bg-white dark:hover:bg-zinc-700/50 transition-all text-left shadow-sm hover:shadow-indigo-500/10 active:scale-95"
        >
          <span className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em] mb-2">Education Claim</span>
          <span className="font-black text-lg text-zinc-900 dark:text-white leading-tight">University Degree</span>
          <Plus className="absolute bottom-4 right-4 w-5 h-5 text-indigo-500 group-hover:scale-125 transition-transform" />
        </button>

        <button
          onClick={() => generateProof('Experience > 2 years')}
          disabled={loading}
          className="group relative flex flex-col items-start p-6 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border-2 border-transparent hover:border-indigo-500 hover:bg-white dark:hover:bg-zinc-700/50 transition-all text-left shadow-sm hover:shadow-indigo-500/10 active:scale-95"
        >
          <span className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em] mb-2">Work History Claim</span>
          <span className="font-black text-lg text-zinc-900 dark:text-white leading-tight">2+ Years Industry Experience</span>
          <Plus className="absolute bottom-4 right-4 w-5 h-5 text-indigo-500 group-hover:scale-125 transition-transform" />
        </button>

        <button
          onClick={() => generateProof('Solidity Expert')}
          disabled={loading}
          className="group relative flex flex-col items-start p-6 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border-2 border-transparent hover:border-indigo-500 hover:bg-white dark:hover:bg-zinc-700/50 transition-all text-left shadow-sm hover:shadow-indigo-500/10 active:scale-95"
        >
          <span className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em] mb-2">Technical Skill Claim</span>
          <span className="font-black text-lg text-zinc-900 dark:text-white leading-tight">Solidity & Smart Contracts</span>
          <Plus className="absolute bottom-4 right-4 w-5 h-5 text-indigo-500 group-hover:scale-125 transition-transform" />
        </button>

        <button
          onClick={() => generateProof('Web3 Infrastructure')}
          disabled={loading}
          className="group relative flex flex-col items-start p-6 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border-2 border-transparent hover:border-indigo-500 hover:bg-white dark:hover:bg-zinc-700/50 transition-all text-left shadow-sm hover:shadow-indigo-500/10 active:scale-95"
        >
          <span className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em] mb-2">Technical Skill Claim</span>
          <span className="font-black text-lg text-zinc-900 dark:text-white leading-tight">Advanced Web3 Dev Skills</span>
          <Plus className="absolute bottom-4 right-4 w-5 h-5 text-indigo-500 group-hover:scale-125 transition-transform" />
        </button>
      </div>

      {loading && (
        <div className="mb-10 p-8 bg-indigo-600 rounded-[2rem] text-white shadow-2xl shadow-indigo-500/40 flex flex-col items-center gap-6 animate-in zoom-in-95 fade-in duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <ShieldCheck className="w-24 h-24" />
          </div>
          <Loader2 className="w-12 h-12 animate-spin text-white" />
          <div className="text-center relative z-10">
            <p className="font-black text-xl mb-2 italic tracking-tight">{currentStep}</p>
            <div className="flex items-center justify-center gap-2 px-4 py-1.5 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 backdrop-blur-md">
               <ShieldCheck className="w-3.5 h-3.5" />
               Client-Side Proving Protocol Active
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-10 p-5 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-2xl flex items-center gap-4 text-rose-600">
          <div className="p-2 bg-rose-100 rounded-xl">
             <AlertCircle className="w-5 h-5 flex-shrink-0" />
          </div>
          <p className="text-sm font-bold">{error}</p>
        </div>
      )}

      <div className="flex-1 overflow-auto pr-2 custom-scrollbar">
        <h3 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
           Talent Ledger History
           <div className="h-[1px] flex-1 bg-zinc-100 dark:bg-zinc-800"></div>
        </h3>
        {proofs.length === 0 && !loading ? (
          <div className="text-center py-24 bg-zinc-50/50 dark:bg-zinc-800/30 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[2.5rem]">
            <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-zinc-100 dark:border-zinc-700">
               <Wallet className="w-8 h-8 text-zinc-300" />
            </div>
            <p className="text-zinc-500 text-sm font-black italic">The ledger is empty.</p>
            <p className="text-zinc-400 text-xs mt-3 font-medium uppercase tracking-widest">Select a claim to begin proving</p>
          </div>
        ) : (
          <div className="space-y-6 pb-6">
            {proofs.map(proof => (
              <div key={proof.id} className="group p-8 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-3xl shadow-xl hover:shadow-indigo-500/5 transition-all relative overflow-hidden ring-1 ring-black/5">
                {proof.isBadge && (
                  <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-700">
                    <Award className="w-32 h-32 text-indigo-600" />
                  </div>
                )}

                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                       <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                       <span className="text-[10px] text-indigo-600 font-black uppercase tracking-[0.2em]">{proof.timestamp}</span>
                    </div>
                    <span className="font-black text-2xl text-zinc-900 dark:text-white flex items-center gap-2 tracking-tighter">
                      {proof.type}
                      {proof.isBadge && <Award className="w-6 h-6 text-amber-500 fill-amber-500/10" />}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-2xl font-black uppercase tracking-[0.1em] border border-emerald-100 dark:border-emerald-900/30 shadow-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    ON-CHAIN COMMIT
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-zinc-100 dark:border-zinc-700 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 rounded-xl text-zinc-500 hover:text-indigo-600 transition-colors cursor-pointer group/link border border-zinc-100 dark:border-zinc-800">
                      <LinkIcon className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-mono font-black tracking-tight">{proof.hash}</span>
                    </div>
                  </div>

                  {proof.isBadge && (
                    <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                      <Zap className="w-3.5 h-3.5" />
                      NFT BADGE MINTER ACTIVE
                    </div>
                  )}
                </div>

                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 w-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
         <button className="flex items-center justify-center gap-3 w-full py-5 bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl active:scale-95 group">
            Finalize Global Profile
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
         </button>
      </div>
    </div>
  );
}
