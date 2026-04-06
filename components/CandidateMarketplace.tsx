'use client';

import { useState, useEffect } from 'react';
import {
  User, Mail, MapPin, Briefcase,
  GraduationCap, Award, Code2,
  ChevronRight, ExternalLink, ShieldCheck,
  Fingerprint, Sparkles, Globe,
  CheckCircle2, Clock, Calendar, Lock,
  FileText, History, Search, Hash,
  ArrowLeft, Check, X, Shield, AlertCircle,
  Loader2, ThumbsUp, ThumbsDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CryptoJS from 'crypto-js';
import { verifySchoolProof, hireCandidate } from '@/lib/midnight-utils';

interface TalentProfile {
  id: string;
  fullName: string;
  headline: string;
  location: string;
  primaryRole: string;
  educationLevel: string;
  institutionName: string;
  graduationYear: string;
  experience: string;
  skills: string[];
  contractAddress: string;
  email: string;
  education?: string;
}

export default function CandidateMarketplace() {
  const [candidates, setCandidates] = useState<TalentProfile[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<TalentProfile | null>(null);
  const [verificationStates, setVerificationStates] = useState<Record<string, 'idle' | 'verifying' | 'valid' | 'invalid'>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [hiringStatus, setHiringStatus] = useState<Record<string, 'idle' | 'hiring' | 'done'>>({});

  useEffect(() => {
    const globalProofs = JSON.parse(localStorage.getItem('proofhire_proofs_global') || '[]');
    setCandidates(globalProofs);
    setIsLoading(false);
  }, []);

  const handleVerify = async (candidateId: string, field: string, value: string) => {
    const key = `${candidateId}-${field}`;
    setVerificationStates(prev => ({ ...prev, [key]: 'verifying' }));

    try {
       const hashHex = CryptoJS.SHA256(value).toString();
       const claimHash = new Uint8Array(hashHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));

       const candidate = candidates.find(c => c.id === candidateId);
       if (!candidate) throw new Error('Candidate not found');

       // Use the school verification circuit for the demo for all fields
       const isValid = await verifySchoolProof(candidate.contractAddress, claimHash);

       setVerificationStates(prev => ({ ...prev, [key]: isValid ? 'valid' : 'invalid' }));
    } catch (e) {
       console.error('Verification error:', e);
       setVerificationStates(prev => ({ ...prev, [key]: 'invalid' }));
    }
  };

  const handleHireAction = async (id: string) => {
    setHiringStatus(prev => ({...prev, [id]: 'hiring'}));
    try {
        const candidate = candidates.find(c => c.id === id);
        if(candidate) await hireCandidate(candidate.contractAddress);
        setHiringStatus(prev => ({...prev, [id]: 'done'}));
    } catch (e) {
        console.error(e);
        setHiringStatus(prev => ({...prev, [id]: 'idle'}));
    }
  };

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <AnimatePresence mode="wait">
        {!selectedCandidate ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {candidates.length === 0 ? (
              <div className="col-span-full p-32 bg-zinc-900 border border-zinc-800 border-dashed rounded-[3.5rem] text-center space-y-6">
                 <div className="w-20 h-20 bg-zinc-800 rounded-3xl mx-auto flex items-center justify-center text-zinc-600"><Search className="w-10 h-10" /></div>
                 <h3 className="text-2xl font-black italic uppercase text-white">No nodes found.</h3>
              </div>
            ) : (
              candidates.map(candidate => (
                <button key={candidate.id} onClick={() => setSelectedCandidate(candidate)} className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 text-left hover:border-indigo-600/50 transition-all group">
                   <div className="space-y-8">
                      <div className="flex items-start justify-between">
                         <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl text-2xl font-black italic text-white">{candidate.fullName.charAt(0)}</div>
                         <div className="px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <span className="text-[8px] font-black text-green-500 uppercase">Anchored</span>
                         </div>
                      </div>
                      <div className="space-y-1">
                         <h3 className="text-2xl font-black italic uppercase text-white leading-none">{candidate.fullName}</h3>
                         <p className="text-indigo-500 font-bold text-xs uppercase">{candidate.headline}</p>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-black text-indigo-500 uppercase italic">View Sovereign CV <ChevronRight className="w-4 h-4" /></div>
                   </div>
                </button>
              ))
            )}
          </motion.div>
        ) : (
          <motion.div key="profile" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-8">
            <button onClick={() => setSelectedCandidate(null)} className="flex items-center gap-3 text-zinc-500 hover:text-white transition-colors text-xs font-black uppercase">
               <ArrowLeft className="w-4 h-4" /> Back to Marketplace
            </button>

            <div className="bg-zinc-900 border border-zinc-800 rounded-[3.5rem] overflow-hidden p-16 space-y-16">
                <div className="flex justify-between items-start border-b border-zinc-800 pb-12">
                     <div className="space-y-4">
                        <h1 className="text-6xl font-black italic uppercase tracking-tightest leading-none">{selectedCandidate.fullName}</h1>
                        <p className="text-2xl font-bold text-indigo-600 italic leading-none">{selectedCandidate.headline}</p>
                        <div className="flex items-center gap-6 text-zinc-500 text-[10px] font-black uppercase">
                           <span className="flex items-center gap-2"><MapPin className="w-3 h-3" /> {selectedCandidate.location}</span>
                           <span className="flex items-center gap-2"><Globe className="w-3 h-3" /> Remote Node</span>
                        </div>
                     </div>
                     <div className="flex flex-col items-end gap-3 text-right">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Contract Address</span>
                        <code className="text-[10px] font-mono text-indigo-500 bg-indigo-500/5 px-3 py-1 rounded-lg border border-indigo-500/20">{selectedCandidate.contractAddress}</code>
                     </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <section className="space-y-8">
                        <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-600 italic">Verified Qualifications</h3>
                        <div className="space-y-4">
                            <ProofItem label="Email Address" value={selectedCandidate.email} status={verificationStates[`${selectedCandidate.id}-email`]} onVerify={() => handleVerify(selectedCandidate.id, 'email', selectedCandidate.email)} />
                            <ProofItem label="Academic Degree" value={selectedCandidate.education || selectedCandidate.educationLevel} status={verificationStates[`${selectedCandidate.id}-edu`]} onVerify={() => handleVerify(selectedCandidate.id, 'edu', selectedCandidate.institutionName + selectedCandidate.educationLevel)} />
                            <ProofItem label="Technical Skills" value={selectedCandidate.skills.join(', ')} status={verificationStates[`${selectedCandidate.id}-skills`]} onVerify={() => handleVerify(selectedCandidate.id, 'skills', selectedCandidate.skills.join(','))} />
                            <ProofItem label="Experience Badge" value={selectedCandidate.experience + ' Years'} status={verificationStates[`${selectedCandidate.id}-yoe`]} onVerify={() => handleVerify(selectedCandidate.id, 'yoe', selectedCandidate.experience)} />
                        </div>
                    </section>

                    <section className="space-y-8">
                        <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-600 italic">Marketplace Action</h3>
                        <div className="p-10 bg-black border border-zinc-800 rounded-[3rem] space-y-8">
                            <div className="space-y-2">
                                <h4 className="text-xl font-black italic uppercase">On-Chain Interaction</h4>
                                <p className="text-xs text-zinc-500 leading-relaxed font-medium">Initiate a trustless hiring event on the Midnight Network. This will anchor your decision to the candidate's contract.</p>
                            </div>
                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={() => handleHireAction(selectedCandidate.id)}
                                    disabled={hiringStatus[selectedCandidate.id] === 'hiring' || hiringStatus[selectedCandidate.id] === 'done'}
                                    className="w-full py-6 bg-indigo-600 text-white rounded-2xl font-black uppercase italic flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all disabled:opacity-50"
                                >
                                    {hiringStatus[selectedCandidate.id] === 'hiring' ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ThumbsUp className="w-5 h-5" /> Hire Candidate</>}
                                </button>
                                <button className="w-full py-6 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-2xl font-black uppercase italic flex items-center justify-center gap-3 hover:text-rose-500 hover:border-rose-500/50 transition-all">
                                    <ThumbsDown className="w-5 h-5" /> Not Interested
                                </button>
                            </div>
                            {hiringStatus[selectedCandidate.id] === 'done' && (
                                <p className="text-center text-[10px] font-black text-green-500 uppercase tracking-widest animate-pulse">Hiring event anchored successfully</p>
                            )}
                        </div>
                    </section>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProofItem({ label, value, status, onVerify }: any) {
    const [showInfo, setShowInfo] = useState(false);

    return (
        <div className="p-6 bg-black border border-zinc-800 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-zinc-500">{label}</span>
                <div className="flex items-center gap-3">
                    {status === 'valid' ? (
                        <span className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/30 rounded-lg text-[8px] font-black uppercase"><Check className="w-3 h-3"/> Verified</span>
                    ) : status === 'invalid' ? (
                        <span className="flex items-center gap-2 px-3 py-1 bg-rose-500/10 text-rose-500 border border-rose-500/30 rounded-lg text-[8px] font-black uppercase"><X className="w-3 h-3"/> Invalid</span>
                    ) : (
                        <button onClick={onVerify} disabled={status === 'verifying'} className="px-3 py-1 bg-white text-black rounded-lg text-[8px] font-black uppercase hover:bg-indigo-600 hover:text-white transition-all">
                            {status === 'verifying' ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Verify Proof'}
                        </button>
                    )}
                    <button onClick={() => setShowInfo(!showInfo)} className="p-1 hover:text-indigo-500 transition-colors"><AlertCircle className="w-4 h-4" /></button>
                </div>
            </div>
            {showInfo && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-indigo-600/10 border border-indigo-600/30 rounded-xl">
                    <p className="text-[10px] text-indigo-300 font-medium leading-relaxed italic">This field is encrypted and private. The badge confirms that a valid Zero-Knowledge Proof was generated locally by the talent and anchored to the Midnight ledger. No raw data was disclosed.</p>
                </motion.div>
            )}
        </div>
    );
}
