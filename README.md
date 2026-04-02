# ProofHire - Privacy-First Web3 Hiring Platform

ProofHire is a privacy-first hiring platform powered by **Zero-Knowledge Proofs (ZKPs)** on the **Midnight Network**. It allows candidates to prove their skills and qualifications without revealing any personal identifying information (PII) to recruiters.

## Goal
The application empowers talent to maintain full control over their data while providing recruiters with a mathematically guaranteed way to verify claims (e.g., "Has a degree", "2+ years experience").

---

## What Is Midnight Network?
Midnight is a privacy-first blockchain built as a Cardano sidechain. It supports smart contracts that handle private and public data. Developers write logic using **Compact** and build apps with TypeScript.

### How it Works
- **Privacy First:** Zero-knowledge proofs protect sensitive inputs, which never go on-chain.
- **Local Proof Server:** Processes private data and generates proofs on the user's machine. The chain stores only the proof, not the actual input.
- **Dual Token Structure:**
  - **NIGHT:** Secures the network, handles staking and governance.
  - **DUST:** computational resource token used to execute smart contracts.

---

## Development & Deployment Guide

### Step 1: Set Up the Lace Wallet
1. **Recommended Browser:** Use Google Chrome (version 119+).
2. **Install Lace Wallet:** Add the Lace Wallet extension via the Chrome Web Store.
3. **Create a Wallet:** Secure your 24-word recovery phrase.
4. **Get tDUST Tokens:** Visit the [Midnight Faucet](https://midnight.network/faucet) and paste your address to receive test tokens.

### Step 2: Run the Midnight Proof Server
The proof server generates ZK proofs locally on your machine.
1. Install Docker.
2. Run the server:
   ```bash
   docker run -p 6300:6300 midnightnetwork/proof-server -- 'midnight-proof-server --network testnet'
   ```

### Step 3: Install Development Tools
1. **Node.js:** Use v18+ (via NVM).
   ```bash
   nvm install 18 --lts
   nvm use 18
   ```
2. **Compact Compiler:** Download from the Midnight Testnet release page and add to PATH.
   ```bash
   export COMPACT_HOME="~/midnight-tools/compactc"
   export PATH="$COMPACT_HOME:$PATH"
   ```

### Step 4: Write and Compile the Contract
Our contract is located in `contracts/proof-hire.compact`. It defines the logic for talent registration and proof submission.

**Compile command:**
```bash
compact compile contracts/proof-hire.compact managed
```
This generates:
- Compiled contract artifact
- ZK proof logic and metadata
- TypeScript bindings for the frontend

### Step 5: Deploy to Midnight Testnet
Use the Midnight CLI to deploy the compiled contract:
```bash
midnight deploy --contract managed/contract/index.json --wallet <your-wallet-address> --network testnet
```
*Note: You will need to sign the transaction using your Lace wallet with tDUST.*

---

## Running the Frontend Locally
1. Install dependencies: `npm install`
2. Copy env: `cp .env.example .env.local`
3. Start dev server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000)

---

## Hackathon Demo Script

### Phase 1: Landing Page & Theme
- Show the all-black professional landing page.
- Toggle between **Dark** and **Light** modes using the sun/moon icon.
- Navigate through the "Protocol", "Privacy", and "Features" sections.

### Phase 2: Talent OS Login
- Click **Launch App** or **Talent Login**.
- Click **Connect Lace Wallet**. Watch the 1.2s authentication simulation (or real Lace popup).
- Once logged in, click the wallet address to see the **Copy Address** and **Logout** options.

### Phase 3: ZK Proof Generation
- Fill in your local data (Education, Skills).
- Generate a "Has Degree" proof.
- Explain that the **Proof Server** is running locally and no data has left your machine.

### Phase 4: Recruiter Verification
- Switch to the **Recruiter Dashboard**.
- Click **Verify** on a candidate proof.
- Show the "Valid" result confirmed by the Midnight smart contract on the testnet.

---
Built with ❤️ for the Midnight Hackathon.
