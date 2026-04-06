# ProofHire: Talent Credential Protocol

**A Privacy-First Recruitment Network on Midnight.**

ProofHire leverages Zero-Knowledge Proofs (ZKP) and WASM-based proving to allow candidates to verify their qualifications (Education, Skills, Experience) without revealing private details.

## 🚀 The ZKP Advantage

Traditional recruitment requires sharing full CVs just for initial screening. ProofHire changes this:
- **Talent** generates proofs locally in the browser.
- **Midnight Network** stores only the cryptographic commitments.
- **Recruiters** verify proofs on-chain with mathematical certainty.

## 🛠 Tech Stack

- **Blockchain**: Midnight Network (Preview Testnet)
- **Smart Contracts**: Compact (ZK-Native)
- **Proving Engine**: `@midnight-ntwrk/wallet-sdk-capabilities` (WASM-based Proving)
- **Wallet**: Midnight Lace
- **Frontend**: Next.js, Tailwind CSS, Framer Motion

## 📋 Features

- **Multi-Step Onboarding**: Blocking ZKP generation for each credential step.
- **WASM Proving**: Proving happens directly in the browser (no proof server required).
- **Sovereign Marketplace**: Discover candidates verified by the Midnight ledger.
- **On-Chain Actions**: Trigger "Hire" events directly on the blockchain.

## 🔧 Setup & Installation

### Prerequisites
- Node.js v20+
- [Midnight Lace Wallet](https://midnight.network/docs/developer-guides/lace-extension) (Set to **Preview Network**, Proof Server: **Remote**)

### Deployment & Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Compile Smart Contract (Compact)**
   The project uses a custom `talent-credential.compact` contract.
   ```bash
   # From the project root
   compact compile contracts/talent-credential.compact contracts/managed/talent-credential
   ```

3. **Environment Variables**
   Create a `.env.local` file in the root:
   ```env
   # Midnight Testnet Configuration
   NEXT_PUBLIC_MIDNIGHT_NETWORK=preview
   NEXT_PUBLIC_INDEXER_URI=https://indexer.preview-testnet.midnight.network/v1/graphql
   NEXT_PUBLIC_NODE_URI=https://rpc.preview-testnet.midnight.network
   NEXT_PUBLIC_PROOF_SERVER_URI=http://localhost:8080
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Build for Production**
   If building for Vercel or production, use the custom webpack flag to handle the Midnight SDK's Node.js dependencies:
   ```bash
   npm run build -- --webpack
   ```

## 🛠 Project Structure

- `contracts/`: Pure Compact source (`.compact`) and compiled artifacts.
- `lib/`: Midnight SDK initialization, WASM proving services, and contract utilities.
- `app/talent/onboarding/`: 6-step wizard for candidate data entry and ZKP generation.
- `app/marketplace/`: Recruiter dashboard for proof verification and candidate discovery.

## 🔒 Security & Privacy

- **Zero-Knowledge**: No PII (Full Name, School Name, Skills) is ever sent to the blockchain. Only cryptographic commitments are stored.
- **Local Storage**: Temporary PII is stored in the browser's `localStorage` and is cleared upon onboarding completion or session reset.
- **WASM Proving**: Unlike traditional dApps that rely on remote proof servers, ProofHire uses `makeWasmProvingService()` to generate proofs entirely within the user's browser, ensuring maximum privacy.

---
Built for the Midnight Ecosystem. "Mathematically Certain, Privacy by Design."
