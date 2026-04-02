'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Briefcase, Wallet, ShieldCheck, ChevronRight, AlertTriangle } from 'lucide-react';
import JobRequirements from '@/components/JobRequirements';
import ProofVerifier from '@/components/ProofVerifier';
import { connectLaceWallet, isLaceInstalled } from '@/components/WalletIntegration';

export default function RecruiterDashboard() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isLacePresent, setIsLacePresent] = useState(false);

  useEffect(() => {
    setIsLacePresent(isLaceInstalled());
    const savedAddress = localStorage.getItem('proofhire_wallet_recruiter');
    if (savedAddress) {
      setWalletAddress(savedAddress);
      setWalletConnected(true);
    }
  }, []);

  const handleConnect = async () => {
    if (isLacePresent) {
      const api = await connectLaceWallet();
      if (api) {
        const addr = 'addr_midnight_recruiter_connected';
        setWalletAddress(addr);
        setWalletConnected(true);
        localStorage.setItem('proofhire_wallet_recruiter', addr);
        return;
      }
    }

    const mockAddress = 'addr_midnight_recruiter_' + Math.random().toString(36).substring(7);
    setWalletAddress(mockAddress);
    setWalletConnected(true);
    localStorage.setItem('proofhire_wallet_recruiter', mockAddress);
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 font-sans dark:bg-black text-zinc-900 dark:text-zinc-100">
      <header className="px-6 py-4 flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <Link href="/" className="mr-2 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <ShieldCheck className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-bold tracking-tight">ProofHire</span>
          <div className="ml-4 flex items-center gap-1.5 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full text-xs font-bold uppercase tracking-wider border border-zinc-200 dark:border-zinc-700">
            <Briefcase className="w-3.5 h-3.5" />
            Recruiter Dashboard
          </div>
        </div>

        <div>
          {!walletConnected ? (
            <button
              onClick={handleConnect}
              className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 text-white rounded-full font-bold hover:opacity-90 transition-all"
            >
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </button>
          ) : (
            <div className="flex items-center gap-3 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs font-mono font-medium truncate max-w-[120px]">{walletAddress}</span>
              <div className="w-6 h-6 bg-zinc-900 dark:bg-zinc-100 rounded-full border-2 border-white dark:border-zinc-900"></div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-8">
        {!walletConnected ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-6 bg-zinc-100 dark:bg-zinc-900 rounded-full mb-6 border border-zinc-200 dark:border-zinc-800">
              <Briefcase className="w-16 h-16 text-zinc-400" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Recruiter Access</h2>
            <p className="text-zinc-500 max-w-md mb-8 leading-relaxed">
              Sign in with your wallet to manage job requirements and verify candidate credentials securely.
            </p>
            {!isLacePresent && (
              <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center gap-3 text-amber-700 max-w-md mx-auto text-left">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm italic font-medium leading-relaxed">
                  Lace Wallet not detected. Verification will run using a simulated recruiter identity for this demo.
                </p>
              </div>
            )}
            <button
              onClick={handleConnect}
              className="flex items-center gap-3 px-8 py-4 bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 text-white rounded-2xl font-bold text-lg hover:opacity-90 transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLacePresent ? 'Connect Lace Wallet' : 'Use Demo Identity'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
              <JobRequirements />
            </div>
            <div className="lg:col-span-8">
              <ProofVerifier />
            </div>
          </div>
        )}
      </main>

      <footer className="px-6 py-6 border-t border-zinc-200 dark:border-zinc-800 text-center text-zinc-400 text-[10px] uppercase tracking-widest font-bold">
        Zero-Knowledge Verification • Midnight Network • Confidential Hiring
      </footer>
    </div>
  );
}
