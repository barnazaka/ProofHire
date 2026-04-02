import Link from "next/link";
import { ShieldCheck, UserCircle, Briefcase } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 font-sans dark:bg-black text-zinc-900 dark:text-zinc-100">
      <header className="px-6 py-4 flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-bold tracking-tight">ProofHire</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="max-w-3xl space-y-8">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
            Privacy-First Hiring on <span className="text-blue-600">Midnight</span>
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Prove your skills and qualifications without revealing personal data.
            Powered by Zero-Knowledge Proofs on the Midnight Network.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8">
            <Link
              href="/talent"
              className="group flex flex-col items-center p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 transition-all"
            >
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-4 group-hover:bg-blue-100 transition-colors">
                <UserCircle className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">For Talent</h2>
              <p className="text-zinc-500">
                Input your credentials locally, generate proofs, and share securely.
              </p>
            </Link>

            <Link
              href="/recruiter"
              className="group flex flex-col items-center p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 transition-all"
            >
              <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-4 group-hover:bg-zinc-200 transition-colors">
                <Briefcase className="w-10 h-10 text-zinc-600 dark:text-zinc-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">For Recruiters</h2>
              <p className="text-zinc-500">
                Verify candidate claims instantly without accessing raw sensitive data.
              </p>
            </Link>
          </div>
        </div>
      </main>

      <footer className="px-6 py-8 border-t border-zinc-200 dark:border-zinc-800 text-center text-zinc-500 text-sm">
        <p>&copy; {new Date().getFullYear()} ProofHire. Built on Midnight Network.</p>
      </footer>
    </div>
  );
}
