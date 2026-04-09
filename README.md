# ProofHire Protocol Outdated...... Theres a new one

**The First Privacy-First Decentralized Recruitment Network on Midnight.**

ProofHire allows candidates to prove their qualifications, skills, and experience without revealing a single byte of Personal Identifiable Information (PII). Powered by Zero-Knowledge Proofs (ZKP) on the Midnight Network.

## 🚀 Vision

Traditional hiring is broken. Candidates must expose their full identities (CVs, LinkedIn, Degrees) just to verify they meet basic job requirements. ProofHire flips the script:

1.  **Candidate Input**: Enter data locally. It stays in your browser.
2.  **ZK Proof Generation**: Your browser generates a mathematical proof of your claim (e.g., "I have a CS Degree").
3.  **On-Chain Anchoring**: Only the proof commitment is stored on the Midnight ledger.
4.  **Recruiter Verification**: Recruiters verify your claims against the ledger with cryptographic certainty. No PII is exchanged until you decide to reveal it.

## 🛠 Tech Stack

-   **Blockchain**: Midnight Network (Cardano sidechain)
-   **Smart Contracts**: Compact v0.22.0
-   **ZK Proofs**: Client-side proving via Midnight SDK
-   **Wallet**: Lace Wallet (Midnight Preview)
-   **Frontend**: Next.js 16, Tailwind CSS, Framer Motion
-   **Encryption**: AES-256 for local browser storage

## 📋 Features

-   **Sovereign Identity**: Your wallet address is your ID.
-   **Multi-Step Onboarding**: Comprehensive talent profile wizard.
-   **Proof Factory**: Generate proofs for degrees, years of experience, and technical skills.
-   **Recruiter Dashboard**: Create requirements and verify candidate claims.
-   **Selective Reveal**: Encrypted communication channel for optional data sharing.
-   **NFT Badges**: Automatic badge minting for verified high-tier skills (Solidity, etc.).

## 🔧 Installation & Setup

### Prerequisites

-   [Node.js](https://nodejs.org/) (v20+)
-   [Midnight Lace Wallet](https://chromewebstore.google.com/detail/lace/gafhhkghbfjjkeiendhlofajokpaflmk) (Connected to Preview Network)
-   [Midnight SDK](https://midnight.network/docs/developer-guides/sdk-setup)

### Configuring Lace Wallet for Preview Network

1. Open the Lace wallet extension in Chrome
2. Go to Settings > Midnight
3. Set Network to Preview
4. Select Proof Server: Remote
5. Click Save configuration
6. Refresh the ProofHire app page
7. Click Connect Lace Wallet

### Getting Test Tokens

1. Visit https://faucet.preview.midnight.network to get tNIGHT tokens
2. Open Lace wallet, go to Tokens, click Generate tDUST for transaction fees

### Local Development

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-repo/proof-hire.git
    cd proof-hire
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Compile Smart Contracts**
    ```bash
    compact compile contracts/proof-hire.compact managed/proof-hire/contract
    ```

4.  **Setup Environment Variables**
    Create a `.env.local` file:
    ```env
    NEXT_PUBLIC_ENCRYPTION_KEY=your_secret_32_char_key
    NEXT_PUBLIC_MIDNIGHT_NETWORK=preview
    ```

5.  **Run Development Server**
    ```bash
    npm run dev
    ```

6.  **Visit [http://localhost:3000](http://localhost:3000)**

## 🛡 Security & Privacy

-   **Zero Raw Data On-Chain**: We never send names, emails, or exact CV data to the blockchain.
-   **Local Proving**: Proofs are generated on the user's machine, not a server.
-   **Encrypted Storage**: Local browser data is secured with AES-256. If you clear your browser data, your PII is gone forever (sovereign ownership).

## 🚀 Deployment (Vercel)

ProofHire is optimized for Vercel.

1.  Push your code to GitHub.
2.  Connect the repository to Vercel.
3.  Add the environment variables from `.env.example`.
4.  Deployment will automatically use the optimized Webpack configuration for Midnight WASM modules.

---

Built for the **Midnight Hackathon 2026** by Jules.
"Mathematically certain, Privacy by default."
