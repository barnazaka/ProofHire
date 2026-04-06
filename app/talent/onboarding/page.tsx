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
  Terminal, Globe, Lock, Copy, Check
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { encryptData, decryptData } from '@/lib/encryption-utils';
import {
  deployProofHireContract,
  submitSchoolProof,
  submitSkillsProof,
  submitExperienceProof,
  submitEmailProof,
  submitYoEProof,
  saveCV
} from '@/lib/midnight-utils';

const STEPS = 7;

export default function TalentOnboardingPage() {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [contractAddress, setContractAddress] = useState('');
  const [copied, setCopied] = useState(false);
  const [verifiedSteps, setVerifiedSteps] = useState<Record<number, boolean>>({});
  const router = useRouter();

  // Form State
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

    // Generate or load secret key
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateHash = (value: string) => {
    const hashHex = CryptoJS.SHA256(value).toString();
    return new Uint8Array(hashHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
  };

  const runProofStep = async (stepNum: number, action: () => Promise<any>) => {
    setIsProcessing(true);
    setStatusMessage('Generating Zero-Knowledge Proof...');
    try {
        await action();
        setVerifiedSteps(prev => ({ ...prev, [stepNum]: true }));
        setStatusMessage('Proof Verified & Anchored.');
        setTimeout(() => {
            setIsProcessing(false);
            setStep(stepNum + 1);
        }, 1000);
    } catch (err: any) {
        console.error(err);
        setStatusMessage(`Error: ${err.message || 'Proof generation failed'}`);
        setTimeout(() => setIsProcessing(false), 3000);
    }
  };

  const handleInitialDeploy = async () => {
    if (!formData.fullName) return;
    setIsProcessing(true);
    setStatusMessage('Deploying Sovereign Identity Contract...');
    try {
        const result = await deployProofHireContract(secretKey!);
        if (result) {
            setContractAddress(result.contractAddress);
            setVerifiedSteps(prev => ({ ...prev, 1: true }));
            setStatusMessage('Contract Deployed Successfully.');
            setTimeout(() => {
                setIsProcessing(false);
                setStep(2);
            }, 1000);
        }
    } catch (err: any) {
        setStatusMessage(`Deployment Failed: ${err.message}`);
        setTimeout(() => setIsProcessing(false), 3000);
    }
  };

  const handleFinalPublish = async () => {
    setIsProcessing(true);
    setStatusMessage('Finalizing Sovereign CV...');
    try {
        // Hash the name to 32 bytes for the ledger
        const nameHash = generateHash(formData.fullName);
        await saveCV(contractAddress, nameHash, secretKey!);
        localStorage.setItem('onboarding_complete', 'true');

        // Save metadata for marketplace
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

        setShowSuccess(true);
    } catch (err: any) {
        setStatusMessage(`Publish Failed: ${err.message}`);
        setTimeout(() => setIsProcessing(false), 3000);
    }
  };

  const ProgressHeader = () => (
    <div className="fixed top-0 left-0 w-full z-50 bg-black/50 backdrop-blur-3xl border-b border-zinc-800 p-8 flex flex-col gap-4">
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black italic tracking-tighter uppercase">ZK Onboarding</span>
        </div>
        <div className="flex items-center gap-6">
           <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Step {step} of {STEPS}</span>
           <ThemeToggle />
        </div>
      </div>
      <div className="max-w-4xl mx-auto w-full h-[3px] bg-zinc-900 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(step / STEPS) * 100}%` }}
          className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-indigo-600 overflow-x-hidden">
      <ProgressHeader />

      {showSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/90 backdrop-blur-2xl">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-xl w-full bg-zinc-900 border border-indigo-500/30 rounded-[3rem] p-12 text-center space-y-8">
                  <div className="w-20 h-20 bg-green-500 rounded-3xl mx-auto flex items-center justify-center"><CheckCircle2 className="w-10 h-10 text-white" /></div>
                  <h2 className="text-4xl font-black italic uppercase tracking-tighter">CV Published!</h2>
                  <p className="text-zinc-400">Your sovereign identity is live on the Midnight marketplace. Recruiters can now verify your qualifications while your data stays private.</p>
                  <button onClick={() => router.push('/talent/dashboard')} className="w-full py-6 bg-white text-black rounded-2xl font-black uppercase italic tracking-widest hover:bg-indigo-600 hover:text-white transition-all">Enter Dashboard</button>
              </motion.div>
          </div>
      )}

      <main className="max-w-4xl mx-auto w-full pt-48 pb-32 px-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
              <div className="space-y-4">
                 <h2 className="text-5xl font-black italic uppercase tracking-tightest">Identity & <span className="text-indigo-600">Contract.</span></h2>
                 <p className="text-zinc-500">Initialize your sovereign node on the Midnight Network.</p>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Public Talent Name</label>
                    <input name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="e.g. Satoshi Nakamoto" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Professional Headline</label>
                    <input name="headline" value={formData.headline} onChange={handleInputChange} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="e.g. Senior ZK Researcher" />
                </div>
                {contractAddress && (
                    <div className="p-6 bg-indigo-600/10 border border-indigo-600/30 rounded-2xl flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-[8px] font-black text-indigo-500 uppercase">Contract Address</span>
                            <code className="block text-xs font-mono text-zinc-300">{contractAddress}</code>
                        </div>
                        <button onClick={copyToClipboard} className="p-3 bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-colors">
                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-zinc-400" />}
                        </button>
                    </div>
                )}
                {!contractAddress ? (
                    <button onClick={handleInitialDeploy} disabled={isProcessing || !formData.fullName} className="w-full py-6 bg-white text-black rounded-2xl font-black uppercase italic tracking-widest hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-50">
                        {isProcessing ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Deploy Sovereign Contract'}
                    </button>
                ) : (
                    <button onClick={() => setStep(2)} className="w-full py-6 bg-indigo-600 text-white rounded-2xl font-black uppercase italic tracking-widest flex items-center justify-center gap-3">Next Step <ArrowRight className="w-5 h-5" /></button>
                )}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
              <div className="space-y-4">
                 <h2 className="text-5xl font-black italic uppercase tracking-tightest">Private <span className="text-indigo-600">Email.</span></h2>
                 <p className="text-zinc-500">Your email is never stored on-chain. We anchor a ZK proof of its validity.</p>
              </div>
              <div className="space-y-8">
                <input name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="contact@provider.com" />
                <button
                    onClick={() => runProofStep(2, () => submitEmailProof(contractAddress, generateHash(formData.email), secretKey!))}
                    disabled={isProcessing || !formData.email}
                    className="w-full py-6 bg-white text-black rounded-2xl font-black uppercase italic tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
                >
                    {isProcessing ? <><Loader2 className="w-5 h-5 animate-spin inline mr-3"/> {statusMessage}</> : 'Generate Email ZK-Proof'}
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
              <div className="space-y-4">
                 <h2 className="text-5xl font-black italic uppercase tracking-tightest">Academic <span className="text-indigo-600">Proof.</span></h2>
                 <p className="text-zinc-500">Verify your degree and institution with mathematical certainty.</p>
              </div>
              <div className="space-y-6">
                <select name="educationLevel" value={formData.educationLevel} onChange={handleInputChange} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 font-medium appearance-none">
                    <option>Bachelor's</option><option>Master's</option><option>PhD</option><option>Bootcamp</option>
                </select>
                <input name="institutionName" value={formData.institutionName} onChange={handleInputChange} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="University Name" />
                <button
                    onClick={() => runProofStep(3, () => submitSchoolProof(contractAddress, generateHash(formData.institutionName + formData.educationLevel), secretKey!))}
                    disabled={isProcessing || !formData.institutionName}
                    className="w-full py-6 bg-white text-black rounded-2xl font-black uppercase italic tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
                >
                    {isProcessing ? <><Loader2 className="w-5 h-5 animate-spin inline mr-3"/> {statusMessage}</> : 'Generate School ZK-Proof'}
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
              <div className="space-y-4">
                 <h2 className="text-5xl font-black italic uppercase tracking-tightest">Technical <span className="text-indigo-600">Skills.</span></h2>
                 <p className="text-zinc-500">Anchor your skill set to the ledger using a private hash.</p>
              </div>
              <div className="space-y-8">
                <div className="flex gap-4">
                    <input value={formData.currentSkill} onChange={(e) => setFormData(p => ({...p, currentSkill: e.target.value}))} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 outline-none" placeholder="Add Skill (e.g. Rust)" />
                    <button onClick={() => { if(formData.currentSkill) setFormData(p => ({...p, skills: [...p.skills, p.currentSkill], currentSkill: ''})) }} className="px-8 bg-zinc-800 rounded-2xl font-black uppercase italic text-xs">Add</button>
                </div>
                <div className="flex flex-wrap gap-3">
                    {formData.skills.map((s, i) => (
                        <span key={i} className="px-4 py-2 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-xs font-bold">{s}</span>
                    ))}
                </div>
                <button
                    onClick={() => runProofStep(4, () => submitSkillsProof(contractAddress, generateHash(formData.skills.join(',')), secretKey!))}
                    disabled={isProcessing || formData.skills.length === 0}
                    className="w-full py-6 bg-white text-black rounded-2xl font-black uppercase italic tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
                >
                    {isProcessing ? <><Loader2 className="w-5 h-5 animate-spin inline mr-3"/> {statusMessage}</> : 'Generate Skills ZK-Proof'}
                </button>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="s5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
              <div className="space-y-4">
                 <h2 className="text-5xl font-black italic uppercase tracking-tightest">Work <span className="text-indigo-600">Experience.</span></h2>
                 <p className="text-zinc-500">Your specific work history remains private but verified.</p>
              </div>
              <div className="space-y-6">
                <input name="experienceTitle" value={formData.experienceTitle} onChange={handleInputChange} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="Last Job Title" />
                <input name="experienceCompany" value={formData.experienceCompany} onChange={handleInputChange} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="Company Name" />
                <button
                    onClick={() => runProofStep(5, () => submitExperienceProof(contractAddress, generateHash(formData.experienceTitle + formData.experienceCompany), secretKey!))}
                    disabled={isProcessing || !formData.experienceTitle}
                    className="w-full py-6 bg-white text-black rounded-2xl font-black uppercase italic tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
                >
                    {isProcessing ? <><Loader2 className="w-5 h-5 animate-spin inline mr-3"/> {statusMessage}</> : 'Generate Experience ZK-Proof'}
                </button>
              </div>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div key="s6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
              <div className="space-y-4">
                 <h2 className="text-5xl font-black italic uppercase tracking-tightest">Years of <span className="text-indigo-600">Experience.</span></h2>
                 <p className="text-zinc-500">Recruiters see your YoE badge, verified by ZK circuits.</p>
              </div>
              <div className="space-y-8">
                <input type="number" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleInputChange} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-600 outline-none text-2xl font-black text-center" />
                <button
                    onClick={() => runProofStep(6, () => submitYoEProof(contractAddress, generateHash(formData.yearsOfExperience), secretKey!))}
                    disabled={isProcessing}
                    className="w-full py-6 bg-white text-black rounded-2xl font-black uppercase italic tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
                >
                    {isProcessing ? <><Loader2 className="w-5 h-5 animate-spin inline mr-3"/> {statusMessage}</> : 'Generate YoE ZK-Proof'}
                </button>
              </div>
            </motion.div>
          )}

          {step === 7 && (
            <motion.div key="s7" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
              <div className="space-y-4">
                 <h2 className="text-5xl font-black italic uppercase tracking-tightest">Publish <span className="text-indigo-600">CV.</span></h2>
                 <p className="text-zinc-500">All proofs are anchored. Review and publish to the marketplace.</p>
              </div>
              <div className="p-10 bg-zinc-900/50 border border-zinc-800 rounded-[3rem] space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-1">
                          <span className="text-[8px] font-black text-zinc-500 uppercase">Public Name</span>
                          <p className="text-xl font-black italic uppercase">{formData.fullName}</p>
                      </div>
                      <div className="space-y-1">
                          <span className="text-[8px] font-black text-zinc-500 uppercase">YoE Badge</span>
                          <p className="text-xl font-black italic uppercase text-indigo-500">Verified {formData.yearsOfExperience}y</p>
                      </div>
                  </div>
                  <div className="space-y-2">
                      <span className="text-[8px] font-black text-zinc-500 uppercase">ZK Proof References</span>
                      <div className="flex flex-wrap gap-2">
                          {['Email', 'School', 'Skills', 'Experience'].map(p => (
                              <span key={p} className="px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/30 rounded-lg text-[9px] font-black uppercase">ZK_{p.toUpperCase()}</span>
                          ))}
                      </div>
                  </div>
              </div>
              <button onClick={handleFinalPublish} disabled={isProcessing} className="w-full py-8 bg-white text-black rounded-[2.5rem] font-black uppercase italic tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-3xl">
                  {isProcessing ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Save and Publish CV'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
