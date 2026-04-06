'use client';

import { useState, useEffect } from 'react';
import {
  User, Mail, MapPin, Briefcase,
  GraduationCap, Award, Code2,
  ChevronRight, ExternalLink, ShieldCheck,
  Fingerprint, Sparkles, Globe,
  CheckCircle2, Clock, Calendar, Lock,
  FileText, History, Search, Hash,
  ArrowLeft, Check, X, Shield, AlertCircle, Save,
  Trash2, Plus, Info, RefreshCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { encryptData, decryptData } from '@/lib/encryption-utils';

export default function ClaimForm() {
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
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
    const localData = localStorage.getItem('proofhire_talent_data');
    if (localData) {
      const decrypted = decryptData(localData);
      if (decrypted) setFormData(decrypted);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const saveToLocal = async () => {
    setSaveStatus('saving');
    try {
      const encryptedData = encryptData(formData);
      localStorage.setItem('proofhire_talent_data', encryptedData);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
      setIsEditing(false);
    } catch (err) {
      console.error('Save failed:', err);
      setSaveStatus('idle');
    }
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experiences: [...prev.experiences, { id: Math.random().toString(36).substring(7), title: '', company: '', years: '', responsibilities: '' }]
    }));
  };

  const handleExperienceChange = (id: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    }));
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tightest">Sovereign Profile</h2>
          <p className="text-zinc-500 text-sm font-medium italic">Manage your private identity data stored locally.</p>
        </div>
        <div className="flex gap-4">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs font-black uppercase tracking-widest hover:border-indigo-500 transition-all"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={saveToLocal}
              disabled={saveStatus === 'saving'}
              className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-3"
            >
              {saveStatus === 'saving' ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saveStatus === 'saved' ? 'Saved' : 'Save Changes'}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Personal Info */}
        <section className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <User className="w-6 h-6 text-indigo-500" />
            <h3 className="text-lg font-black italic uppercase tracking-tighter">Core Identity</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Full Name</label>
              <input
                disabled={!isEditing}
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-indigo-600 outline-none disabled:opacity-50"
                placeholder="Name as it appears on docs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Headline</label>
              <input
                disabled={!isEditing}
                name="headline"
                value={formData.headline}
                onChange={handleInputChange}
                className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-indigo-600 outline-none disabled:opacity-50"
                placeholder="Senior Architect / DevRel"
              />
            </div>
          </div>
        </section>

        {/* Security Warning */}
        <div className="p-8 bg-indigo-600/5 border border-indigo-600/20 rounded-[2.5rem] flex items-start gap-6">
          <div className="p-3 bg-indigo-600 rounded-2xl">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div className="space-y-3">
            <h4 className="font-black italic uppercase tracking-tighter text-indigo-500">Local-Only Execution</h4>
            <p className="text-xs font-medium text-indigo-300/70 leading-relaxed italic">
              All data entered here is encrypted using AES-256 with a key stored only in your browser.
              No raw information is ever transmitted to the network or stored on a server.
              You only anchor cryptographic proof commitments.
            </p>
          </div>
        </div>
      </div>

      {/* Work Experience */}
      <section className="space-y-6">
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <Briefcase className="w-6 h-6 text-indigo-500" />
               <h3 className="text-xl font-black italic uppercase tracking-tighter">Work History</h3>
            </div>
            {isEditing && (
              <button
                onClick={addExperience}
                className="p-2 bg-indigo-600/10 border border-indigo-600/20 text-indigo-500 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
            )}
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formData.experiences.map(exp => (
               <div key={exp.id} className="p-6 bg-zinc-900 border border-zinc-800 rounded-[2rem] space-y-4">
                  <div className="flex justify-between items-start">
                     <input
                        disabled={!isEditing}
                        value={exp.title}
                        onChange={(e) => handleExperienceChange(exp.id, 'title', e.target.value)}
                        className="bg-transparent border-none text-lg font-black italic uppercase text-white outline-none placeholder:text-zinc-800"
                        placeholder="Job Title"
                     />
                  </div>
                  <div className="flex gap-4">
                    <input
                       disabled={!isEditing}
                       value={exp.company}
                       onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                       className="bg-black border border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-bold text-indigo-500 outline-none w-full"
                       placeholder="Company"
                    />
                    <input
                       disabled={!isEditing}
                       type="number"
                       value={exp.years}
                       onChange={(e) => handleExperienceChange(exp.id, 'years', e.target.value)}
                       className="bg-black border border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-bold text-zinc-400 outline-none w-20"
                       placeholder="Years"
                    />
                  </div>
               </div>
            ))}
         </div>
      </section>
    </div>
  );
}
