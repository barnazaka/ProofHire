'use client';

import { useState, useEffect } from 'react';
import {
  ShieldCheck, User, GraduationCap, Briefcase,
  Code2, Award, Settings, LogOut,
  CheckCircle2, Globe, Lock, Copy,
  ExternalLink, Zap, LayoutDashboard, MessageSquare, Search
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';

export default function TalentDashboard() {
  const [talent, setTalent] = useState<any>(null);
  const [isOpenForWork, setIsOpenForWork] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get the latest talent data from simulation
    const marketplace = JSON.parse(localStorage.getItem('proofhire_marketplace_v2') || '[]');
    const address = localStorage.getItem('proofhire_wallet_address');

    // Find the entry that matches current wallet (or last one for demo)
    const myEntry = marketplace.find((t: any) => t.address === localStorage.getItem('proofhire_contract_address')) || marketplace[0];

    if (myEntry) {
        setTalent(myEntry);
    } else {
        // Redirect to onboarding if no profile found
        // router.push('/talent/onboarding');
    }
  }, []);

  const handleToggleWork = () => {
    setIsOpenForWork(!isOpenForWork);
    // Update simulation
    const marketplace = JSON.parse(localStorage.getItem('proofhire_marketplace_v2') || '[]');
    const addr = localStorage.getItem('proofhire_contract_address');
    const updated = marketplace.map((t: any) => t.address === addr ? { ...t, isLive: !isOpenForWork } : t);
    localStorage.setItem('proofhire_marketplace_v2', JSON.stringify(updated));
  };

  const SidebarItem = ({ icon: Icon, label, active = false }: any) => (
    <button className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black uppercase italic text-[10px] tracking-widest ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-zinc-500 hover:bg-zinc-900 hover:text-white'}`}>
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans flex">
      {/* Sidebar */}
      <aside className="w-80 border-r border-zinc-900 p-8 flex flex-col justify-between sticky top-0 h-screen">
        <div className="space-y-12">
           <div className="flex items-center gap-3 px-2">
             <ShieldCheck className="w-8 h-8 text-indigo-500" />
             <span className="text-2xl font-black italic uppercase tracking-tighter">Talent OS</span>
           </div>

           <nav className="space-y-2">
              <SidebarItem icon={LayoutDashboard} label="Overview" active />
              <SidebarItem icon={User} label="My Profile" />
              <SidebarItem icon={MessageSquare} label="Messages" />
              <SidebarItem icon={Settings} label="Settings" />
           </nav>
        </div>

        <div className="space-y-6">
           <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                 <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Node Status</span>
                 <div className={`w-2 h-2 rounded-full ${isOpenForWork ? 'bg-green-500 animate-pulse' : 'bg-zinc-700'}`}></div>
              </div>
              <div className="flex items-center justify-between">
                 <span className="text-[10px] font-bold italic uppercase">Open for Work</span>
                 <button
                   onClick={handleToggleWork}
                   className={`w-10 h-5 rounded-full transition-all relative ${isOpenForWork ? 'bg-indigo-600' : 'bg-zinc-800'}`}
                 >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isOpenForWork ? 'right-1' : 'left-1'}`}></div>
                 </button>
              </div>
           </div>

           <button
             onClick={() => {
                localStorage.clear();
                router.push('/');
             }}
             className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-zinc-500 hover:bg-red-500/10 hover:text-red-500 transition-all font-black uppercase italic text-[10px] tracking-widest"
           >
              <LogOut className="w-4 h-4" />
              Logout Node
           </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-12 overflow-y-auto">
         <header className="flex justify-between items-center mb-16">
            <div className="space-y-1">
               <h1 className="text-4xl font-black italic uppercase tracking-tighter">Welcome Back, <span className="text-indigo-600">{talent?.name || 'Sovereign'}</span></h1>
               <p className="text-zinc-500 text-sm font-medium italic">Your node is currently active on the Midnight Preview Testnet.</p>
            </div>
            <ThemeToggle />
         </header>

         <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 space-y-8">
               <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 space-y-10">
                  <div className="flex justify-between items-start">
                     <div className="space-y-4">
                        <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-3xl font-black italic">
                           {talent?.name?.charAt(0)}
                        </div>
                        <div>
                           <h2 className="text-4xl font-black italic uppercase tracking-tightest leading-none">{talent?.name}</h2>
                           <p className="text-indigo-500 font-bold uppercase italic text-sm mt-2">{talent?.headline || 'ZK-Certified Engineer'}</p>
                        </div>
                     </div>
                     <div className="flex gap-2">
                        <div className="px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full text-[8px] font-black uppercase text-green-500 italic flex items-center gap-1">
                           <CheckCircle2 className="w-3 h-3" /> Live on Ledger
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-10 border-t border-zinc-800">
                     <StatCard icon={GraduationCap} label="Academic Proof" status="Active" date="Mar 2024" />
                     <StatCard icon={Briefcase} label="Experience Proof" status="Active" date="Mar 2024" />
                     <StatCard icon={Code2} label="Technical Proof" status="Active" date="Mar 2024" />
                     <StatCard icon={Award} label="Certification Proof" status="Active" date="Mar 2024" />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-8">
                  <div className="p-8 bg-indigo-600 rounded-[2rem] text-white space-y-6 shadow-2xl shadow-indigo-600/20">
                     <div className="flex justify-between items-start">
                        <Zap className="w-8 h-8 fill-white" />
                        <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">New Proof</span>
                     </div>
                     <div className="space-y-1">
                        <h3 className="text-xl font-black uppercase italic tracking-tighter">Update Credentials</h3>
                        <p className="text-white/70 text-xs font-medium italic">Generate new ZKPs for your latest skills and roles.</p>
                     </div>
                     <button
                       onClick={() => router.push('/talent/onboarding')}
                       className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase italic text-[10px] tracking-widest hover:bg-black hover:text-white transition-all"
                     >
                        Enter Proving Room
                     </button>
                  </div>

                  <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2rem] space-y-6">
                     <div className="flex justify-between items-start text-indigo-500">
                        <Globe className="w-8 h-8" />
                        <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 text-indigo-500">Public Link</span>
                     </div>
                     <div className="space-y-1">
                        <h3 className="text-xl font-black uppercase italic tracking-tighter">Share Node</h3>
                        <p className="text-zinc-500 text-xs font-medium italic">Direct link for recruiters to verify your sovereign node.</p>
                     </div>
                     <button className="w-full py-4 bg-zinc-800 text-white rounded-2xl font-black uppercase italic text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-700 transition-all">
                        <Copy className="w-3 h-3" /> Copy Address
                     </button>
                  </div>
               </div>
            </div>

            <div className="space-y-8">
               <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2rem] space-y-8">
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-600 italic">Ledger Identity</h3>
                  <div className="space-y-6">
                     <div className="space-y-2">
                        <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Contract Address</p>
                        <div className="p-4 bg-black rounded-2xl border border-zinc-800 flex items-center justify-between overflow-hidden">
                           <code className="text-[10px] text-indigo-500 truncate mr-4">{talent?.address || 'Searching...'}</code>
                           <ExternalLink className="w-3 h-3 text-zinc-700 flex-shrink-0" />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Proof Service</p>
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 bg-indigo-600/10 rounded-lg flex items-center justify-center border border-indigo-600/20">
                              <Lock className="w-4 h-4 text-indigo-500" />
                           </div>
                           <span className="text-xs font-bold italic uppercase">WASM Prover v1.0</span>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2rem] space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-600 italic">Marketplace Activity</h3>
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                     <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-600">
                        <Search className="w-6 h-6" />
                     </div>
                     <p className="text-[10px] font-bold italic text-zinc-500 uppercase tracking-widest">No recent verifications</p>
                  </div>
               </div>
            </div>
         </div>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, status, date }: any) {
   return (
      <div className="p-6 bg-black rounded-3xl border border-zinc-800 flex items-center justify-between group hover:border-indigo-600/50 transition-all">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
               <Icon className="w-5 h-5" />
            </div>
            <div>
               <p className="text-xs font-black uppercase italic tracking-tighter">{label}</p>
               <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">{date}</p>
            </div>
         </div>
         <span className="text-[8px] font-black uppercase italic tracking-widest text-green-500 px-3 py-1 bg-green-500/5 rounded-full border border-green-500/10">{status}</span>
      </div>
   );
}
