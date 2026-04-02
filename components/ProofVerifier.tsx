'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2, CheckCircle, XCircle, ShieldCheck, AlertCircle, Award, Eye, Link as LinkIcon, UserCircle } from 'lucide-react';

interface CandidateProof {
  id: string;
  candidateId: string;
  type: string;
  timestamp: string;
  hash: string;
  hasBadge?: boolean;
}

export default function ProofVerifier() {
  const [loading, setLoading] = useState<string | null>(null);
  const [candidateProofs, setCandidateProofs] = useState<CandidateProof[]>([]);
  const [verificationResult, setVerificationResult] = useState<Record<string, 'valid' | 'invalid' | null>>({});
  const [revealedData, setRevealedData] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Mock candidate data for demo
    const mockProofs: CandidateProof[] = [
      { id: '1', candidateId: 'C-8210', type: 'Has Degree', timestamp: '2025-05-10 14:30', hash: '0x7e8...f2c' },
      { id: '2', candidateId: 'C-8210', type: 'Experience > 2 years', timestamp: '2025-05-12 10:15', hash: '0x3a4...e9d' },
      { id: '3', candidateId: 'C-9402', type: 'Solidity Expert', timestamp: '2025-05-13 16:45', hash: '0x1b2...c8a', hasBadge: true },
      { id: '4', candidateId: 'C-9402', type: 'Has Degree', timestamp: '2025-05-13 16:50', hash: '0x9d3...e4b' },
      { id: '5', candidateId: 'C-5109', type: 'Experience > 5 years', timestamp: '2025-05-14 09:20', hash: '0xf82...a10' }
    ];
    setCandidateProofs(mockProofs);
  }, []);

  const verifyProof = async (proofId: string) => {
    setLoading(proofId);
    try {
      // Simulate Midnight contract verification call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const result = Math.random() > 0.1 ? 'valid' : 'invalid';
      setVerificationResult(prev => ({
        ...prev,
        [proofId]: result
      }));
    } catch (err) {
      console.error('Failed to verify proof:', err);
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
    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-8 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-extrabold flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-green-600" />
            Verification Center
          </h2>
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50 dark:bg-zinc-800 px-3 py-1.5 rounded-full border border-zinc-100 dark:border-zinc-700">
            ZK Verification Engine active
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by candidate ID, proof hash, or claim type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm font-medium"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-zinc-50 dark:bg-zinc-800/80 backdrop-blur-md z-10">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.1em]">Candidate</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.1em]">Proof Claim</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.1em]">On-Chain Status</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.1em] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filteredProofs.map(proof => (
              <tr key={proof.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                <td className="px-6 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold border border-zinc-200 dark:border-zinc-700">
                      <UserCircle className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">{proof.candidateId}</span>
                      <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold">
                        <LinkIcon className="w-3 h-3" />
                        {proof.hash}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm flex items-center gap-2">
                      {proof.type}
                      {proof.hasBadge && <Award className="w-4 h-4 text-blue-600" />}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{proof.timestamp}</span>
                    {revealedData[proof.id] && (
                      <div className="mt-2 text-[10px] p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-lg text-blue-800 dark:text-blue-300 animate-in slide-in-from-top-1 duration-200">
                        <strong>Requested Reveal:</strong> This candidate has provided additional encrypted context for this claim.
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-6">
                  {verificationResult[proof.id] === 'valid' ? (
                    <div className="inline-flex items-center gap-1.5 text-green-600 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-widest border border-green-100 dark:border-green-900/30 shadow-sm animate-in zoom-in duration-300">
                      <CheckCircle className="w-4 h-4" />
                      Valid
                    </div>
                  ) : verificationResult[proof.id] === 'invalid' ? (
                    <div className="inline-flex items-center gap-1.5 text-red-600 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-widest border border-red-100 dark:border-red-900/30 shadow-sm animate-in zoom-in duration-300">
                      <XCircle className="w-4 h-4" />
                      Invalid
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-widest border border-zinc-200 dark:border-zinc-700 opacity-60">
                      <ShieldCheck className="w-4 h-4" />
                      Pending
                    </div>
                  )}
                </td>
                <td className="px-6 py-6 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => toggleReveal(proof.id)}
                      className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                      title="Request selective reveal"
                    >
                      <Eye className={`w-5 h-5 ${revealedData[proof.id] ? 'text-blue-600' : ''}`} />
                    </button>
                    <button
                      onClick={() => verifyProof(proof.id)}
                      disabled={loading === proof.id || verificationResult[proof.id] !== undefined}
                      className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold uppercase tracking-widest transition-all shadow-md active:scale-[0.98] ${
                        verificationResult[proof.id] !== undefined
                          ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border border-zinc-200 dark:border-zinc-700 shadow-none cursor-default'
                          : 'bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 text-white hover:bg-zinc-800 dark:hover:opacity-90'
                      }`}
                    >
                      {loading === proof.id ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Verifying...
                        </div>
                      ) : verificationResult[proof.id] !== undefined ? (
                        'Verified'
                      ) : (
                        'Verify On-Chain'
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProofs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center border-t border-zinc-100 dark:border-zinc-800">
            <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-full mb-6 border border-zinc-100 dark:border-zinc-700">
              <ShieldCheck className="w-12 h-12 text-zinc-200" />
            </div>
            <h3 className="text-xl font-bold mb-2">No candidates found</h3>
            <p className="text-zinc-500 max-w-xs mx-auto text-sm">Try adjusting your search criteria or wait for more proofs to be submitted on-chain.</p>
          </div>
        )}
      </div>

      <div className="p-8 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold">Midnight Network Verification</span>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-2xl">
              Each verification request performs a direct cryptographic proof validation against the smart contract.
              <strong> Privacy Assurance:</strong> The mathematical outcome of the ZK proof is public, but the candidate's personal data remains private in their local browser.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
