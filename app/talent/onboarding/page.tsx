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
  Terminal, Globe, Lock
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { encryptData, decryptData } from '@/lib/encryption-utils';
import { deployAndAnchorCV } from '@/lib/midnight-utils';

const STEPS = 7;

export default function TalentOnboardingPage() {
  const [step, setStep] = useState(1);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [deployedContract, setDeployedContract] = useState('');
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    location: '',
    phone: '',
    bio: '',
    headline: '',
    educationLevel: 'Bachelor\'s',
    fieldOfStudy: '',
    institutionName: '',
    graduationYear: '',
    experiences: [{ id: '1', title: '', company: '', years: '', responsibilities: '' }],
    primaryRole: '',
    skills: [] as { id: string, name: string, level: string }[],
    currentSkill: '',
    certifications: [] as { id: string, name: string, issuer: string, year: string }[],
    hobbies: [] as string[],
    currentHobby: '',
    otherInterests: ''
  });

  useEffect(() => {
    const address = localStorage.getItem('user_address');
    const role = localStorage.getItem('user_role');
    const onboarded = localStorage.getItem('onboarding_complete');

    if (!address || role !== 'talent') {
      router.push('/talent/auth');
    } else if (onboarded === 'true' && !window.location.search.includes('edit=true')) {
      router.push('/talent/dashboard');
    } else if (window.location.search.includes('edit=true')) {
       // Load existing data for editing
       const localData = localStorage.getItem('proofhire_talent_data');
       if (localData) {
          const decrypted = decryptData(localData);
          if (decrypted) setFormData(decrypted);
       }
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (step < STEPS) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experiences: [...prev.experiences, { id: Math.random().toString(36).substring(7), title: '', company: '', years: '', responsibilities: '' }]
    }));
  };

  const removeExperience = (id: string) => {
    if (formData.experiences.length === 1) return;
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(exp => exp.id !== id)
    }));
  };

  const handleExperienceChange = (id: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    }));
  };

  const addSkill = () => {
    if (!formData.currentSkill) return;
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, { id: Math.random().toString(36).substring(7), name: prev.currentSkill, level: 'Intermediate' }],
      currentSkill: ''
    }));
  };

  const removeSkill = (id: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== id)
    }));
  };

  const addCert = () => {
    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, { id: Math.random().toString(36).substring(7), name: '', issuer: '', year: '' }]
    }));
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    setDeploymentStatus('Connecting to Midnight Lace...');

    try {
      // 1. Encrypt and save data locally first
      const encryptedData = encryptData(formData);
      localStorage.setItem('proofhire_talent_data', encryptedData);

      // 2. Prepare PII Commitment Hash (Witness data)
      const piiString = JSON.stringify({
        fullName: formData.fullName,
        email: formData.email,
        edu: formData.educationLevel,
        yoe: formData.experiences.reduce((sum, exp) => sum + (parseInt(exp.years) || 0), 0),
        skills: formData.skills.map(s => s.name).sort()
      });
      const hashHex = CryptoJS.SHA256(piiString).toString();
      const piiHash = new Uint8Array(hashHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));

      setDeploymentStatus('Compiling ZK Circuits (cv-proof.compact)...');
      await new Promise(r => setTimeout(r, 1000));

      setDeploymentStatus('Generating Local Groth16 Proof...');

      // 3. Deploy and Anchor to Midnight
      const result = await deployAndAnchorCV(formData.fullName, piiHash);

      if (!result) throw new Error('Deployment failed to return contract address.');

      setDeployedContract(result.contractAddress);

      // 4. Update local state
      localStorage.setItem('onboarding_complete', 'true');

      const newProof = {
        id: Math.random().toString(36).substring(7),
        txId: result.txId,
        type: 'Sovereign CV Anchored',
        timestamp: new Date().toLocaleString(),
        contractAddress: result.contractAddress,
        claimHash: hashHex
      };

      const existingProofs = JSON.parse(localStorage.getItem('proofhire_proofs') || '[]');
      localStorage.setItem('proofhire_proofs', JSON.stringify([newProof, ...existingProofs]));

      setDeploymentStatus('Identity Anchored Successfully.');
      setShowSuccess(true);

    } catch (err: any) {
      console.error('Deployment failed:', err);
      setDeploymentStatus(`Error: ${err.message || 'Verification process failed.'}`);
      setTimeout(() => setIsDeploying(false), 4000);
    }
  };

  const SuccessModal = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/80 backdrop-blur-xl"
    >
       <div className="max-w-2xl w-full bg-zinc-900 border border-indigo-500/30 rounded-[3rem] p-12 shadow-2xl shadow-indigo-600/20 text-center space-y-8">
          <div className="w-24 h-24 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center">
             <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <div className="space-y-4">
             <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">Identity Sovereign!</h2>
             <p className="text-zinc-400 font-medium">Your CV and skills are now anchored to the Midnight Network using Zero-Knowledge Proofs. Only your name is public; everything else is verified on-demand.</p>
          </div>
          <div className="p-6 bg-black border border-zinc-800 rounded-2xl flex flex-col gap-2 text-left">
             <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Contract Deployed at:</span>
             <code className="text-xs font-mono text-zinc-300 break-all">{deployedContract}</code>
          </div>
          <button
            onClick={() => router.push('/talent/dashboard')}
            className="w-full py-6 bg-white text-black rounded-2xl font-black uppercase italic tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-lg"
          >
             Go to Dashboard
          </button>
       </div>
    </motion.div>
  );

  const ProgressHeader = () => (
    <div className="fixed top-0 left-0 w-full z-50 bg-black/50 backdrop-blur-3xl border-b border-zinc-800 p-8 flex flex-col gap-4">
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black italic tracking-tighter uppercase">Onboarding</span>
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
      {showSuccess && <SuccessModal />}

      <main className="max-w-4xl mx-auto w-full pt-48 pb-32 px-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="space-y-4">
                 <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800">
                    <User className="w-8 h-8 text-indigo-500" />
                 </div>
                 <h2 className="text-5xl font-black italic uppercase tracking-tightest">Personal<br /><span className="text-indigo-600">Identity.</span></h2>
                 <p className="text-zinc-500 font-medium max-w-lg">Recruiters will use these details for communication. Remember: this data is encrypted locally.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Full Name</label>
                    <div className="relative">
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                       <input
                         name="fullName"
                         value={formData.fullName}
                         onChange={handleInputChange}
                         className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-zinc-700 font-medium"
                         placeholder="Satoshi Nakamoto"
                       />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Email Address</label>
                    <div className="relative">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                       <input
                         name="email"
                         value={formData.email}
                         onChange={handleInputChange}
                         className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-zinc-700 font-medium"
                         placeholder="sat@protonmail.com"
                       />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Headline</label>
                    <div className="relative">
                       <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                       <input
                         name="headline"
                         value={formData.headline}
                         onChange={handleInputChange}
                         className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-zinc-700 font-medium"
                         placeholder="Senior Blockchain Architect"
                       />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Location</label>
                    <div className="relative">
                       <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                       <input
                         name="location"
                         value={formData.location}
                         onChange={handleInputChange}
                         className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-zinc-700 font-medium"
                         placeholder="Remote / Switzerland"
                       />
                    </div>
                 </div>
                 <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-zinc-700 font-medium resize-none"
                      placeholder="Brief summary of your professional journey..."
                    />
                 </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="space-y-4">
                 <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800">
                    <GraduationCap className="w-8 h-8 text-indigo-500" />
                 </div>
                 <h2 className="text-5xl font-black italic uppercase tracking-tightest">Academic<br /><span className="text-indigo-600">Foundation.</span></h2>
                 <p className="text-zinc-500 font-medium max-w-lg">Midnight verifies your degree status via ZK proofs without revealing the university name unless you permit it.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Education Level</label>
                    <select
                      name="educationLevel"
                      value={formData.educationLevel}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium appearance-none"
                    >
                      <option>Bachelor\'s</option>
                      <option>Master\'s</option>
                      <option>PhD</option>
                      <option>Bootcamp</option>
                      <option>Self-Taught</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Institution Name</label>
                    <input
                      name="institutionName"
                      value={formData.institutionName}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-zinc-700 font-medium"
                      placeholder="University of Oxford"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Field of Study</label>
                    <input
                      name="fieldOfStudy"
                      value={formData.fieldOfStudy}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-zinc-700 font-medium"
                      placeholder="Computer Science & Cryptography"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Graduation Year</label>
                    <input
                      name="graduationYear"
                      value={formData.graduationYear}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-zinc-700 font-medium"
                      placeholder="2018"
                    />
                 </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="space-y-4">
                 <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800">
                    <Briefcase className="w-8 h-8 text-indigo-500" />
                 </div>
                 <h2 className="text-5xl font-black italic uppercase tracking-tightest">Work<br /><span className="text-indigo-600">Experience.</span></h2>
                 <p className="text-zinc-500 font-medium max-w-lg">Midnight generates a proof of "Years of Experience" (YoE) based on these inputs.</p>
              </div>

              <div className="space-y-6">
                 {formData.experiences.map((exp, index) => (
                   <div key={exp.id} className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2rem] space-y-6 relative group/exp">
                      <button
                        onClick={() => removeExperience(exp.id)}
                        className="absolute top-6 right-6 p-2 bg-rose-900/20 text-rose-500 rounded-xl opacity-0 group-hover/exp:opacity-100 transition-opacity"
                      >
                         <X className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Job Title</label>
                            <input
                              value={exp.title}
                              onChange={(e) => handleExperienceChange(exp.id, 'title', e.target.value)}
                              className="w-full bg-black border border-zinc-800 rounded-xl p-3 focus:ring-2 focus:ring-indigo-600 outline-none font-medium"
                              placeholder="Lead Engineer"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Company</label>
                            <input
                              value={exp.company}
                              onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                              className="w-full bg-black border border-zinc-800 rounded-xl p-3 focus:ring-2 focus:ring-indigo-600 outline-none font-medium"
                              placeholder="Global Tech Inc"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Years</label>
                            <input
                              type="number"
                              value={exp.years}
                              onChange={(e) => handleExperienceChange(exp.id, 'years', e.target.value)}
                              className="w-full bg-black border border-zinc-800 rounded-xl p-3 focus:ring-2 focus:ring-indigo-600 outline-none font-medium"
                              placeholder="3"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Responsibilities</label>
                            <input
                              value={exp.responsibilities}
                              onChange={(e) => handleExperienceChange(exp.id, 'responsibilities', e.target.value)}
                              className="w-full bg-black border border-zinc-800 rounded-xl p-3 focus:ring-2 focus:ring-indigo-600 outline-none font-medium"
                              placeholder="Architected ZK payment protocols..."
                            />
                         </div>
                      </div>
                   </div>
                 ))}

                 <button
                   onClick={addExperience}
                   className="w-full py-6 border-2 border-dashed border-zinc-800 rounded-[2rem] flex items-center justify-center gap-3 text-zinc-500 hover:border-indigo-600 hover:text-indigo-500 transition-all font-black uppercase tracking-widest text-xs"
                 >
                    <Plus className="w-5 h-5" />
                    Add More Experience
                 </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="space-y-4">
                 <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800">
                    <Code2 className="w-8 h-8 text-indigo-500" />
                 </div>
                 <h2 className="text-5xl font-black italic uppercase tracking-tightest">Technical<br /><span className="text-indigo-600">Skills.</span></h2>
                 <p className="text-zinc-500 font-medium max-w-lg">Each skill will be individually verifiable via ZK-Proof commitments.</p>
              </div>

              <div className="space-y-8">
                 <div className="flex gap-4">
                    <input
                      value={formData.currentSkill}
                      onChange={(e) => setFormData(prev => ({ ...prev, currentSkill: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-600 outline-none font-medium"
                      placeholder="e.g. Compact, Rust, Midnight SDK..."
                    />
                    <button
                      onClick={addSkill}
                      className="px-8 bg-indigo-600 text-white rounded-2xl font-black uppercase italic tracking-widest hover:bg-indigo-700 transition-all shadow-lg"
                    >
                       Add
                    </button>
                 </div>

                 <div className="flex flex-wrap gap-4">
                    {formData.skills.map(skill => (
                      <div key={skill.id} className="flex items-center gap-3 pl-5 pr-3 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl group">
                         <span className="text-sm font-black italic uppercase tracking-tight">{skill.name}</span>
                         <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                         <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{skill.level}</span>
                         <button
                           onClick={() => removeSkill(skill.id)}
                           className="ml-2 p-1.5 hover:bg-rose-900/20 text-rose-500 rounded-lg transition-colors"
                         >
                            <X className="w-3 h-3" />
                         </button>
                      </div>
                    ))}
                    {formData.skills.length === 0 && (
                      <div className="text-zinc-600 italic font-medium">No skills added yet...</div>
                    )}
                 </div>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="space-y-4">
                 <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800">
                    <Award className="w-8 h-8 text-indigo-500" />
                 </div>
                 <h2 className="text-5xl font-black italic uppercase tracking-tightest">Industry<br /><span className="text-indigo-600">Certs.</span></h2>
                 <p className="text-zinc-500 font-medium max-w-lg">Certified skills carry higher trust weights in the ProofHire matching engine.</p>
              </div>

              <div className="space-y-6">
                 {formData.certifications.map((cert, index) => (
                    <div key={cert.id} className="p-6 bg-zinc-900 border border-zinc-800 rounded-[2rem] grid grid-cols-1 md:grid-cols-3 gap-6 relative group">
                       <input
                         value={cert.name}
                         onChange={(e) => {
                            const newCerts = [...formData.certifications];
                            newCerts[index].name = e.target.value;
                            setFormData(prev => ({ ...prev, certifications: newCerts }));
                         }}
                         className="bg-black border border-zinc-800 rounded-xl p-3 focus:ring-2 focus:ring-indigo-600 outline-none font-medium text-sm"
                         placeholder="Certification Name"
                       />
                       <input
                         value={cert.issuer}
                         onChange={(e) => {
                            const newCerts = [...formData.certifications];
                            newCerts[index].issuer = e.target.value;
                            setFormData(prev => ({ ...prev, certifications: newCerts }));
                         }}
                         className="bg-black border border-zinc-800 rounded-xl p-3 focus:ring-2 focus:ring-indigo-600 outline-none font-medium text-sm"
                         placeholder="Issuer (e.g. AWS)"
                       />
                       <input
                         value={cert.year}
                         onChange={(e) => {
                            const newCerts = [...formData.certifications];
                            newCerts[index].year = e.target.value;
                            setFormData(prev => ({ ...prev, certifications: newCerts }));
                         }}
                         className="bg-black border border-zinc-800 rounded-xl p-3 focus:ring-2 focus:ring-indigo-600 outline-none font-medium text-sm"
                         placeholder="Year"
                       />
                       <button
                         onClick={() => {
                            setFormData(prev => ({ ...prev, certifications: prev.certifications.filter(c => c.id !== cert.id) }));
                         }}
                         className="absolute -right-3 -top-3 p-2 bg-rose-900/20 text-rose-500 rounded-xl border border-rose-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                       >
                          <X className="w-4 h-4" />
                       </button>
                    </div>
                 ))}

                 <button
                   onClick={addCert}
                   className="w-full py-6 border-2 border-dashed border-zinc-800 rounded-[2rem] flex items-center justify-center gap-3 text-zinc-500 hover:border-indigo-600 hover:text-indigo-500 transition-all font-black uppercase tracking-widest text-xs"
                 >
                    <Plus className="w-5 h-5" />
                    Add Certification
                 </button>
              </div>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="space-y-4">
                 <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800">
                    <Heart className="w-8 h-8 text-indigo-500" />
                 </div>
                 <h2 className="text-5xl font-black italic uppercase tracking-tightest">Interests &<br /><span className="text-indigo-600">Culture.</span></h2>
                 <p className="text-zinc-500 font-medium max-w-lg">Anonymous matching is partially based on shared interests and professional culture fit.</p>
              </div>

              <div className="space-y-8">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Primary Career Role Focus</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                       {['Backend Engineer', 'ZK Researcher', 'Frontend Dev', 'Smart Contract Engineer', 'Product Lead', 'Data Scientist'].map(role => (
                          <button
                            key={role}
                            onClick={() => setFormData(prev => ({ ...prev, primaryRole: role }))}
                            className={`p-4 rounded-2xl border-2 font-black uppercase italic tracking-widest text-[10px] transition-all ${formData.primaryRole === role ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                          >
                             {role}
                          </button>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Other Interests (Comma separated)</label>
                    <textarea
                      name="otherInterests"
                      value={formData.otherInterests}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-600 outline-none font-medium resize-none"
                      placeholder="Cryptography, Sailing, Decentralization, High-Performance Computing..."
                    />
                 </div>
              </div>
            </motion.div>
          )}

          {step === 7 && (
            <motion.div
              key="step7"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="space-y-4">
                 <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800">
                    <Eye className="w-8 h-8 text-indigo-500" />
                 </div>
                 <h2 className="text-5xl font-black italic uppercase tracking-tightest">Review &<br /><span className="text-indigo-600">Deploy.</span></h2>
                 <p className="text-zinc-500 font-medium max-w-lg">Verify your sovereign identity data before anchoring it to the Midnight blockchain.</p>
              </div>

              <div className="p-10 bg-zinc-900/50 border border-zinc-800 rounded-[3rem] space-y-12">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                       <div className="space-y-1">
                          <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Primary Identity</span>
                          <p className="text-2xl font-black italic uppercase leading-none">{formData.fullName || 'Anonymous'}</p>
                          <p className="text-indigo-500 font-bold text-sm italic">{formData.headline || 'Professional Candidate'}</p>
                       </div>

                       <div className="space-y-1">
                          <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Academic Proof</span>
                          <p className="text-sm font-bold uppercase">{formData.educationLevel} in {formData.fieldOfStudy || 'General'}</p>
                          <p className="text-zinc-500 text-xs font-medium italic">{formData.institutionName || 'University'}</p>
                       </div>
                    </div>

                    <div className="space-y-8">
                       <div className="space-y-1">
                          <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Experience Claim</span>
                          <p className="text-lg font-black italic uppercase">{formData.experiences.reduce((s, e) => s + (parseInt(e.years) || 0), 0)} Total Years</p>
                          <p className="text-zinc-500 text-xs font-medium italic">{formData.experiences.length} Positions Captured</p>
                       </div>

                       <div className="space-y-2">
                          <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">ZK Skill Tree</span>
                          <div className="flex flex-wrap gap-2">
                             {formData.skills.slice(0, 4).map(s => (
                                <span key={s.id} className="text-[9px] font-black bg-zinc-800 px-2 py-1 rounded-md uppercase">{s.name}</span>
                             ))}
                             {formData.skills.length > 4 && <span className="text-[9px] font-black bg-zinc-800 px-2 py-1 rounded-md uppercase">+{formData.skills.length - 4} More</span>}
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="p-8 bg-indigo-600/10 border border-indigo-600/30 rounded-[2rem] flex items-start gap-5">
                    <div className="p-3 bg-indigo-600 rounded-2xl">
                       <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-2">
                       <h4 className="font-black italic uppercase tracking-tighter text-indigo-500">Zero-Knowledge Guard</h4>
                       <p className="text-xs font-medium text-indigo-300/80 leading-relaxed">
                          Your raw data remains encrypted in your local browser state using AES-256.
                          Deploying to Midnight anchors a cryptographic commitment that proves
                          your qualifications without exposing your PII.
                       </p>
                    </div>
                 </div>
              </div>

              {!isDeploying ? (
                 <button
                   onClick={handleDeploy}
                   className="w-full flex items-center justify-center gap-4 py-8 bg-white text-black rounded-[2.5rem] font-black uppercase italic tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-3xl group"
                 >
                    <Zap className="w-6 h-6 fill-black group-hover:fill-white transition-colors" />
                    Generate ZK Proof and Deploy to Chain
                 </button>
              ) : (
                 <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                    <div className="relative h-64 bg-zinc-900 border border-zinc-800 rounded-[3rem] overflow-hidden flex flex-col items-center justify-center gap-6">
                       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                       <motion.div
                         animate={{ rotate: 360 }}
                         transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                         className="w-20 h-20 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full flex items-center justify-center"
                       >
                          <Fingerprint className="w-10 h-10 text-indigo-500 animate-pulse" />
                       </motion.div>
                       <div className="text-center space-y-2 relative z-10">
                          <p className="text-xl font-black italic uppercase tracking-widest text-indigo-500 animate-pulse">{deploymentStatus}</p>
                       </div>
                    </div>
                 </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Controls */}
        {!isDeploying && (
          <div className="fixed bottom-0 left-0 w-full p-8 z-40 flex justify-center pointer-events-none">
            <div className="max-w-4xl mx-auto w-full flex justify-between pointer-events-auto">
               <button
                 onClick={prevStep}
                 disabled={step === 1}
                 className={`flex items-center gap-3 px-8 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${step === 1 ? 'opacity-0' : 'hover:bg-zinc-800 hover:scale-105 active:scale-95'}`}
               >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
               </button>

               {step < STEPS && (
                 <button
                   onClick={nextStep}
                   className="flex items-center gap-3 px-10 py-4 bg-white text-black rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white hover:scale-105 active:scale-95 transition-all shadow-2xl"
                 >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                 </button>
               )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
