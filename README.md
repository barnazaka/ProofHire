# ProofHire: Privacy-First Web3 Hiring Platform on Midnight

ProofHire is a privacy-first Web3 hiring platform powered by Zero-Knowledge Proofs (ZKPs) on the Midnight Network. It allows candidates to prove skills and qualifications without revealing personal data. Raw data stays in the browser; only proof commitments and metadata go on-chain.

## How Zero Knowledge is Used

1. **Local Proof Generation:** All ZK proofs are generated in the candidate's browser using the Midnight SDK and the Compact smart contract runtime. Raw PII (name, email, degree details) is never transmitted.
2. **On-Chain Commitments:** Only the cryptographic commitment (a hash) of the candidate's credentials and the specific claim type (e.g., "Has Degree") are stored on the Midnight ledger.
3. **Trustless Verification:** Recruiters call the `verifyProof` circuit. The Midnight network confirms the validity of the proof against the on-chain commitment without exposing any of the underlying private data to the recruiter or the public.

## Prerequisites

- **Lace Wallet (Midnight Preview):** You must have the Lace wallet extension installed and configured for the Midnight Preview network. [Download Lace](https://midnight.network/lace).
- **tDUST Tokens:** Obtain tDUST from the [Midnight Preview Faucet](https://faucet.preview.midnight.network/).
- **Docker:** Required to run the local proof server.

## Installation & Setup

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Run the local proof server (Docker):**
   ```bash
   docker run -p 6300:6300 midnightntwrk/proof-server:latest
   ```

3. **Compile the Compact Smart Contract:**
   ```bash
   # In the root directory
   npx compact compile contracts/proof-hire.compact contracts/managed/proof-hire
   ```

4. **Copy generated artifacts to public folder:**
   ```bash
   mkdir -p public/keys public/zkir
   cp -r contracts/managed/proof-hire/keys/* ./public/keys/
   cp -r contracts/managed/proof-hire/zkir/* ./public/zkir/
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

## Hackathon Demo Steps

### Talent Flow (Generate & Store Proof)
1. Navigate to `/talent/auth` and connect your Lace Wallet.
2. Fill out the **7-step Onboarding Wizard**.
3. On Step 7, click **"Generate ZK Proof and Deploy to Chain"**.
4. Lace Wallet will prompt you to authorize the deployment and the `submitProof` transaction.
5. Once complete, the contract address will be saved to your local dashboard.

### Recruiter Flow (Verify Proof)
1. Navigate to `/recruiter/auth` and connect your Lace Wallet.
2. Navigate to the **Public Ledger Browser**.
3. Select a candidate's proof commitment.
4. Click **"Verify Claim"**.
5. The system calls the `verifyProof` circuit on the Midnight ledger.
6. The result will display as **"Valid Proof"** without showing any personal details of the candidate.

## Environment Variables

Copy `.env.example` to `.env.local` and configure as needed:
```
NEXT_PUBLIC_NETWORK_ID=preview
NEXT_PUBLIC_CONTRACT_ADDRESS=  # Leave empty; populated after first talent deployment
```

## SDK Information
- **Midnight SDK:** v3.0.0
- **Compact Runtime:** v0.14.0
- **Lace Connector API:** v4.0.1
