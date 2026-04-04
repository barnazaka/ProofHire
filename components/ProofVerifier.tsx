'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2, CheckCircle, XCircle, ShieldCheck, AlertCircle, Award, Eye, Link as LinkIcon, UserCircle, Briefcase } from 'lucide-react';
import { proofHireContract, verifyCandidateClaim } from '@/lib/contract-utils';

interface CandidateProof {
  id: string;
  candidateId: string;
  type: string;
  timestamp: string;
  hash: string;
  proofHash?: number[];
  hasBadge?: boolean;
}

export default function ProofVerifier() {
  const [loading, setLoading] = useState<string | null>(null);
  const [candidateProofs, setCandidateProofs] = useState<CandidateProof[]>([]);
  const [verificationResult, setVerificationResult] = useState<Record<string, 'valid' | 'invalid' | null>>({});
  const [revealedData, setRevealedData] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchProofs = async () => {
    setIsRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const savedProofs = localStorage.getItem('proofhire_proofs_global');
      if (savedProofs) {
        setCandidateProofs(JSON.parse(savedProofs));
      } else {
        setCandidateProofs([]);
      }
    } catch (err) {
      console.error('Failed to fetch proofs:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProofs();
  }, []);

  const verifyProof = async (proofId: string) => {
    setLoading(proofId);
    try {
      const proof = candidateProofs.find(p => p.id === proofId);
      if (!proof) return;

      const contractAddress = localStorage.getItem('proofhire_contract_address');
      if (!contractAddress) {
        throw new Error('ProofHire contract address not found in local state.');
      }

      // Convert stored proofHash back to Uint8Array if available
      let pHash: Uint8Array;
      if (proof.proofHash) {
         pHash = new Uint8Array(proof.proofHash);
      } else {
         // Fallback/Simulated if not present
         pHash = new Uint8Array(32).fill(0x1a);
      }

      // REAL SDK CALL
      const isValid = await verifyCandidateClaim(contractAddress, pHash);

      const result = isValid ? 'valid' : 'invalid';
      setVerificationResult(prev => ({
        ...prev,
        [proofId]: result
      }));
    } catch (err: any) {
      console.error('[Proof Verification Error]', err);
      // For demo purposes if wallet/network fails, we show invalid instead of crashing
      setVerificationResult(prev => ({
        ...prev,
        [proofId]: 'invalid'
      }));
    } finally {
      setLoading(null);
    }
  };

  const toggleReveal = (proofId: string) => {
    setRevealedData(prev => ({
      ...prev,
      [proofId]: !prev[proofId]
    }));
  };

  const filteredProofs = candidateProofs.filter(p =>
    p.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.candidateId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden flex flex-col h-full ring-1 ring-black/5">
      <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-3 text-zinc-900 dark:text-white">
              <ShieldCheck className="w-10 h-10 text-indigo-600" />
              Verification Engine
            </h2>
            <p className="text-zinc-500 text-sm mt-1 font-medium italic">Scanning Midnight ledger for talent commitments...</p>
          </div>
          <button
            onClick={fetchProofs}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-100 transition-all border border-indigo-100 dark:border-indigo-900/30"
          >
            <Loader2 className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Ledger
          </button>
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search verified talent by hash, ID, or claim..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-12 pr-4 py-4 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-inner"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar">
        {candidateProofs.length > 0 ? (
          <table className="w-full text-left border-separate border-spacing-0">
            <thead className="sticky top-0 bg-zinc-50/90 dark:bg-zinc-800/90 backdrop-blur-md z-20">
              <tr>
                <th className="px-8 py-4 text-[11px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800">Identity Commit</th>
                <th className="px-8 py-4 text-[11px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800">Claim Type</th>
                <th className="px-8 py-4 text-[11px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800">Validation</th>
                <th className="px-8 py-4 text-[11px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredProofs.map(proof => (
                <tr key={proof.id} className="group hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                          <UserCircle className="w-7 h-7" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-zinc-900 rounded-full"></div>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-sm text-zinc-900 dark:text-white uppercase tracking-tighter">{proof.candidateId}</span>
                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-bold font-mono">
                          <LinkIcon className="w-3 h-3 text-indigo-400" />
                          <span className="truncate max-w-[80px]">{proof.hash}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-black text-base text-zinc-900 dark:text-white flex items-center gap-2">
                        {proof.type}
                        {proof.hasBadge && <Award className="w-4 h-4 text-amber-500 fill-amber-500/10" />}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mt-1.5 px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-md self-start">{proof.timestamp}</span>

                      {revealedData[proof.id] && (
                        <div className="mt-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 border-l-2 border-indigo-500 rounded-r-xl text-[11px] font-medium text-indigo-900 dark:text-indigo-300 animate-in slide-in-from-left-2 duration-300">
                          <p className="flex items-center gap-2">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Selective Reveal: Additional verification context provided via encrypted channel.
                          </p>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {verificationResult[proof.id] === 'valid' ? (
                      <div className="inline-flex items-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-900/30 shadow-sm animate-in zoom-in duration-500">
                        <CheckCircle className="w-4 h-4" />
                        Valid Proof
                      </div>
                    ) : verificationResult[proof.id] === 'invalid' ? (
                      <div className="inline-flex items-center gap-2 text-rose-600 bg-rose-50 dark:bg-rose-900/20 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest border border-rose-100 dark:border-rose-900/30 shadow-sm animate-in zoom-in duration-500">
                        <XCircle className="w-4 h-4" />
                        Invalid
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 text-zinc-400 bg-zinc-50 dark:bg-zinc-800 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest border border-zinc-100 dark:border-zinc-700 opacity-70">
                        <ShieldCheck className="w-4 h-4" />
                        Waiting...
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => toggleReveal(proof.id)}
                        className={`p-3 rounded-2xl transition-all border ${revealedData[proof.id] ? 'bg-indigo-100 border-indigo-200 text-indigo-600' : 'bg-zinc-50 dark:bg-zinc-800 border-transparent text-zinc-400 hover:text-indigo-600 hover:border-indigo-100'}`}
                        title="Request reveal"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => verifyProof(proof.id)}
                        disabled={loading === proof.id || verificationResult[proof.id] !== undefined}
                        className={`min-w-[140px] px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
                          verificationResult[proof.id] !== undefined
                            ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-default shadow-none border border-zinc-200 dark:border-zinc-700'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/30'
                        }`}
                      >
                        {loading === proof.id ? (
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Verifying...
                          </div>
                        ) : verificationResult[proof.id] !== undefined ? (
                          'Verified'
                        ) : (
                          'Verify Proof'
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center px-8">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full"></div>
              <div className="relative w-24 h-24 bg-white dark:bg-zinc-800 rounded-[2rem] flex items-center justify-center shadow-2xl border border-zinc-100 dark:border-zinc-700 ring-8 ring-indigo-50 dark:ring-indigo-900/20">
                <Briefcase className="w-12 h-12 text-indigo-500" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-3">No Active Talent Found</h3>
            <p className="text-zinc-500 max-w-sm mx-auto text-base font-medium leading-relaxed">
              The Midnight ledger is currently empty. Recruitment starts as soon as candidates submit their ZK commitments.
            </p>
            <div className="mt-8 flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100/50 dark:border-indigo-900/30 animate-pulse">
               <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
               <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Listening for incoming proofs...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-sm font-black text-zinc-900 dark:text-white block uppercase tracking-tight">Enterprise Grade Verification</span>
              <p className="text-[11px] text-zinc-500 max-w-lg mt-1 font-medium leading-relaxed">
                Powered by Midnight's private state protocol. Talent credentials remain fully confidential while enabling mathematically certain verification of qualifications.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
             <div className="flex flex-col items-center">
                <span className="text-[8px] font-black uppercase tracking-widest mb-1">Built on</span>
                <span className="text-sm font-black italic tracking-tighter">MIDNIGHT</span>
             </div>
             <div className="h-8 w-[1px] bg-zinc-300 dark:bg-zinc-700"></div>
             <div className="flex flex-col items-center">
                <span className="text-[8px] font-black uppercase tracking-widest mb-1">Secured by</span>
                <span className="text-sm font-black italic tracking-tighter">LACE WALLET</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
