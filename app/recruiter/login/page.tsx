'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Fingerprint, Loader2 } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { connectLaceWallet, signData } from '@/components/WalletIntegration';
import LacePopup from '@/components/LacePopup';

export default function RecruiterLoginPage() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [connectedAddress, setConnectedAddress] = useState<string | undefined>(undefined);
  const router = useRouter();

  const handleLogin = async () => {
    setIsConnecting(true);
    setStatus('Connecting to Lace...');

    const wallet = await connectLaceWallet() as { api: any, address: string } | null;
    if (wallet) {
      setConnectedAddress(wallet.address);
      setStatus('Signing authentication challenge...');
      const challenge = `ProofHire Recruiter Auth: ${Date.now()}`;
      const signature = await signData(wallet.address, challenge);

      if (signature) {
        setStatus('Access Granted.');
        localStorage.setItem('user_address', wallet.address);
        localStorage.setItem('user_role', 'recruiter');

        setTimeout(() => {
          router.push('/recruiter');
        }, 800);
      } else {
        setStatus('Signing failed. Please try again.');
        setIsConnecting(false);
      }
    } else {
      setStatus('Connection failed.');
      setIsConnecting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black font-sans text-zinc-900 dark:text-white transition-colors duration-300">
      <LacePopup
        isOpen={isConnecting}
        onClose={() => setIsConnecting(false)}
        status={status}
        address={connectedAddress}
      />
      <header className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center backdrop-blur-lg bg-white/50 dark:bg-black/50 border-b border-zinc-200 dark:border-zinc-800">
        <Link href="/launch" className="flex items-center gap-4 group">
          <div className="p-3 bg-zinc-100 dark:bg-zinc-800 group-hover:bg-indigo-600 group-hover:text-white rounded-2xl transition-all">
            <ArrowLeft className="w-6 h-6" />
          </div>
          <span className="text-xl font-black uppercase italic tracking-tighter">Back</span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex flex-col justify-center items-center px-8 py-24">
        <div className="w-full max-w-xl p-16 bg-zinc-50 dark:bg-zinc-900 rounded-[4rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-12 animate-in fade-in zoom-in-95 duration-700">
          <div className="text-center space-y-6">
            <div className="inline-flex p-6 bg-indigo-600 rounded-[2.5rem] shadow-xl shadow-indigo-600/20 mb-4">
              <ShieldCheck className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-5xl font-black uppercase italic tracking-tightest leading-none">Recruiter <br /><span className="text-indigo-600">Terminal.</span></h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 font-medium">
              Access the verification engine via Lace Wallet authentication.
            </p>
          </div>

          <div className="space-y-6">
            <button
              onClick={handleLogin}
              disabled={isConnecting}
              className="w-full flex items-center justify-center gap-4 py-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl font-black uppercase italic tracking-tighter text-xl transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>{status}</span>
                </>
              ) : (
                <>
                  <Fingerprint className="w-7 h-7 transition-transform group-hover:scale-110" />
                  <span>Connect Lace Wallet</span>
                </>
              )}
            </button>

            {status && !isConnecting && (
              <p className="text-center text-red-500 font-bold uppercase italic text-sm tracking-tighter">
                {status}
              </p>
            )}

            <div className="p-8 bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800/50 space-y-4">
               <h4 className="text-sm font-black uppercase italic tracking-wider text-indigo-600">Security Check</h4>
               <ul className="text-xs font-medium text-zinc-500 dark:text-zinc-400 space-y-2">
                 <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-indigo-600 rounded-full" />
                    Verify candidate proofs without PII exposure.
                 </li>
                 <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-indigo-600 rounded-full" />
                    Session remains local to this browser.
                 </li>
                 <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-indigo-600 rounded-full" />
                    Ledger interactions are cryptographic & immutable.
                 </li>
               </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
