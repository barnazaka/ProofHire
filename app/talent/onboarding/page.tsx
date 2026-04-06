'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import CryptoJS from 'crypto-js';
import {
  ShieldCheck, ArrowRight, ArrowLeft,
  User, GraduationCap, Briefcase,
  Code2, Award, Heart, Eye,
  CheckCircle2, Loader2, Zap,
  Fingerprint, Sparkles, Plus, X,
  Mail, MapPin, Phone, Building2, Calendar,
  ChevronRight, BrainCircuit, Shield,
  Terminal, Globe, Lock, Copy, Check,
  AlertTriangle
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { encryptData, decryptData } from '@/lib/encryption-utils';
import {
  deployProofHireContract,
  submitSchoolProof,
  submitSkillsProof,
  submitExperienceProof,
  submitCertificationsProof,
  saveCV
} from '@/lib/midnight-utils';

const STEPS = 6;

export default function TalentOnboardingPage() {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorDisplay, setErrorDisplay] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [contractAddress, setContractAddress] = useState('');
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    location: '',
    headline: '',
    educationLevel: 'Bachelor\'s',
    institutionName: '',
    skills: [] as string[],
    currentSkill: '',
    experienceTitle: '',
    experienceCompany: '',
    yearsOfExperience: '0'
  });

  const [secretKey, setSecretKey] = useState<Uint8Array | null>(null);

  useEffect(() => {
    const address = localStorage.getItem('user_address');
    const role = localStorage.getItem('user_role');
    if (!address || role !== 'talent') {
      router.push('/talent/auth');
    }

    let skBase64 = localStorage.getItem('proofhire_sk');
    if (!skBase64) {
        const randomValues = window.crypto.getRandomValues(new Uint8Array(32));
        skBase64 = btoa(String.fromCharCode(...randomValues));
        localStorage.setItem('proofhire_sk', skBase64);
    }
    const sk = new Uint8Array(atob(skBase64).split("").map(c => c.charCodeAt(0)));
    setSecretKey(sk);

    const savedAddr = localStorage.getItem('proofhire_current_contract');
    if (savedAddr) setContractAddress(savedAddr);
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateHash = (value: string) => {
    const hashHex = CryptoJS.SHA256(value).toString();
    return new Uint8Array(hashHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
  };

  const runProofStep = async (stepNum: number, action: () => Promise<any>) => {
    setIsProcessing(true);
    setErrorDisplay(null);
    setStatusMessage('Generating Zero-Knowledge Proof...');
    try {
        await action();
        setStatusMessage('Proof Verified & Anchored.');
        setTimeout(() => {
            setIsProcessing(false);
            setStep(stepNum + 1);
        }, 1000);
    } catch (err: any) {
        console.error(err);
        setErrorDisplay(err.message || 'Verification process failed. Check your wallet connection.');
        setIsProcessing(false);
    }
  };

  const handleInitialDeploy = async () => {
    if (!formData.fullName) {
        setErrorDisplay("Please enter your name first.");
        return;
    }
    setIsProcessing(true);
    setErrorDisplay(null);
    setStatusMessage('Connecting to Midnight & Deploying...');
    try {
        const result = await deployProofHireContract(secretKey!);
        if (result && result.contractAddress) {
            setContractAddress(result.contractAddress);
            setStatusMessage('Contract Successfully Anchored.');
            setTimeout(() => {
                setIsProcessing(false);
                setStep(2);
            }, 1000);
        } else {
            throw new Error("Deployment returned no address. Ensure your wallet is connected.");
        }
    } catch (err: any) {
        console.error(err);
        setErrorDisplay(err.message || 'Deployment failed. Ensure Lace is on Preview Testnet.');
        setIsProcessing(false);
    }
  };

  const handleFinalPublish = async () => {
    setIsProcessing(true);
    setErrorDisplay(null);
    setStatusMessage('Publishing to Marketplace...');
    try {
        await saveCV(contractAddress, secretKey!);
        localStorage.setItem('onboarding_complete', 'true');

        const globalProofs = JSON.parse(localStorage.getItem('proofhire_proofs_global') || '[]');
        globalProofs.push({
            id: Math.random().toString(36).substring(7),
            publicName: formData.fullName,
            headline: formData.headline,
            location: formData.location,
            contractAddress: contractAddress,
            education: formData.educationLevel,
            institutionName: formData.institutionName,
            experience: formData.yearsOfExperience,
            skills: formData.skills,
            email: formData.email
        });
        localStorage.setItem('proofhire_proofs_global', JSON.stringify(globalProofs));

        setStatusMessage('Success! Redirecting...');
        setTimeout(() => {
            setIsProcessing(false);
            setShowSuccess(true);
        }, 1000);
    } catch (err: any) {
        console.error(err);
        setErrorDisplay(err.message || 'Finalization failed. Ensure all required proofs are submitted.');
        setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-indigo-600 overflow-x-hidden flex flex-col">
      {/* Progress Header */}
      <div className="fixed top-0 left-0 w-full z-[60] bg-black/60 backdrop-blur-2xl border-b border-zinc-900 p-6 md:p-8">
        <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20">
              <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <span className="text-lg md:text-xl font-black italic tracking-tighter uppercase">ZK_FLOW</span>
          </div>
          <div className="flex items-center gap-4 md:gap-8">
             <span className="text-[9px] md:text-[10px] font-black text-zinc-500 uppercase tracking-widest">PHASE_{step}/{STEPS}</span>
             <ThemeToggle />
          </div>
        </div>
        <div className="max-w-5xl mx-auto w-full h-1 bg-zinc-900 mt-6 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${(step / STEPS) * 100}%` }} className="h-full bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]" />
        </div>
      </div>

      {/* Processing Overlay */}
      <AnimatePresence>
          {isProcessing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-8 text-center">
                  <div className="max-w-md w-full bg-zinc-900 border border-indigo-500/20 rounded-[3rem] p-12 space-y-8 shadow-3xl">
                      <div className="relative w-24 h-24 mx-auto">
                          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="absolute inset-0 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full" />
                          <Fingerprint className="absolute inset-0 m-auto w-10 h-10 text-indigo-500 animate-pulse" />
                      </div>
                      <div className="space-y-2">
                          <h3 className="text-xl font-black italic uppercase text-white tracking-widest">Midnight Ledger</h3>
                          <p className="text-xs font-bold text-indigo-400 uppercase animate-pulse">{statusMessage}</p>
                      </div>
                  </div>
              </motion.div>
          )}
      </AnimatePresence>

      {/* Success Modal */}
      {showSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/90 backdrop-blur-3xl">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-xl w-full bg-zinc-900 border border-green-500/30 rounded-[3.5rem] p-16 text-center space-y-10 shadow-3xl">
                  <div className="w-24 h-24 bg-green-500 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-green-500/20"><CheckCircle2 className="w-12 h-12 text-white" /></div>
                  <div className="space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">Sovereign Live.</h2>
                    <p className="text-zinc-400 font-medium">Your credentials have been mathematically verified and anchored to the Midnight Network.</p>
                  </div>
                  <button onClick={() => router.push('/talent/dashboard')} className="w-full py-6 bg-white text-black rounded-2xl font-black uppercase italic tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-xl">Launch Dashboard</button>
              </motion.div>
          </div>
      )}

      <main className="flex-1 flex items-center justify-center pt-48 pb-32 px-6">
        <div className="max-w-3xl w-full">
            {errorDisplay && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 p-6 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center gap-4 text-rose-500">
                    <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                    <p className="text-xs font-black uppercase tracking-widest leading-relaxed">{errorDisplay}</p>
                </motion.div>
            )}

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tightest leading-[0.9]">Identity<br /><span className="text-indigo-600">Contract.</span></h2>
                            <p className="text-zinc-500 font-medium text-lg italic">Every sovereign CV requires its own smart contract on Midnight.</p>
                        </div>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Public Name</label>
                                    <input name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 focus:ring-2 focus:ring-indigo-600 outline-none text-xl font-bold" placeholder="Alice Smith" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Headline</label>
                                    <input name="headline" value={formData.headline} onChange={handleInputChange} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 focus:ring-2 focus:ring-indigo-600 outline-none text-xl font-bold" placeholder="Senior Dev" />
                                </div>
                            </div>

                            {contractAddress ? (
                                <div className="p-8 bg-indigo-600/10 border border-indigo-600/30 rounded-3xl flex items-center justify-between group">
                                    <div className="space-y-2 overflow-hidden">
                                        <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">On-Chain Entry point</span>
                                        <code className="block text-xs font-mono text-zinc-300 truncate md:whitespace-normal md:break-all">{contractAddress}</code>
                                    </div>
                                    <button onClick={() => {navigator.clipboard.writeText(contractAddress); setCopied(true); setTimeout(()=>setCopied(false), 2000);}} className="p-4 bg-zinc-900 rounded-2xl hover:bg-zinc-800 transition-all shadow-xl flex-shrink-0 ml-4">
                                        {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-zinc-400" />}
                                    </button>
                                </div>
                            ) : (
                                <button onClick={handleInitialDeploy} disabled={isProcessing} className="w-full py-8 bg-white text-black rounded-3xl font-black uppercase italic tracking-widest text-lg hover:bg-indigo-600 hover:text-white transition-all shadow-2xl active:scale-[0.98] disabled:opacity-50">
                                    Deploy Sovereign Contract
                                </button>
                            )}

                            {contractAddress && (
                                <button onClick={() => setStep(2)} className="w-full py-6 bg-indigo-600 text-white rounded-3xl font-black uppercase italic tracking-widest flex items-center justify-center gap-4 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20">
                                    Begin Verification <ArrowRight className="w-6 h-6" />
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tightest leading-[0.9]">Academic<br /><span className="text-indigo-600">Proof.</span></h2>
                            <p className="text-zinc-500 font-medium text-lg italic">Certify your educational background on the private ledger.</p>
                        </div>
                        <div className="space-y-6">
                            <select name="educationLevel" value={formData.educationLevel} onChange={handleInputChange} className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-xl font-bold appearance-none">
                                <option>Bachelor's</option><option>Master's</option><option>PhD</option><option>Bootcamp</option>
                            </select>
                            <input name="institutionName" value={formData.institutionName} onChange={handleInputChange} className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 focus:ring-2 focus:ring-indigo-600 outline-none text-xl font-bold" placeholder="Institution Name" />
                            <button onClick={() => runProofStep(2, () => submitSchoolProof(contractAddress, generateHash(formData.institutionName + formData.educationLevel), secretKey!))} disabled={isProcessing || !formData.institutionName} className="w-full py-8 bg-white text-black rounded-3xl font-black uppercase italic tracking-widest text-lg hover:bg-indigo-600 hover:text-white transition-all shadow-2xl">
                                Generate ZK Proof
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tightest leading-[0.9]">Technical<br /><span className="text-indigo-600">Stack.</span></h2>
                            <p className="text-zinc-500 font-medium text-lg italic">Build a cryptographically proven skill set reference.</p>
                        </div>
                        <div className="space-y-8">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <input value={formData.currentSkill} onChange={(e) => setFormData(p => ({...p, currentSkill: e.target.value}))} onKeyDown={(e)=>e.key==='Enter' && (formData.currentSkill && setFormData(p=>({...p, skills: [...p.skills, p.currentSkill], currentSkill: ''})))} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 outline-none text-xl font-bold" placeholder="Skill Name" />
                                <button onClick={() => { if(formData.currentSkill) setFormData(p => ({...p, skills: [...p.skills, p.currentSkill], currentSkill: ''})) }} className="px-10 py-6 bg-zinc-800 rounded-2xl font-black uppercase italic tracking-widest">Add</button>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {formData.skills.map((s, i) => (
                                    <div key={i} className="flex items-center gap-3 px-5 py-3 bg-indigo-600/10 border border-indigo-500/30 rounded-2xl group">
                                        <span className="text-xs font-black uppercase italic tracking-widest">{s}</span>
                                        <button onClick={()=>setFormData(p=>({...p, skills: p.skills.filter((_, idx)=>idx!==i)}))} className="text-zinc-600 hover:text-rose-500 transition-colors"><X className="w-3 h-3" /></button>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => runProofStep(3, () => submitSkillsProof(contractAddress, generateHash(formData.skills.join(',')), secretKey!))} disabled={isProcessing || formData.skills.length === 0} className="w-full py-8 bg-white text-black rounded-3xl font-black uppercase italic tracking-widest text-lg hover:bg-indigo-600 hover:text-white transition-all shadow-2xl">
                                Generate Stack Proof
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 4 && (
                    <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tightest leading-[0.9]">Experience<br /><span className="text-indigo-600">History.</span></h2>
                            <p className="text-zinc-500 font-medium text-lg italic">Verified work claims for recruiter evaluation.</p>
                        </div>
                        <div className="space-y-6">
                            <input name="experienceTitle" value={formData.experienceTitle} onChange={handleInputChange} className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 focus:ring-2 focus:ring-indigo-600 outline-none text-xl font-bold" placeholder="Last Title" />
                            <input name="experienceCompany" value={formData.experienceCompany} onChange={handleInputChange} className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 focus:ring-2 focus:ring-indigo-600 outline-none text-xl font-bold" placeholder="Company" />
                            <button onClick={() => runProofStep(4, () => submitExperienceProof(contractAddress, generateHash(formData.experienceTitle + formData.experienceCompany), secretKey!))} disabled={isProcessing || !formData.experienceTitle} className="w-full py-8 bg-white text-black rounded-3xl font-black uppercase italic tracking-widest text-lg hover:bg-indigo-600 hover:text-white transition-all shadow-2xl">
                                Generate ZK Proof
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 5 && (
                    <motion.div key="s5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tightest leading-[0.9]">Secure<br /><span className="text-indigo-600">Credential.</span></h2>
                            <p className="text-zinc-500 font-medium text-lg italic">Anchor a final certification or email proof.</p>
                        </div>
                        <div className="space-y-8">
                            <input name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 focus:ring-2 focus:ring-indigo-600 outline-none text-2xl font-black" placeholder="alice@privacy.com" />
                            <button onClick={() => runProofStep(5, () => submitCertificationsProof(contractAddress, generateHash(formData.email), secretKey!))} disabled={isProcessing || !formData.email} className="w-full py-8 bg-white text-black rounded-3xl font-black uppercase italic tracking-widest text-lg hover:bg-indigo-600 hover:text-white transition-all shadow-2xl">
                                Generate Cert Proof
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 6 && (
                    <motion.div key="s6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tightest leading-[0.9]">Publish<br /><span className="text-indigo-600">CV.</span></h2>
                            <p className="text-zinc-500 font-medium text-lg italic">All ZK-proofs are anchored. Finalize and go live.</p>
                        </div>
                        <div className="p-10 bg-zinc-900 border border-zinc-800 rounded-[3rem] space-y-12 shadow-3xl">
                            <div className="flex flex-col md:flex-row justify-between gap-8">
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Public Candidate</span>
                                    <p className="text-4xl font-black italic uppercase text-white leading-none">{formData.fullName}</p>
                                </div>
                                <div className="space-y-2 text-left md:text-right">
                                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Verified Badge</span>
                                    <p className="text-4xl font-black italic uppercase text-indigo-500 leading-none">ZK_LIVE</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Cryptographic Anchors</span>
                                <div className="flex flex-wrap gap-2">
                                    {['Edu', 'Skills', 'Exp', 'Certs'].map(p => (
                                        <div key={p} className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-lg">
                                            <Check className="w-3 h-3 text-green-500" />
                                            <span className="text-[9px] font-black text-green-500 uppercase tracking-tight">ZK_{p.toUpperCase()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button onClick={handleFinalPublish} disabled={isProcessing} className="w-full py-10 bg-white text-black rounded-[2.5rem] font-black uppercase italic tracking-[0.2em] text-xl hover:bg-indigo-600 hover:text-white transition-all shadow-3xl shadow-indigo-600/20 active:scale-95">
                            Save & Publish to Marketplace
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
