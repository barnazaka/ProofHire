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

export default function CVDashboard() {
  const [cvData, setCVData] = useState<any>(null);
  const [contractAddress, setContractAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenForWork, setIsOpenForWork] = useState(true);

  useEffect(() => {
    const localData = localStorage.getItem('proofhire_talent_data');
    const savedAddr = localStorage.getItem('proofhire_current_contract');

    if (localData) {
      const decrypted = decryptData(localData);
      setCVData(decrypted);
    }
    if (savedAddr) setContractAddress(savedAddr);

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!cvData && !contractAddress) return (
      <div className="p-20 text-center space-y-6 bg-zinc-900 border border-zinc-800 rounded-[3rem]">
          <h2 className="text-2xl font-black italic uppercase">No Sovereign CV Found</h2>
          <p className="text-zinc-500">Anchor your qualifications to the Midnight Network to get started.</p>
          <Link href="/talent/onboarding" className="inline-block px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase italic">Start Onboarding</Link>
      </div>
  );

  return (
    <div className="h-full flex flex-col gap-8 animate-in fade-in duration-700">
      {/* Top Profile Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>

         <div className="flex flex-col md:flex-row gap-10 items-start relative z-10">
            <div className="w-32 h-32 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl text-5xl font-black italic text-white">
               {cvData?.fullName?.charAt(0) || 'S'}
            </div>

            <div className="flex-1 space-y-6">
               <div className="space-y-1">
                  <div className="flex items-center gap-3">
                     <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">{cvData?.fullName || 'Sovereign Candidate'}</h1>
                     <div className="px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Anchored to Midnight</span>
                     </div>
                  </div>
                  <p className="text-xl font-bold text-indigo-500 italic">{cvData?.headline || 'ZK-Verified Professional'}</p>
               </div>

               <div className="flex flex-wrap gap-6">
                  {cvData?.location && <div className="flex items-center gap-2 text-zinc-400 text-xs font-black uppercase tracking-widest"><MapPin className="w-4 h-4 text-indigo-500" /> {cvData.location}</div>}
                  {contractAddress && (
                      <div className="flex items-center gap-3 px-4 py-2 bg-black border border-zinc-800 rounded-xl">
                          <code className="text-[10px] font-mono text-indigo-500">{contractAddress.slice(0, 20)}...</code>
                          <button onClick={() => {navigator.clipboard.writeText(contractAddress); alert('Address Copied');}} className="p-1 hover:text-white transition-colors"><Hash className="w-3 h-3 text-zinc-600" /></button>
                      </div>
                  )}
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-12 space-y-12">
              <section className="space-y-8">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 italic">Sovereign Data References</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {['Email', 'School', 'Skills', 'Work Experience', 'YoE Badge'].map(ref => (
                          <div key={ref} className="p-6 bg-black border border-zinc-800 rounded-2xl flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase text-zinc-400">{ref}</span>
                              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/30 rounded-lg text-[8px] font-black uppercase">ZK_ANCHORED</div>
                          </div>
                      ))}
                  </div>
              </section>

              <div className="p-10 bg-indigo-600/5 border border-indigo-500/20 rounded-[2.5rem] space-y-4">
                  <ShieldCheck className="w-10 h-10 text-indigo-500" />
                  <h4 className="text-xl font-black italic uppercase">Privacy Protocol Active</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed font-medium italic">Your qualifications are cryptographically proven. Recruiters can verify the mathematical truth of your claims without gaining access to your raw personal data. You maintain 100% sovereignty over your identity.</p>
              </div>
          </div>

          <div className="md:col-span-4 space-y-8">
              <div className="bg-indigo-600 rounded-[2.5rem] p-8 space-y-6 shadow-2xl shadow-indigo-600/30">
                  <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100/60 italic">Market Status</span>
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex items-center justify-between">
                      <h4 className="text-2xl font-black italic uppercase text-white">Open for Work</h4>
                      <button onClick={() => setIsOpenForWork(!isOpenForWork)} className={`w-14 h-8 rounded-full p-1 transition-all flex items-center ${isOpenForWork ? 'bg-white justify-end' : 'bg-black/20 justify-start'}`}>
                          <div className={`w-6 h-6 rounded-full shadow-lg ${isOpenForWork ? 'bg-indigo-600' : 'bg-white/50'}`}></div>
                      </button>
                  </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 italic">Technical Skillset</h3>
                  <div className="flex flex-wrap gap-2">
                      {cvData?.skills?.map((skill: string, i: number) => (
                           <span key={i} className="px-4 py-2 bg-black border border-zinc-800 rounded-xl text-[10px] font-black italic uppercase text-white">{skill}</span>
                      )) || <p className="text-zinc-600 italic text-xs">No skills anchored yet...</p>}
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}
