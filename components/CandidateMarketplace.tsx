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
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CryptoJS from 'crypto-js';
import { verifyCVClaim } from '@/lib/midnight-utils';

interface TalentProfile {
  id: string;
  fullName: string;
  headline: string;
  location: string;
  primaryRole: string;
  educationLevel: string;
  fieldOfStudy: string;
  institutionName: string;
  graduationYear: string;
  experiences: any[];
  skills: any[];
  contractAddress: string;
  bio: string;
}

export default function CandidateMarketplace() {
  const [candidates, setCandidates] = useState<TalentProfile[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<TalentProfile | null>(null);
  const [verificationStates, setVerificationStates] = useState<Record<string, 'idle' | 'verifying' | 'valid' | 'invalid'>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate finding candidates on the network
    // In a real app, we would query the indexer for deployed CV contracts
    const globalProofs = JSON.parse(localStorage.getItem('proofhire_proofs') || '[]');
    const localData = localStorage.getItem('proofhire_talent_data');

    // For the hackathon demo, if we have local data, we show one candidate
    if (localData && globalProofs.length > 0) {
       // We can't actually decrypt the data here without the user's key,
       // but for the demo we assume the Recruiter can see the "Public Name"
       // from the ledger and the rest is hidden/verified.
       // Here we mock the public profile based on the anchored data.
       const latestProof = globalProofs[0];

       setCandidates([{
          id: latestProof.id,
          fullName: 'Satoshi Nakamoto', // This would be the 'publicName' from the ledger
          headline: 'Senior Blockchain Architect',
          location: 'Remote / Switzerland',
          primaryRole: 'ZK Researcher',
          educationLevel: 'PhD',
          fieldOfStudy: 'Computer Science',
          institutionName: 'University of Oxford',
          graduationYear: '2018',
          experiences: [{ id: '1', title: 'Lead Engineer', company: 'Global Tech', years: '5' }],
          skills: [{ id: 's1', name: 'Midnight SDK', level: 'Expert' }, { id: 's2', name: 'Rust', level: 'Expert' }],
          contractAddress: latestProof.contractAddress,
          bio: 'Architecting the future of privacy-preserving protocols on Midnight.'
       }]);
    }

    setIsLoading(false);
  }, []);

  const handleVerifyField = async (candidateId: string, field: string, value: string) => {
    const key = `${candidateId}-${field}`;
    setVerificationStates(prev => ({ ...prev, [key]: 'verifying' }));

    try {
       // Deterministic hash generation for verification (must match the one used during onboarding)
       // For the demo, we recreate the same hash structure the user did.
       // In production, the recruiter would receive a "Claim Ticket" or hash from the candidate.
       const claimString = JSON.stringify(value);
       const hashHex = CryptoJS.SHA256(claimString).toString();
       const claimHash = new Uint8Array(hashHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));

       const candidate = candidates.find(c => c.id === candidateId);
       if (!candidate) throw new Error('Candidate not found');

       // Call Midnight Smart Contract verifyHash circuit
       const isValid = await verifyCVClaim(candidate.contractAddress, claimHash);

       setVerificationStates(prev => ({ ...prev, [key]: isValid ? 'valid' : 'invalid' }));
    } catch (e) {
       console.error('Verification error:', e);
       setVerificationStates(prev => ({ ...prev, [key]: 'invalid' }));
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
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {candidates.length === 0 ? (
              <div className="col-span-full p-32 bg-zinc-900 border border-zinc-800 border-dashed rounded-[3.5rem] text-center space-y-6">
                 <div className="w-20 h-20 bg-zinc-800 rounded-3xl mx-auto flex items-center justify-center text-zinc-600">
                    <Search className="w-10 h-10" />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">No nodes found.</h3>
                    <p className="text-zinc-500 font-medium italic">Wait for candidates to anchor their CVs to the Midnight Network.</p>
                 </div>
              </div>
            ) : (
              candidates.map(candidate => (
                <button
                  key={candidate.id}
                  onClick={() => setSelectedCandidate(candidate)}
                  className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 text-left hover:border-indigo-600/50 hover:shadow-2xl hover:shadow-indigo-600/10 transition-all group"
                >
                   <div className="space-y-8">
                      <div className="flex items-start justify-between">
                         <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-600/20 group-hover:scale-110 transition-transform">
                            <span className="text-2xl font-black italic text-white">{candidate.fullName.charAt(0)}</span>
                         </div>
                         <div className="px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">Anchored</span>
                         </div>
                      </div>
                      <div className="space-y-1">
                         <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white leading-none">{candidate.fullName}</h3>
                         <p className="text-indigo-500 font-bold text-xs uppercase tracking-widest">{candidate.headline}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-800">
                         {candidate.skills.slice(0, 3).map(s => (
                            <span key={s.id} className="text-[9px] font-black bg-black border border-zinc-800 px-2 py-1 rounded-md uppercase text-zinc-400">{s.name}</span>
                         ))}
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-black text-indigo-500 uppercase tracking-widest italic group-hover:gap-5 transition-all">
                         View Sovereign CV <ChevronRight className="w-4 h-4" />
                      </div>
                   </div>
                </button>
              ))
            )}
          </motion.div>
        ) : (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-8"
          >
            <button
              onClick={() => setSelectedCandidate(null)}
              className="flex items-center gap-3 text-zinc-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
            >
               <ArrowLeft className="w-4 h-4" />
               Back to Marketplace
            </button>

            <div className="bg-zinc-900 border border-zinc-800 rounded-[3.5rem] overflow-hidden">
               {/* A4 Style Page Container */}
               <div className="max-w-4xl mx-auto bg-black my-12 border border-zinc-800 shadow-3xl p-16 space-y-16">
                  {/* Header */}
                  <div className="flex justify-between items-start border-b border-zinc-800 pb-12">
                     <div className="space-y-4">
                        <h1 className="text-6xl font-black italic uppercase tracking-tightest leading-none">{selectedCandidate.fullName}</h1>
                        <p className="text-2xl font-bold text-indigo-600 italic leading-none">{selectedCandidate.headline}</p>
                        <div className="flex items-center gap-6 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                           <span className="flex items-center gap-2"><MapPin className="w-3 h-3" /> {selectedCandidate.location}</span>
                           <span className="flex items-center gap-2"><Globe className="w-3 h-3" /> Remote Node</span>
                        </div>
                     </div>
                     <div className="flex flex-col items-end gap-3 text-right">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Contract Signature</span>
                        <code className="text-[10px] font-mono text-indigo-500 bg-indigo-500/5 px-3 py-1 rounded-lg border border-indigo-500/20">{selectedCandidate.contractAddress.slice(0, 16)}...</code>
                     </div>
                  </div>

                  {/* Summary Section with Verify Button */}
                  <section className="space-y-6">
                     <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-600 italic">Sovereign Statement</h3>
                        <VerifyButton candidate={selectedCandidate} field="bio" value={selectedCandidate.bio} status={verificationStates[`${selectedCandidate.id}-bio`]} onVerify={handleVerifyField} />
                     </div>
                     <p className="text-2xl font-medium text-zinc-300 leading-relaxed italic">"{selectedCandidate.bio}"</p>
                  </section>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
                     {/* Experience Column */}
                     <div className="md:col-span-8 space-y-12">
                        <section className="space-y-10">
                           <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-600 italic">Work History (ZK-Verified)</h3>
                           <div className="space-y-12">
                              {selectedCandidate.experiences.map(exp => (
                                 <div key={exp.id} className="space-y-4">
                                    <div className="flex items-start justify-between gap-6">
                                       <div className="space-y-1">
                                          <h4 className="text-2xl font-black italic uppercase leading-none">{exp.title}</h4>
                                          <p className="text-indigo-500 font-bold text-sm uppercase tracking-widest">{exp.company}</p>
                                       </div>
                                       <VerifyButton candidate={selectedCandidate} field={`exp-${exp.id}`} value={exp.company} status={verificationStates[`${selectedCandidate.id}-exp-${exp.id}`]} onVerify={handleVerifyField} />
                                    </div>
                                    <p className="text-zinc-500 text-sm font-medium leading-relaxed">Verified {exp.years} years of active service in this role on the Midnight ledger.</p>
                                 </div>
                              ))}
                           </div>
                        </section>

                        <section className="space-y-10">
                           <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-600 italic">Academic Foundation</h3>
                           <div className="flex items-center justify-between p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem]">
                              <div className="flex items-center gap-6">
                                 <div className="w-14 h-14 bg-black border border-zinc-800 rounded-2xl flex items-center justify-center">
                                    <GraduationCap className="w-7 h-7 text-indigo-500" />
                                 </div>
                                 <div className="space-y-1">
                                    <h4 className="text-xl font-black italic uppercase leading-none">{selectedCandidate.educationLevel}</h4>
                                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{selectedCandidate.fieldOfStudy} @ {selectedCandidate.institutionName}</p>
                                 </div>
                              </div>
                              <VerifyButton candidate={selectedCandidate} field="edu" value={selectedCandidate.educationLevel} status={verificationStates[`${selectedCandidate.id}-edu`]} onVerify={handleVerifyField} />
                           </div>
                        </section>
                     </div>

                     {/* Skills Column */}
                     <div className="md:col-span-4 space-y-12">
                        <section className="space-y-8">
                           <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-600 italic">Hard Skills</h3>
                           <div className="space-y-4">
                              {selectedCandidate.skills.map(skill => (
                                 <div key={skill.id} className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-2xl group hover:border-indigo-500/50 transition-all">
                                    <div className="space-y-1">
                                       <p className="text-xs font-black italic uppercase text-white leading-none">{skill.name}</p>
                                       <p className="text-[8px] font-black text-indigo-500 uppercase tracking-widest">{skill.level}</p>
                                    </div>
                                    <VerifyButton candidate={selectedCandidate} field={`skill-${skill.id}`} value={skill.name} status={verificationStates[`${selectedCandidate.id}-skill-${skill.id}`]} onVerify={handleVerifyField} size="sm" />
                                 </div>
                              ))}
                           </div>
                        </section>

                        <div className="p-8 bg-indigo-600 rounded-[2.5rem] space-y-4 shadow-2xl shadow-indigo-600/30">
                           <Shield className="w-8 h-8 text-white" />
                           <p className="text-[10px] font-black text-indigo-100 uppercase tracking-[0.2em] italic">Protocol Guarantee</p>
                           <p className="text-xs font-medium text-white/80 leading-relaxed">
                              Verification calls trigger a Zero-Knowledge circuit execution on the Midnight Network. "Valid" results are mathematically certain.
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function VerifyButton({ candidate, field, value, status, onVerify, size = 'md' }: any) {
   if (status === 'valid') {
      return (
         <div className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest italic animate-in zoom-in duration-300">
            <Check className="w-3 h-3" /> Valid
         </div>
      );
   }

   if (status === 'invalid') {
      return (
         <div className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest italic animate-in zoom-in duration-300">
            <X className="w-3 h-3" /> Invalid
         </div>
      );
   }

   return (
      <button
        disabled={status === 'verifying'}
        onClick={() => onVerify(candidate.id, field, value)}
        className={`flex items-center gap-2 ${size === 'sm' ? 'px-3 py-1.5' : 'px-5 py-2.5'} bg-white text-black border border-white hover:bg-indigo-600 hover:text-white hover:border-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest italic transition-all disabled:opacity-50`}
      >
         {status === 'verifying' ? (
            <><Loader2 className="w-3 h-3 animate-spin" /> Verifying</>
         ) : (
            <><ShieldCheck className="w-3 h-3" /> Verify Claim</>
         )}
      </button>
   );
}
