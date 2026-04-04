'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, ShieldCheck, Briefcase, Zap,
  Search, CheckCircle2, User, Award,
  Loader2, LogOut, Copy, Check,
  LayoutDashboard, FileText, Fingerprint,
  Shield, Filter, X, ChevronDown, Sparkles
} from 'lucide-react';
import { shortenAddress } from '@/components/WalletIntegration';
import ThemeToggle from '@/components/ThemeToggle';

interface CandidateProof {
  id: string;
  candidateId: string;
  type: string;
  timestamp: string;
  hash: string;
  status: string;
  isBadge?: boolean;
  education?: string;
  experience?: number;
  skills?: string[];
}

export default function RecruiterCandidates() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [proofs, setProofs] = useState<CandidateProof[]>([]);
  const [filteredProofs, setFilteredProofs] = useState<CandidateProof[]>([]);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [verified, setVerified] = useState<Record<string, boolean>>({});

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [minExperience, setMinExperience] = useState<number | ''>('');
  const [educationFilter, setEducationFilter] = useState<string>('All');
  const [skillTag, setSkillTag] = useState<string>('');
  const [showFilters, setShowFilters] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const savedAddress = localStorage.getItem('user_address');
    const savedRole = localStorage.getItem('user_role');

    if (savedAddress && savedRole === 'recruiter') {
      setWalletAddress(savedAddress);
      setWalletConnected(true);

      // Load proofs from "global" state
      const globalProofs = JSON.parse(localStorage.getItem('proofhire_proofs_global') || '[]');
      setProofs(globalProofs);
      setFilteredProofs(globalProofs);
    } else {
      router.push('/recruiter/auth');
    }
  }, [router]);

  useEffect(() => {
    let result = proofs;

    if (searchQuery) {
      result = result.filter(p =>
        p.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.candidateId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (minExperience !== '') {
      result = result.filter(p => (p.experience || 0) >= minExperience);
    }

    if (educationFilter !== 'All') {
      result = result.filter(p => p.education === educationFilter);
    }

    if (skillTag) {
      result = result.filter(p =>
        p.skills?.some(s => s.toLowerCase().includes(skillTag.toLowerCase()))
      );
    }

    setFilteredProofs(result);
  }, [searchQuery, minExperience, educationFilter, skillTag, proofs]);

  const handleLogout = () => {
    localStorage.removeItem('user_address');
    localStorage.removeItem('user_role');
    setWalletAddress(null);
    setWalletConnected(false);
    setShowDropdown(false);
    router.push('/');
  };

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const verifyProof = async (id: string) => {
    setVerifying(id);
    try {
      const proof = proofs.find(p => p.id === id);
      if (!proof) throw new Error('Proof not found');

      const { verifyCandidateClaim } = await import('@/lib/contract-utils');

      // The 'hash' in our proof object is the contract address
      const contractAddress = proof.hash;

      // Retrieve wallet commitment from proof (stored as array)
      const walletCommitment = new Uint8Array((proof as any).walletCommitment || []);

      // The 'proofHash' in our proof object is the Uint8Array commitment
      const pHash = new Uint8Array((proof as any).proofHash || []);

      const result = await verifyCandidateClaim(
        contractAddress,
        pHash
      );

      setVerified(prev => ({ ...prev, [id]: !!result }));
    } catch (err: any) {
      console.error('Verification failed:', err);
      alert(`Verification failed: ${err.message}`);
    } finally {
      setVerifying(null);
    }
  };

  if (!walletConnected) {
    return (
      <div className="flex min-h-screen bg-black items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black font-sans text-white">
      <header className="px-10 py-6 flex justify-between items-center border-b border-zinc-800 bg-black/50 backdrop-blur-2xl sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20">
                <ShieldCheck className="w-6 h-6 text-white" />
             </div>
             <span className="text-2xl font-black tracking-tighter uppercase italic">ZK Browser</span>
          </div>

          <nav className="hidden md:flex items-center gap-4">
            <Link href="/recruiter/dashboard" className="flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link href="/recruiter/requirements" className="flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
              <FileText className="w-4 h-4" />
              Job Requirements
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-4 px-5 py-2.5 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-sm transition-all hover:border-indigo-500"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-black font-mono tracking-tight">
                {shortenAddress(walletAddress || '')}
              </span>
              <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-[10px] font-black italic shadow-inner">
                {walletAddress?.slice(-2).toUpperCase()}
              </div>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-3 w-64 bg-zinc-900 border border-zinc-800 rounded-[2rem] shadow-2xl p-4 space-y-2 z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-zinc-800 mb-2">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Authenticated via</p>
                  <p className="text-sm font-black italic">Lace Wallet v1.2</p>
                </div>

                <button
                  onClick={copyAddress}
                  className="w-full flex items-center justify-between p-4 hover:bg-zinc-800 rounded-2xl transition-colors text-xs font-black uppercase tracking-widest"
                >
                  <span className="flex items-center gap-3">
                    <Copy className="w-4 h-4 text-zinc-400" />
                    {copied ? 'Copied!' : 'Copy Address'}
                  </span>
                  {copied && <Check className="w-4 h-4 text-green-500" />}
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-4 hover:bg-rose-900/20 text-rose-600 rounded-2xl transition-colors text-xs font-black uppercase tracking-widest"
                >
                  <LogOut className="w-4 h-4" />
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-8 lg:p-12">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div className="space-y-2">
              <h2 className="text-5xl font-black italic uppercase tracking-tightest">Public Ledger <span className="text-indigo-600">Sync.</span></h2>
              <p className="text-zinc-500 text-sm font-medium italic">Mathematicly verify candidate claims without exposing private identity data.</p>
           </div>

           <button
             onClick={() => setShowFilters(!showFilters)}
             className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black uppercase italic tracking-widest text-xs transition-all ${showFilters ? 'bg-indigo-600 text-white' : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700'}`}
           >
              <Filter className="w-4 h-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
           </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           {/* Filters Sidebar */}
           {showFilters && (
             <aside className="lg:col-span-3 space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="space-y-6 bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2.5rem]">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Search Claims</label>
                      <div className="relative">
                         <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                         <input
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           className="w-full bg-black border border-zinc-800 rounded-xl p-3 pl-10 text-xs font-bold focus:ring-1 focus:ring-indigo-600 outline-none"
                           placeholder="Backend, ZK..."
                         />
                      </div>
                   </div>

                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Min. Experience (YoE)</label>
                      <input
                        type="number"
                        value={minExperience}
                        onChange={(e) => setMinExperience(e.target.value === '' ? '' : parseInt(e.target.value))}
                        className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-xs font-bold focus:ring-1 focus:ring-indigo-600 outline-none"
                        placeholder="e.g. 5"
                      />
                   </div>

                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Education Level</label>
                      <select
                        value={educationFilter}
                        onChange={(e) => setEducationFilter(e.target.value)}
                        className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-xs font-bold focus:ring-1 focus:ring-indigo-600 outline-none appearance-none"
                      >
                         <option>All</option>
                         <option>Bachelor\'s</option>
                         <option>Master\'s</option>
                         <option>PhD</option>
                         <option>Bootcamp</option>
                      </select>
                   </div>

                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Skill Tag</label>
                      <div className="relative">
                         <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                         <input
                           value={skillTag}
                           onChange={(e) => setSkillTag(e.target.value)}
                           className="w-full bg-black border border-zinc-800 rounded-xl p-3 pl-10 text-xs font-bold focus:ring-1 focus:ring-indigo-600 outline-none"
                           placeholder="Rust, React..."
                         />
                      </div>
                   </div>

                   <button
                     onClick={() => {
                        setSearchQuery('');
                        setMinExperience('');
                        setEducationFilter('All');
                        setSkillTag('');
                     }}
                     className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-rose-500 transition-colors"
                   >
                      Clear All Filters
                   </button>
                </div>

                <div className="p-8 bg-indigo-600/10 border border-indigo-600/20 rounded-[2.5rem] space-y-4">
                   <div className="flex items-center gap-3 text-indigo-500">
                      <Sparkles className="w-5 h-5" />
                      <span className="text-xs font-black uppercase tracking-widest italic">Smart Match</span>
                   </div>
                   <p className="text-[11px] font-medium text-indigo-300/70 leading-relaxed">
                      Anonymous matching uses ZK-Circuit logic to rank candidates based on your requirement commitments.
                   </p>
                </div>
             </aside>
           )}

           {/* Results Area */}
           <div className={`${showFilters ? 'lg:col-span-9' : 'lg:col-span-12'} space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700`}>
             <div className="flex items-center justify-between mb-4 px-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                   Showing {filteredProofs.length} Verification Commitments
                </span>
             </div>

             {filteredProofs.length === 0 ? (
               <div className="text-center py-32 bg-zinc-900/30 border-2 border-dashed border-zinc-800 rounded-[3rem] flex flex-col items-center gap-6">
                  <div className="w-20 h-20 bg-zinc-800 rounded-3xl flex items-center justify-center border border-zinc-700 text-zinc-600">
                     <Fingerprint className="w-10 h-10" />
                  </div>
                  <div className="space-y-1">
                     <h3 className="text-xl font-black italic uppercase">No Claims Match Filters</h3>
                     <p className="text-zinc-500 text-sm max-w-[300px] mx-auto">Adjust your requirements to find candidates on the Midnight network.</p>
                  </div>
               </div>
             ) : (
               filteredProofs.map(proof => (
                 <div key={proof.id} className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8 transition-all hover:border-indigo-500/50 shadow-2xl relative overflow-hidden group">
                    <div className="flex items-center gap-6 relative z-10">
                       <div className="w-20 h-20 bg-zinc-800 rounded-3xl flex items-center justify-center border border-zinc-700 shadow-inner group-hover:bg-indigo-600/10 transition-colors relative">
                          {proof.type.includes('ZK') || proof.type.includes('Researcher') ? <BrainCircuit className="w-10 h-10 text-indigo-500" /> : <Shield className="w-10 h-10 text-indigo-500" />}
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center text-[8px] font-black">
                             {proof.experience}y
                          </div>
                       </div>
                       <div className="space-y-2">
                          <div className="flex items-center gap-3">
                             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">ID: {proof.candidateId}</span>
                             <div className="w-1.5 h-1.5 bg-zinc-700 rounded-full"></div>
                             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{proof.timestamp}</span>
                             <div className="w-1.5 h-1.5 bg-zinc-700 rounded-full"></div>
                             <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 font-mono italic">{proof.education}</span>
                          </div>
                          <h3 className="text-2xl font-black italic uppercase tracking-tighter">{proof.type}</h3>

                          <div className="flex flex-wrap gap-2">
                             {proof.skills?.map(skill => (
                                <span key={skill} className="text-[9px] font-black bg-black/40 border border-white/5 px-2.5 py-1 rounded-md uppercase tracking-wider text-zinc-400 group-hover:border-indigo-500/30 group-hover:text-indigo-400 transition-colors">
                                   {skill}
                                </span>
                             ))}
                          </div>

                          <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-600 bg-black/40 px-3 py-1 rounded-lg w-fit border border-white/5">
                             <Fingerprint className="w-3 h-3" />
                             {proof.hash}
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-4 relative z-10">
                       {verified[proof.id] ? (
                          <div className="flex items-center gap-3 px-10 py-5 bg-emerald-600/10 border border-emerald-600/20 rounded-[1.5rem] text-emerald-500 font-black uppercase italic tracking-widest text-sm animate-in zoom-in-95 duration-500">
                             <CheckCircle2 className="w-5 h-5" />
                             Valid Proof
                          </div>
                       ) : (
                          <button
                            onClick={() => verifyProof(proof.id)}
                            disabled={verifying === proof.id}
                            className="flex items-center gap-3 px-10 py-5 bg-white text-black rounded-[1.5rem] font-black uppercase italic tracking-widest text-sm hover:bg-indigo-600 hover:text-white transition-all shadow-xl active:scale-95 disabled:opacity-50"
                          >
                             {verifying === proof.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                             {verifying === proof.id ? 'Computing...' : 'Verify Claim'}
                          </button>
                       )}

                       <button className="p-5 bg-zinc-800 hover:bg-zinc-700 rounded-[1.5rem] transition-colors border border-zinc-700 group/btn">
                          <ChevronDown className="w-6 h-6 text-zinc-400 -rotate-90 group-hover:translate-x-1 transition-transform" />
                       </button>
                    </div>

                    {/* Background decoration */}
                    <div className="absolute right-0 top-0 w-48 h-48 bg-indigo-600/5 blur-[100px] rounded-full translate-x-16 -translate-y-16"></div>
                 </div>
               ))
             )}
           </div>
        </div>
      </main>

      <footer className="px-10 py-8 border-t border-zinc-800 text-center flex flex-col md:flex-row items-center justify-between bg-zinc-950">
        <div className="flex items-center gap-6">
           <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
              Midnight Ledger Sync v4.0.4
           </span>
        </div>
        <div className="mt-4 md:mt-0 text-[11px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
           Encryption: <span className="text-indigo-600 bg-indigo-900/10 px-3 py-1 rounded-lg italic border border-indigo-500/20">Poseidon Hash / Groth16</span>
        </div>
        <div className="mt-4 md:mt-0 text-zinc-400 text-[10px] font-black uppercase tracking-widest opacity-60">
          ProofHire © 2025 • Privacy First Recruitment
        </div>
      </footer>
    </div>
  );
}

// Add BrainCircuit icon manually if not in current lucide version or substitute
function BrainCircuit(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .52 8.105V19a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a4 4 0 0 0-2.526-5.77 4 4 0 0 0-2.526-5.77A3 3 0 0 0 12 5z" />
      <path d="M9 13h1" />
      <path d="M14 13h1" />
      <path d="M12 16v1" />
      <path d="M12 8v1" />
    </svg>
  );
}
