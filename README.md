# ProofHire: Sovereign Talent Network on Midnight

**Privacy-First Hiring Powered by Zero-Knowledge Proofs.**

ProofHire is a decentralized recruitment ecosystem built on the **Midnight Network**. It allows candidates to maintain absolute sovereignty over their personal data while providing mathematically certain proof of their qualifications to recruiters.

---

## 🚀 The Core Innovation
Traditional recruitment involves leaking PII (Personally Identifiable Information) across multiple centralized databases. ProofHire replaces "Trust me, here's my CV" with "Verify the proof on the ledger."

- **Local Sovereignty:** Your data (Name, Bio, Experience) is stored **encrypted with AES-256** in your browser's local state.
- **ZK-Proving:** Proofs are generated locally on your device. Only proof commitments (hashes) are published to the Midnight ledger.
- **Trustless Verification:** Recruiters verify claims through smart contract circuits. They see a "Pass/Fail" result, never your raw data.

---

## 🛠 Tech Stack
- **ZK-Protocol:** [Midnight Network](https://midnight.network/) (Compact v0.22.0)
- **Smart Contract:** `ProofHireContract` (Written in Compact)
- **Wallet Identity:** [Lace Wallet](https://www.lace.io/) (Real dApp-Connector integration)
- **Encryption:** AES-256 local vault via `crypto-js`
- **Frontend:** Next.js 15 (App Router), Tailwind CSS, Framer Motion

---

## 🏗 System Architecture
1. **The Vault:** All talent data is encrypted locally before storage.
2. **The Factory:** Midnight SDK loads ZK proving keys into the browser context to generate Groth16 proofs.
3. **The Ledger:** Proof commitments are anchored to the Midnight testnet.
4. **The Terminal:** Recruiters define requirements and verify incoming commitments against the on-chain state.

---

## 🔧 Installation & Setup

### 1. Prerequisites
- **Node.js:** v18+
- **Midnight SDK:** Installed and configured.
- **Lace Wallet:** Browser extension with Midnight Testnet enabled.

### 2. Deployment of Smart Contract
```bash
# Compile the Compact circuits
compact-cli compile contracts/proof-hire.compact

# Deploy using Midnight SDK
# (Ensure your MIDNIGHT_TESTNET_KEY is set)
npx ts-node scripts/deploy.ts
```

### 3. Frontend Setup
```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Set NEXT_PUBLIC_CONTRACT_ADDRESS to your deployed address

# Run dev server
npm run dev
```

---

## 🧪 Production Verification Flow

### Phase 1: Talent Onboarding (The 7-Step Wizard)
1. **Connect:** Authenticate with Lace Wallet. Sign the identity commitment.
2. **Capture:** Enter your identity, education, and professional history.
3. **Encrypt:** Your data is immediately AES-encrypted in your local storage.
4. **Anchor:** Select a claim (e.g., "5+ Years Experience"). Generate the ZK proof and broadcast the commitment to Midnight.

### Phase 2: Recruiter Command
1. **Target:** Set your "Primary Focus" (e.g., "Senior Rust Engineer").
2. **Browse:** Sync with the global Midnight ledger to see incoming proof commitments.
3. **Verify:** Click "Verify Proof". The system calls the `verifyProof` circuit on the Midnight network to confirm mathematical validity.

---

## 🔒 Security & Privacy Features
- **Zero-Exposure Protocol:** No raw PII ever leaves your device.
- **Selective Reveal:** Choose exactly which verification context to share with specific recruiters via encrypted side-channels.
- **Sovereign Deletion:** Call `clearProfile` to revoke all on-chain commitments.

---

*Built for the Midnight Network Hackathon.*
