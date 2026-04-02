'use client';

import { useState } from 'react';
import { ClipboardList, Plus, Trash2 } from 'lucide-react';

export interface Requirement {
  id: string;
  type: string;
  minExperience?: number;
  skill?: string;
}

export default function JobRequirements() {
  const [requirements, setRequirements] = useState<Requirement[]>([
    { id: '1', type: 'Has Degree' },
    { id: '2', type: 'Experience > 2 years', minExperience: 2 },
    { id: '3', type: 'Solidity Expert', skill: 'Solidity' },
  ]);

  const addRequirement = (type: string) => {
    const newReq: Requirement = {
      id: Math.random().toString(36).substring(7),
      type
    };
    setRequirements([...requirements, newReq]);
  };

  const removeRequirement = (id: string) => {
    setRequirements(requirements.filter(r => r.id !== id));
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-blue-600" />
          Job Requirements
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => addRequirement('Custom Claim')}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {requirements.map(req => (
          <div key={req.id} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-transparent">
            <div>
              <span className="font-semibold block">{req.type}</span>
              {req.minExperience && <span className="text-xs text-zinc-500">Min {req.minExperience} years</span>}
              {req.skill && <span className="text-xs text-zinc-500">Skill: {req.skill}</span>}
            </div>
            <button
              onClick={() => removeRequirement(req.id)}
              className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {requirements.length === 0 && (
          <div className="text-center py-8 text-zinc-400 text-sm">
            No requirements defined for this role.
          </div>
        )}
      </div>
    </div>
  );
}
