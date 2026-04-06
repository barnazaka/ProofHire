'use client';

import { useState, useEffect } from 'react';
import {
  User, Mail, MapPin, Briefcase,
  GraduationCap, Award, Code2,
  ChevronRight, ExternalLink, ShieldCheck,
  Fingerprint, Sparkles, Edit3, Globe,
  CheckCircle2, Clock, Calendar, Lock,
  FileText, History, Search, Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { decryptData } from '@/lib/encryption-utils';
import Link from 'next/link';

interface Proof {
  id: string;
  txId: string;
  type: string;
  timestamp: string;
  contractAddress: string;
  claimHash: string;
}

export default function CVDashboard() {
  const [cvData, setCVData] = useState<any>(null);
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenForWork, setIsOpenForWork] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'history'>('profile');

  useEffect(() => {
    const localData = localStorage.getItem('proofhire_talent_data');
    const localProofs = localStorage.getItem('proofhire_proofs');

    if (localData) {
      const decrypted = decryptData(localData);
      setCVData(decrypted);
    }

    if (localProofs) {
      setProofs(JSON.parse(localProofs));
    }

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!cvData) return null;

  return (
    <div className="h-full flex flex-col gap-8 animate-in fade-in duration-700">
      {/* Top Profile Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>

         <div className="flex flex-col md:flex-row gap-10 items-start relative z-10">
            <div className="w-32 h-32 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-indigo-600/20 border-4 border-white/10 group-hover:scale-105 transition-transform duration-500">
               <span className="text-5xl font-black italic text-white">{cvData.fullName?.charAt(0)}</span>
            </div>

            <div className="flex-1 space-y-6">
               <div className="space-y-1">
                  <div className="flex items-center gap-3">
                     <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">{cvData.fullName}</h1>
                     <div className="px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Verified on Midnight</span>
                     </div>
                  </div>
                  <p className="text-xl font-bold text-indigo-500 italic">{cvData.headline}</p>
               </div>

               <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2 text-zinc-400 text-xs font-black uppercase tracking-widest">
                     <MapPin className="w-4 h-4 text-indigo-500" />
                     {cvData.location}
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400 text-xs font-black uppercase tracking-widest">
                     <Mail className="w-4 h-4 text-indigo-500" />
                     {cvData.email}
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400 text-xs font-black uppercase tracking-widest">
                     <Briefcase className="w-4 h-4 text-indigo-500" />
                     {cvData.primaryRole}
                  </div>
               </div>
            </div>

            <Link
              href="/talent/onboarding?edit=true"
              className="px-6 py-4 bg-white/5 border border-white/10 hover:bg-white hover:text-black rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest transition-all"
            >
               <Edit3 className="w-4 h-4" />
               Edit CV
            </Link>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4">
         <button
           onClick={() => setActiveTab('profile')}
           className={`px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === 'profile' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'}`}
         >
            <User className="w-4 h-4" />
            Sovereign CV
         </button>
         <button
           onClick={() => setActiveTab('history')}
           className={`px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'}`}
         >
            <History className="w-4 h-4" />
            Proof History
         </button>
      </div>

      <AnimatePresence mode="wait">
         {activeTab === 'profile' ? (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-8"
            >
               {/* Left Column - A4 Style CV */}
               <div className="md:col-span-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-12 space-y-12">
                  {/* Bio */}
                  <section className="space-y-4">
                     <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-3">
                        <span className="w-8 h-px bg-zinc-800"></span>
                        Executive Summary
                     </h3>
                     <p className="text-lg font-medium text-zinc-300 leading-relaxed italic">
                        "{cvData.bio}"
                     </p>
                  </section>

                  {/* Experience */}
                  <section className="space-y-8">
                     <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-3">
                        <span className="w-8 h-px bg-zinc-800"></span>
                        Verified Experience
                     </h3>
                     <div className="space-y-8">
                        {cvData.experiences?.map((exp: any, i: number) => (
                           <div key={exp.id} className="relative pl-10 group/exp">
                              <div className="absolute left-0 top-1.5 w-3 h-3 bg-indigo-600 rounded-full border-4 border-black group-hover:scale-150 transition-transform"></div>
                              <div className="space-y-2">
                                 <div className="flex items-center justify-between">
                                    <h4 className="text-xl font-black italic uppercase text-white leading-none">{exp.title}</h4>
                                    <span className="text-[10px] font-black bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 px-3 py-1 rounded-full uppercase italic">{exp.years} Years Verified</span>
                                 </div>
                                 <p className="text-indigo-500 font-bold text-sm uppercase tracking-wider">{exp.company}</p>
                                 <p className="text-zinc-500 text-sm font-medium">{exp.responsibilities}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </section>

                  {/* Education */}
                  <section className="space-y-6">
                     <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-3">
                        <span className="w-8 h-px bg-zinc-800"></span>
                        Academic Background
                     </h3>
                     <div className="p-8 bg-black/50 border border-zinc-800 rounded-[2rem] flex items-center gap-6">
                        <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center">
                           <GraduationCap className="w-8 h-8 text-indigo-500" />
                        </div>
                        <div>
                           <h4 className="text-lg font-black italic uppercase text-white">{cvData.educationLevel} in {cvData.fieldOfStudy}</h4>
                           <p className="text-zinc-500 font-medium text-sm italic">{cvData.institutionName}, Class of {cvData.graduationYear}</p>
                        </div>
                     </div>
                  </section>
               </div>

               {/* Right Column - Status & Skills */}
               <div className="md:col-span-4 space-y-8">
                  {/* Status Card */}
                  <div className="bg-indigo-600 rounded-[2.5rem] p-8 space-y-6 shadow-2xl shadow-indigo-600/30">
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100/60 italic">Market Status</span>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                     </div>
                     <div className="flex items-center justify-between">
                        <h4 className="text-2xl font-black italic uppercase text-white">Open for Work</h4>
                        <button
                          onClick={() => setIsOpenForWork(!isOpenForWork)}
                          className={`w-14 h-8 rounded-full p-1 transition-all flex items-center ${isOpenForWork ? 'bg-white justify-end' : 'bg-black/20 justify-start'}`}
                        >
                           <div className={`w-6 h-6 rounded-full shadow-lg ${isOpenForWork ? 'bg-indigo-600' : 'bg-white/50'}`}></div>
                        </button>
                     </div>
                     <p className="text-[10px] font-bold text-indigo-100/60 leading-tight">
                        When enabled, recruiters can discover your sovereign profile in the marketplace.
                     </p>
                  </div>

                  {/* Skills Card */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 space-y-6">
                     <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 italic">Technical Skillset</h3>
                     <div className="flex flex-wrap gap-2">
                        {cvData.skills?.map((skill: any) => (
                           <div key={skill.id} className="px-4 py-2 bg-black border border-zinc-800 rounded-xl flex items-center gap-3 group">
                              <span className="text-[10px] font-black italic uppercase tracking-tighter text-white">{skill.name}</span>
                              <div className="w-1 h-1 bg-indigo-500 rounded-full"></div>
                              <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{skill.level}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Trust Metrics */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden">
                     <div className="absolute bottom-0 right-0 p-4 opacity-10">
                        <ShieldCheck className="w-24 h-24 text-indigo-500" />
                     </div>
                     <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 italic">ZK-Trust Metrics</h3>
                     <div className="space-y-4 relative z-10">
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Data Integrity</span>
                           <span className="text-xs font-black italic text-green-500 uppercase">100% Secure</span>
                        </div>
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Proofs Anchored</span>
                           <span className="text-xs font-black italic text-white uppercase">{proofs.length} Active</span>
                        </div>
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Network Score</span>
                           <span className="text-xs font-black italic text-indigo-500 uppercase">A+ High Trust</span>
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>
         ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
               {proofs.length === 0 ? (
                  <div className="p-20 bg-zinc-900 border border-zinc-800 border-dashed rounded-[3rem] text-center space-y-4">
                     <div className="w-16 h-16 bg-zinc-800 rounded-2xl mx-auto flex items-center justify-center text-zinc-600">
                        <History className="w-8 h-8" />
                     </div>
                     <p className="text-zinc-500 font-medium italic">No on-chain activity found yet.</p>
                  </div>
               ) : (
                  <div className="grid grid-cols-1 gap-4">
                     {proofs.map((proof) => (
                        <div key={proof.id} className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-indigo-600/50 transition-all">
                           <div className="flex items-center gap-6">
                              <div className="w-14 h-14 bg-indigo-600/10 border border-indigo-600/20 rounded-2xl flex items-center justify-center">
                                 <Fingerprint className="w-6 h-6 text-indigo-500" />
                              </div>
                              <div className="space-y-1">
                                 <div className="flex items-center gap-3">
                                    <h4 className="text-lg font-black italic uppercase text-white tracking-tighter">{proof.type}</h4>
                                    <span className="text-[9px] font-black bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-0.5 rounded-full uppercase italic">Confirmed</span>
                                 </div>
                                 <p className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                    <Clock className="w-3 h-3 text-indigo-500" />
                                    {proof.timestamp}
                                 </p>
                              </div>
                           </div>

                           <div className="flex flex-col gap-2 flex-1 max-w-md">
                              <div className="flex items-center justify-between px-4 py-2 bg-black border border-zinc-800 rounded-xl text-[10px] font-mono">
                                 <span className="text-zinc-600 uppercase">TX_ID:</span>
                                 <span className="text-indigo-500 truncate ml-4">{proof.txId}</span>
                              </div>
                              <div className="flex items-center justify-between px-4 py-2 bg-black border border-zinc-800 rounded-xl text-[10px] font-mono">
                                 <span className="text-zinc-600 uppercase">CONTRACT:</span>
                                 <span className="text-indigo-500 truncate ml-4">{proof.contractAddress}</span>
                              </div>
                           </div>

                           <button
                             onClick={() => {
                                navigator.clipboard.writeText(proof.contractAddress);
                             }}
                             className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white hover:text-black transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-widest"
                           >
                              <Hash className="w-4 h-4" />
                              Copy Address
                           </button>
                        </div>
                     ))}
                  </div>
               )}
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}
