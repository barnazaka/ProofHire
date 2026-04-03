'use client';

import { useState, useEffect } from 'react';
import { Save, CheckCircle2, GraduationCap, Briefcase, Code2, Award, ChevronDown, ChevronUp } from 'lucide-react';

export interface TalentData {
  fullName: string;
  education: string;
  yearsExperience: number;
  skills: string;
  certifications: string;
}

const STORAGE_KEY = 'proofhire_talent_data';

export default function ClaimForm() {
  const [formData, setFormData] = useState<TalentData>({
    fullName: '',
    education: '',
    yearsExperience: 0,
    skills: '',
    certifications: '',
  });
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    personal: true,
    education: true,
    experience: true,
    skills: true,
    certs: true
  });

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const { decryptData } = require('@/lib/encryption-utils');
      let parsed;
      try {
        parsed = JSON.parse(savedData);
      } catch (e) {
        parsed = decryptData(savedData);
      }
      if (parsed) setFormData(parsed);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'yearsExperience' ? parseInt(value) || 0 : value,
    }));
    setSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const { encryptData } = require('@/lib/encryption-utils');
    const encrypted = encryptData(formData);
    localStorage.setItem(STORAGE_KEY, encrypted);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleSection = (section: string) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const SectionHeader = ({ id, icon: Icon, title, isClaimable = true }: { id: string, icon: any, title: string, isClaimable?: boolean }) => (
    <div
      className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
      onClick={() => toggleSection(id)}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="font-bold text-lg">{title}</h3>
      </div>
      <div className="flex items-center gap-4">
        {isClaimable && (
          <div className="flex items-center gap-2 px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 text-[10px] font-bold rounded uppercase">
            Claimable
          </div>
        )}
        {expanded[id] ? <ChevronUp className="w-5 h-5 text-zinc-400" /> : <ChevronDown className="w-5 h-5 text-zinc-400" />}
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
        <h2 className="text-2xl font-bold mb-1">Local Credentials</h2>
        <p className="text-zinc-500 text-sm italic">
          Data is stored in browser memory only.
        </p>
      </div>

      <form onSubmit={handleSave} className="flex-1 overflow-auto">
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {/* Personal Info */}
          <section>
            <SectionHeader id="personal" icon={Briefcase} title="Personal Info" isClaimable={false} />
            {expanded.personal && (
              <div className="p-4 pt-0 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="E.g. Satoshi Nakamoto"
                    required
                  />
                </div>
              </div>
            )}
          </section>

          {/* Education */}
          <section>
            <SectionHeader id="education" icon={GraduationCap} title="Education" />
            {expanded.education && (
              <div className="p-4 pt-0 space-y-4">
                <div className="flex items-start gap-3 p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl mb-4 border border-blue-100/50 dark:border-blue-900/20">
                  <input type="checkbox" className="mt-1" defaultChecked />
                  <span className="text-xs text-blue-800 dark:text-blue-300">Allow generating proof for &quot;Has a Degree&quot;</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Highest Degree</label>
                  <input
                    type="text"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="E.g. PhD in Cryptography"
                  />
                </div>
              </div>
            )}
          </section>

          {/* Experience */}
          <section>
            <SectionHeader id="experience" icon={Briefcase} title="Experience" />
            {expanded.experience && (
              <div className="p-4 pt-0 space-y-4">
                <div className="flex items-start gap-3 p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl mb-4 border border-blue-100/50 dark:border-blue-900/20">
                  <input type="checkbox" className="mt-1" defaultChecked />
                  <span className="text-xs text-blue-800 dark:text-blue-300">Allow generating proof for &quot;Years &gt; X&quot;</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Years of Experience</label>
                  <input
                    type="number"
                    name="yearsExperience"
                    value={formData.yearsExperience}
                    onChange={handleChange}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    min="0"
                  />
                </div>
              </div>
            )}
          </section>

          {/* Skills */}
          <section>
            <SectionHeader id="skills" icon={Code2} title="Skills" />
            {expanded.skills && (
              <div className="p-4 pt-0 space-y-4">
                <div className="flex items-start gap-3 p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl mb-4 border border-blue-100/50 dark:border-blue-900/20">
                  <input type="checkbox" className="mt-1" defaultChecked />
                  <span className="text-xs text-blue-800 dark:text-blue-300">Allow generating proof for specific skills</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Skills (Comma separated)</label>
                  <textarea
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    rows={3}
                    placeholder="React, Midnight, Rust, ZK"
                  />
                </div>
              </div>
            )}
          </section>

          {/* Certifications */}
          <section>
            <SectionHeader id="certs" icon={Award} title="Certifications" />
            {expanded.certs && (
              <div className="p-4 pt-0 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Certifications</label>
                  <textarea
                    name="certifications"
                    value={formData.certifications}
                    onChange={handleChange}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    rows={2}
                  />
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 sticky bottom-0">
          <button
            type="submit"
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-md active:scale-[0.98]"
          >
            {saved ? <CheckCircle2 className="w-5 h-5 text-white" /> : <Save className="w-5 h-5" />}
            {saved ? 'Credentials Saved' : 'Save Locally'}
          </button>
        </div>
      </form>
    </div>
  );
}
