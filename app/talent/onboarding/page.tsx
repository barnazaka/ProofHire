'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck, ArrowRight, ArrowLeft,
  User, GraduationCap, Briefcase,
  Code2, Loader2, CheckCircle2,
  Zap, Fingerprint, Mail, Phone, Lock, Save
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import {
  deployTalentContract,
  proveSchool,
  proveSkills,
  proveExperience,
  publishCV
} from '@/lib/midnight-utils';
import CryptoJS from 'crypto-js';

const STEPS = 6;

export default function TalentOnboarding() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [contractAddress, setContractAddress] = useState<string | null>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    school: '',
    skills: '',
    experience: '',
    email: '',
    phone: ''
  });

  const [proofs, setProofs] = useState({
    school: false,
    skills: false,
    experience: false
  });

  useEffect(() => {
    const savedAddr = localStorage.getItem('talent_credential_contract_address');
    if (savedAddr) setContractAddress(savedAddr);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateCommitment = (data: string) => {
    const hash = CryptoJS.SHA256(data).toString();
    return new Uint8Array(hash.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
  };

  const handleAction = async () => {
    // If ZKP is already done for this step, just advance
    if (step === 2 && proofs.school) { setStep(3); return; }
    if (step === 3 && proofs.skills) { setStep(4); return; }
    if (step === 4 && proofs.experience) { setStep(5); return; }

    setIsLoading(true);
    try {
      if (step === 1) {
        if (!formData.name) throw new Error('Please enter your name');
        setStatus('Deploying Sovereign Contract...');
        const addr = await deployTalentContract();
        setContractAddress(addr);
        setStep(2);
      } else if (step === 2) {
        if (!formData.school) throw new Error('Please enter your school');
        setStatus('Generating ZKP for School...');
        await proveSchool(contractAddress!, generateCommitment(formData.school));
        setProofs({ ...proofs, school: true });
      } else if (step === 3) {
        if (!formData.skills) throw new Error('Please enter your skills');
        setStatus('Generating ZKP for Skills...');
        await proveSkills(contractAddress!, generateCommitment(formData.skills));
        setProofs({ ...proofs, skills: true });
      } else if (step === 4) {
        if (!formData.experience) throw new Error('Please enter your experience');
        setStatus('Generating ZKP for Experience...');
        await proveExperience(contractAddress!, generateCommitment(formData.experience));
        setProofs({ ...proofs, experience: true });
      } else if (step === 5) {
        setStep(6);
      } else if (step === 6) {
        setStatus('Publishing Sovereign CV...');
        await publishCV(contractAddress!, formData.name);

        // Add to global marketplace simulation
        const marketplace = JSON.parse(localStorage.getItem('proofhire_marketplace') || '[]');
        marketplace.push({
            address: contractAddress,
            name: formData.name
        });
        localStorage.setItem('proofhire_marketplace', JSON.stringify(marketplace));

        router.push('/marketplace');
      }
    } catch (err: any) {
      console.error(err);
      alert('Action failed: ' + err.message);
    } finally {
      setIsLoading(false);
      setStatus('');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans p-8">
      <header className="max-w-4xl mx-auto flex justify-between items-center mb-16">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-indigo-500" />
          <span className="text-2xl font-black italic uppercase">Talent OS</span>
        </div>
        <ThemeToggle />
      </header>

      <main className="max-w-2xl mx-auto space-y-12">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800">
                {step === 1 && <User className="text-indigo-500" />}
                {step === 2 && <GraduationCap className="text-indigo-500" />}
                {step === 3 && <Code2 className="text-indigo-500" />}
                {step === 4 && <Briefcase className="text-indigo-500" />}
                {step === 5 && <Mail className="text-indigo-500" />}
                {step === 6 && <Save className="text-indigo-500" />}
             </div>
             <div>
                <h1 className="text-3xl font-black italic uppercase tracking-tighter">
                  {step === 1 && 'Personal Identity'}
                  {step === 2 && 'Academic Foundation'}
                  {step === 3 && 'Technical Skills'}
                  {step === 4 && 'Work History'}
                  {step === 5 && 'Private Contact'}
                  {step === 6 && 'Review & Publish'}
                </h1>
                <p className="text-zinc-500 text-sm font-medium italic">Step {step} of {STEPS}</p>
             </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 space-y-8">
           {step === 1 && (
             <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Public Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-black border border-zinc-800 rounded-2xl p-6 text-xl font-black italic outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                  placeholder="Satoshi Nakamoto"
                />
             </div>
           )}

           {step === 2 && (
             <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">University / School</label>
                <input
                  name="school"
                  value={formData.school}
                  onChange={handleInputChange}
                  className="w-full bg-black border border-zinc-800 rounded-2xl p-6 text-xl font-black italic outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                  placeholder="University of Oxford"
                />
                <div className="flex items-center gap-3 p-4 bg-indigo-600/5 border border-indigo-600/20 rounded-2xl">
                   <Fingerprint className="w-5 h-5 text-indigo-500" />
                   <p className="text-xs font-medium text-indigo-300 italic">This data stays private. Only a ZK proof is sent to Midnight.</p>
                </div>
             </div>
           )}

           {step === 3 && (
             <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Core Skills</label>
                <textarea
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full bg-black border border-zinc-800 rounded-2xl p-6 text-xl font-black italic outline-none focus:ring-2 focus:ring-indigo-600 transition-all resize-none"
                  placeholder="Compact, Rust, ZKP, TypeScript"
                />
             </div>
           )}

           {step === 4 && (
             <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Experience Summary</label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full bg-black border border-zinc-800 rounded-2xl p-6 text-xl font-black italic outline-none focus:ring-2 focus:ring-indigo-600 transition-all resize-none"
                  placeholder="5 years at Midnight Labs..."
                />
             </div>
           )}

           {step === 5 && (
             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Email Address</label>
                   <input
                     name="email"
                     value={formData.email}
                     onChange={handleInputChange}
                     className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-sm font-medium outline-none"
                     placeholder="sat@protonmail.com"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Phone Number</label>
                   <input
                     name="phone"
                     value={formData.phone}
                     onChange={handleInputChange}
                     className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-sm font-medium outline-none"
                     placeholder="+1 234 567 890"
                   />
                </div>
                <div className="p-6 bg-zinc-950 rounded-2xl border border-zinc-800">
                   <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Storage Node</p>
                   <p className="text-xs font-medium text-zinc-400 italic">This data is stored only in your local browser state, encrypted with AES-256.</p>
                </div>
             </div>
           )}

           {step === 6 && (
             <div className="space-y-8">
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-6 bg-black rounded-2xl border border-zinc-800 space-y-1">
                      <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">School ZKP</p>
                      <div className="flex items-center gap-2">
                         <CheckCircle2 className="w-4 h-4 text-green-500" />
                         <span className="text-xs font-bold italic uppercase">Verified</span>
                      </div>
                   </div>
                   <div className="p-6 bg-black rounded-2xl border border-zinc-800 space-y-1">
                      <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Skills ZKP</p>
                      <div className="flex items-center gap-2">
                         <CheckCircle2 className="w-4 h-4 text-green-500" />
                         <span className="text-xs font-bold italic uppercase">Verified</span>
                      </div>
                   </div>
                   <div className="p-6 bg-black rounded-2xl border border-zinc-800 space-y-1">
                      <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Experience ZKP</p>
                      <div className="flex items-center gap-2">
                         <CheckCircle2 className="w-4 h-4 text-green-500" />
                         <span className="text-xs font-bold italic uppercase">Verified</span>
                      </div>
                   </div>
                   <div className="p-6 bg-black rounded-2xl border border-zinc-800 space-y-1">
                      <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Public Identity</p>
                      <span className="text-xs font-bold italic uppercase text-indigo-500 truncate">{formData.name}</span>
                   </div>
                </div>
                <div className="p-8 bg-indigo-600/10 border border-indigo-600/30 rounded-3xl flex items-start gap-4">
                   <Lock className="w-6 h-6 text-indigo-500 flex-shrink-0" />
                   <p className="text-xs font-medium text-indigo-300 leading-relaxed italic">By publishing, your name will be visible to recruiters. All qualifying proofs remain anonymous and cryptographically secured on the Midnight ledger.</p>
                </div>
             </div>
           )}

           <button
             onClick={handleAction}
             disabled={isLoading}
             className="w-full py-8 bg-white text-black rounded-3xl font-black italic uppercase tracking-widest text-sm flex items-center justify-center gap-4 hover:bg-indigo-600 hover:text-white transition-all shadow-2xl shadow-indigo-600/20 active:scale-95 disabled:opacity-50"
           >
             {isLoading ? (
               <><Loader2 className="w-6 h-6 animate-spin" /> {status}</>
             ) : (
               <>
                 {step === 1 && 'Initialize Contract'}
                 {step === 2 && (proofs.school ? 'Continue' : 'Generate ZKP for School')}
                 {step === 3 && (proofs.skills ? 'Continue' : 'Generate ZKP for Skills')}
                 {step === 4 && (proofs.experience ? 'Continue' : 'Generate ZKP for Experience')}
                 {step === 5 && 'Continue'}
                 {step === 6 && 'Publish Sovereign CV'}
                 <Zap className="w-5 h-5 fill-current" />
               </>
             )}
           </button>
        </div>

        {step > 1 && !isLoading && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest italic"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Previous Node
          </button>
        )}
      </main>
    </div>
  );
}
