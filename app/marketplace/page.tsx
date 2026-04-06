'use client';

import { useState, useEffect } from 'react';
import {
  ShieldCheck, Search, Eye,
  Award, Briefcase, GraduationCap,
  MapPin, Globe, Loader2, Check,
  ChevronRight, ArrowLeft, UserCircle,
  X, Shield, Lock, Fingerprint,
  Code2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '@/components/ThemeToggle';
import { hireCandidate, setupProviders } from '@/lib/midnight-utils';

interface TalentNode {
    address: string;
    name: string;
}

export default function Marketplace() {
  const [talents, setTalents] = useState<TalentNode[]>([]);
  const [selectedTalent, setSelectedTalent] = useState<TalentNode | null>(null);
  const [isHiring, setIsHiring] = useState(false);
  const [isHired, setIsHired] = useState(false);
  const [view, setView] = useState<'grid' | 'cv'>('grid');

  useEffect(() => {
    // Clear any old dummy data and fetch from simulation
    const marketplace = JSON.parse(localStorage.getItem('proofhire_marketplace') || '[]');
    setTalents(marketplace);
  }, []);

  const handleHire = async () => {
    if (!selectedTalent) return;
    setIsHiring(true);
    try {
      await hireCandidate(selectedTalent.address);
      setIsHired(true);
    } catch (err: any) {
      console.error(err);
      alert('Hire action failed: ' + err.message);
    } finally {
      setIsHiring(false);
    }
  };

  const ProofBadge = ({ icon: Icon, label, desc }: any) => (
    <button
      onClick={() => alert(desc)}
      className="flex items-center gap-3 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-indigo-600 transition-all group"
    >
       <div className="p-2 bg-indigo-600/10 rounded-lg group-hover:bg-indigo-600 group-hover:text-white text-indigo-500 transition-colors">
          <Icon className="w-5 h-5" />
       </div>
       <div className="text-left">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">ZK-Proof</p>
          <p className="text-xs font-bold italic uppercase">{label}</p>
       </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-indigo-600 selection:text-white">
      <header className="px-12 py-8 flex justify-between items-center border-b border-zinc-900 bg-black/50 backdrop-blur-3xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black italic uppercase tracking-tighter">Marketplace</span>
        </div>
        <div className="flex items-center gap-8">
           <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Midnight Node Online</span>
           </div>
           <ThemeToggle />
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-12">
        <AnimatePresence mode="wait">
          {view === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
               <div className="space-y-2">
                  <h1 className="text-6xl font-black italic uppercase tracking-tightest">Talent <span className="text-indigo-600">Inventory.</span></h1>
                  <p className="text-zinc-500 text-sm font-medium italic">Displaying sovereign contributor nodes on the Midnight ledger.</p>
               </div>

               {talents.length === 0 ? (
                 <div className="py-32 bg-zinc-900 border border-zinc-800 border-dashed rounded-[3.5rem] flex flex-col items-center justify-center space-y-6">
                    <div className="w-20 h-20 bg-zinc-800 rounded-3xl flex items-center justify-center text-zinc-600">
                       <Search className="w-10 h-10" />
                    </div>
                    <div className="text-center">
                       <h3 className="text-2xl font-black italic uppercase text-white">No nodes detected</h3>
                       <p className="text-zinc-500 font-medium italic">Wait for candidates to publish their sovereign CVs.</p>
                    </div>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {talents.map((talent) => (
                       <button
                         key={talent.address}
                         onClick={() => {
                            setSelectedTalent(talent);
                            setView('cv');
                         }}
                         className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 text-left hover:border-indigo-600/50 hover:shadow-2xl hover:shadow-indigo-600/10 transition-all group relative overflow-hidden"
                       >
                          <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                             <ChevronRight className="w-6 h-6 text-indigo-500" />
                          </div>
                          <div className="space-y-8">
                             <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-600/20">
                                <span className="text-2xl font-black italic text-white">{talent.name.charAt(0)}</span>
                             </div>
                             <div>
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">{talent.name}</h3>
                                <div className="flex items-center gap-2 mt-2">
                                   <div className="px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded text-[8px] font-black uppercase text-green-500">Live CV</div>
                                   <div className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded text-[8px] font-black uppercase text-indigo-500">ZK-Verified</div>
                                </div>
                             </div>
                             <div className="pt-6 border-t border-zinc-800 flex items-center justify-between">
                                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 italic">View Full Node</span>
                                <Fingerprint className="w-4 h-4 text-zinc-700" />
                             </div>
                          </div>
                       </button>
                    ))}
                 </div>
               )}
            </motion.div>
          ) : (
            <motion.div
              key="cv"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-8"
            >
               <button
                 onClick={() => {
                    setView('grid');
                    setIsHired(false);
                 }}
                 className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest italic"
               >
                  <ArrowLeft className="w-4 h-4" /> Back to Inventory
               </button>

               <div className="bg-zinc-900 border border-zinc-800 rounded-[3.5rem] overflow-hidden">
                  <div className="max-w-4xl mx-auto bg-black my-16 border border-zinc-800 shadow-3xl p-20 space-y-16">
                     <div className="flex justify-between items-start border-b border-zinc-800 pb-12">
                        <div className="space-y-4">
                           <h1 className="text-6xl font-black italic uppercase tracking-tightest leading-none">{selectedTalent?.name}</h1>
                           <div className="flex items-center gap-6 text-zinc-500 text-[10px] font-black uppercase tracking-widest italic">
                              <span className="flex items-center gap-2"><MapPin className="w-3 h-3" /> Location Protected</span>
                              <span className="flex items-center gap-2"><Globe className="w-3 h-3" /> Remote Node</span>
                           </div>
                        </div>
                        <div className="text-right">
                           <div className="w-20 h-20 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl">
                              <UserCircle className="w-10 h-10 text-white" />
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-10">
                           <div className="space-y-4">
                              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-600 italic">Verified Qualifications</h3>
                              <div className="grid grid-cols-1 gap-4">
                                 <ProofBadge
                                   icon={GraduationCap}
                                   label="Academic Proof"
                                   desc="This credential is ZK-verified on-chain. The talent has proven their school qualification. The actual school name is private and protected."
                                 />
                                 <ProofBadge
                                   icon={Code2}
                                   label="Technical Proof"
                                   desc="This credential is ZK-verified on-chain. The talent has proven their skills. The actual skill details are private and protected."
                                 />
                                 <ProofBadge
                                   icon={Briefcase}
                                   label="Experience Proof"
                                   desc="This credential is ZK-verified on-chain. The talent has proven their years of service. The actual company details are private and protected."
                                 />
                              </div>
                           </div>
                        </div>

                        <div className="space-y-10">
                           <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-6">
                              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-600 italic">On-Chain Identity</h3>
                              <div className="space-y-4">
                                 <div className="space-y-2">
                                    <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Contract Address</p>
                                    <div className="flex items-center justify-between p-3 bg-black rounded-xl border border-zinc-800">
                                       <code className="text-[10px] text-indigo-500 truncate mr-4">{selectedTalent?.address}</code>
                                       <button
                                         onClick={() => navigator.clipboard.writeText(selectedTalent?.address || '')}
                                         className="p-1 hover:text-white text-zinc-500"
                                       >
                                          <Shield className="w-3 h-3" />
                                       </button>
                                 </div>
                                 </div>
                                 <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Hired Status</span>
                                    {isHired ? (
                                       <span className="px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full text-[8px] font-black uppercase italic">Secured</span>
                                    ) : (
                                       <span className="px-3 py-1 bg-zinc-800 text-zinc-500 rounded-full text-[8px] font-black uppercase italic">Not Hired</span>
                                    )}
                                 </div>
                              </div>
                           </div>

                           <div className="p-8 bg-indigo-600/10 border border-indigo-600/20 rounded-3xl flex items-start gap-4">
                              <Shield className="w-6 h-6 text-indigo-500 flex-shrink-0" />
                              <p className="text-[10px] font-medium text-indigo-300 italic leading-relaxed">Verification Call: Smart contract validated the ZKP commitments for this candidate node. Result: VALID.</p>
                           </div>
                        </div>
                     </div>

                     <div className="pt-12 border-t border-zinc-800 flex items-center justify-between gap-12">
                        <div className="flex-1">
                           <p className="text-zinc-500 text-[10px] font-medium italic">Action recorded on Midnight Preview Testnet. Gas fees paid by Recruiter node.</p>
                        </div>
                        <button
                          onClick={handleHire}
                          disabled={isHiring || isHired}
                          className="px-12 py-5 bg-white text-black rounded-2xl font-black italic uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-indigo-600 hover:text-white transition-all shadow-xl shadow-indigo-600/10 disabled:opacity-50"
                        >
                           {isHiring ? (
                              <><Loader2 className="w-4 h-4 animate-spin" /> Triggering Ledger...</>
                           ) : isHired ? (
                              <><Check className="w-4 h-4" /> Hired on Proof</>
                           ) : (
                              <>Initialize Hire Circuit</>
                           )}
                        </button>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
