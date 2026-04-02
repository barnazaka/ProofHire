'use client';

import { useState, useEffect } from 'react';
import { Loader2, Plus, CheckCircle2, AlertCircle, ShieldCheck, Award, Link as LinkIcon } from 'lucide-react';
import { TalentData } from './ClaimForm';

interface ProofRecord {
  id: string;
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

      const data: TalentData = JSON.parse(storedData);

      // Step-by-step status simulation
      setCurrentStep('Initializing Midnight SDK...');
      await new Promise(resolve => setTimeout(resolve, 800));

      setCurrentStep('Loading ZK Circuits...');
      await new Promise(resolve => setTimeout(resolve, 1200));

      setCurrentStep('Generating Local Proof...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      setCurrentStep('Submitting Commitment to Chain...');
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockHash = '0x' + Math.random().toString(16).slice(2, 10) + '...' + Math.random().toString(16).slice(2, 10);

      const newProof: ProofRecord = {
        id: Math.random().toString(36).substring(7),
        type: claimType,
        timestamp: new Date().toLocaleString(),
        hash: mockHash,
        status: 'on-chain',
        isBadge: claimType.toLowerCase().includes('solidity') || claimType.toLowerCase().includes('expert')
      };

      const updatedProofs = [newProof, ...proofs];
      setProofs(updatedProofs);
      localStorage.setItem('proofhire_proofs', JSON.stringify(updatedProofs));

    } catch (err: any) {
      setError(err.message || 'Failed to generate proof.');
    } finally {
      setLoading(false);
      setCurrentStep('');
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Generate Proofs</h2>
        <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => generateProof('Has Degree')}
          disabled={loading}
          className="flex items-center justify-between p-5 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-left"
        >
          <div className="flex flex-col">
            <span className="font-bold text-sm">Has a Degree</span>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Education Proof</span>
          </div>
          <Plus className="w-5 h-5 text-blue-600" />
        </button>

        <button
          onClick={() => generateProof('Experience > 2 years')}
          disabled={loading}
          className="flex items-center justify-between p-5 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-left"
        >
          <div className="flex flex-col">
            <span className="font-bold text-sm">2+ Years Exp.</span>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Professional Proof</span>
          </div>
          <Plus className="w-5 h-5 text-blue-600" />
        </button>

        <button
          onClick={() => generateProof('Solidity Expert')}
          disabled={loading}
          className="flex items-center justify-between p-5 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-left"
        >
          <div className="flex flex-col">
            <span className="font-bold text-sm">Solidity Expert</span>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Technical Proof</span>
          </div>
          <Plus className="w-5 h-5 text-blue-600" />
        </button>

        <button
          onClick={() => generateProof('Advanced Web3')}
          disabled={loading}
          className="flex items-center justify-between p-5 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-left"
        >
          <div className="flex flex-col">
            <span className="font-bold text-sm">Web3 Skills</span>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Technical Proof</span>
          </div>
          <Plus className="w-5 h-5 text-blue-600" />
        </button>
      </div>

      {loading && (
        <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border-2 border-blue-100 dark:border-blue-900/30 flex flex-col items-center gap-4 text-blue-700 dark:text-blue-300 animate-in fade-in zoom-in duration-300">
          <Loader2 className="w-10 h-10 animate-spin" />
          <div className="text-center">
            <p className="font-bold mb-1">{currentStep}</p>
            <p className="text-xs text-blue-500 dark:text-blue-400">Personal data is never leaving your browser.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-600">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="flex-1 overflow-auto pr-2 custom-scrollbar">
        <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-6">On-Chain Proof Ledger</h3>
        {proofs.length === 0 && !loading ? (
          <div className="text-center py-20 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-3xl">
            <p className="text-zinc-400 text-sm">No proofs generated yet.</p>
            <p className="text-zinc-500 text-xs mt-2 italic">Select a claim above to generate your first ZK proof.</p>
          </div>
        ) : (
          <div className="space-y-4 pb-4">
            {proofs.map(proof => (
              <div key={proof.id} className="p-5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-sm relative overflow-hidden group">
                {proof.isBadge && (
                  <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Award className="w-24 h-24 text-blue-600" />
                  </div>
                )}

                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex flex-col">
                    <span className="font-extrabold text-lg flex items-center gap-2">
                      {proof.type}
                      {proof.isBadge && <Award className="w-4 h-4 text-blue-600" />}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{proof.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full font-extrabold border border-green-100 dark:border-green-900/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    VERIFIED ON-CHAIN
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-700 relative z-10">
                  <div className="flex items-center gap-1.5 text-blue-500 hover:text-blue-600 transition-colors cursor-pointer group/link">
                    <LinkIcon className="w-3 h-3" />
                    <span className="text-[10px] font-mono font-bold tracking-tight">{proof.hash}</span>
                  </div>

                  {proof.isBadge && (
                    <div className="text-[10px] font-bold text-blue-600 flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-lg border border-blue-100 dark:border-blue-900/50">
                      NFT BADGE GENERATED
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
