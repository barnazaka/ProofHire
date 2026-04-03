# ProofHire: Privacy-First Talent OS

**Privacy-First Hiring Powered by Zero-Knowledge Proofs on the Midnight Network.**

ProofHire is a decentralized hiring platform that enables candidates to prove their professional qualifications (degrees, experience, skills) without revealing any personal data. It leverages the **Midnight Network** and **Zero-Knowledge Proofs (ZKP)** to ensure that trust is established through mathematical certainty rather than manual background checks.

---

## 🚀 Vision
In the traditional hiring world, personal data is leaked at every stage of the funnel. ProofHire re-engineers this pipeline:
- **Talent** keeps raw data in their browser.
- **ZKP Circuits** run locally to generate proof commitments.
- **Smart Contracts** on Midnight store only the mathematical proofs.
- **Recruiters** verify claims instantly without ever seeing a CV.

---

## 🛠 Tech Stack
- **Blockchain:** [Midnight Network](https://midnight.network/) (Compact v0.22.0)
- **ZK Language:** [Compact](https://compact.midnight.network/)
- **Frontend:** Next.js 15, Tailwind CSS, Framer Motion
- **Wallet:** Lace Wallet (Integration via Midnight SDK)
- **Deployment:** Vercel (Frontend), Midnight Testnet (Smart Contract)

---

## 🏗 Architecture
ProofHire follows a **Stateless Backend** architecture:
1. **Local State:** All candidate credentials (Name, Education, Experience) are stored exclusively in the browser's `localStorage`.
2. **Local Proving:** ZK Proofs are generated on the client-side using the Midnight SDK.
3. **On-Chain Commitment:** Only the proof hash and claim type are submitted to the `ProofHireContract`.
4. **Trustless Verification:** Recruiters call the smart contract to verify a candidate's proof. The result is a binary `Valid` or `Invalid`.

---

## 🔧 Installation & Local Setup

### Prerequisites
- Node.js 18.x or higher
- [Midnight SDK](https://midnight.network/docs/getting-started)
- Lace Wallet (Browser Extension)

### 1. Clone the Repository
```bash
git clone https://github.com/user/proofhire.git
cd proofhire
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file (see `.env.example`):
```env
NEXT_PUBLIC_MIDNIGHT_NETWORK=testnet
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

### 4. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📜 Smart Contract Deployment

The `ProofHireContract` is written in Compact.

1. **Compile the Contract:**
   ```bash
   compact-cli compile contracts/proof-hire.compact
   ```
2. **Deploy to Midnight Testnet:**
   Follow the [Midnight Deployment Guide](https://midnight.network/docs/how-to/deploy-contract) using your Midnight developer keys.

---

## 🧪 Testing & Verification

We use **Playwright** for end-to-end ZK workflow verification.

### Run Talent Proof Generation Test
```bash
npx ts-node tests/verify_proofs.ts
```
*Verifies: Local storage -> ZK Proving sequence -> Ledger Entry.*

### Run Recruiter Verification Test
```bash
npx ts-node tests/verify_recruiter_flow.ts
```
*Verifies: Rule Building -> Ledger Scanning -> On-Chain Verification.*

---

## 🎭 Hackathon Demo Script

Follow these steps for a perfect demo:

### Step 1: The Talent Experience
1. Navigate to the **Landing Page** and click **"I'm a Talent"**.
2. **Connect Lace Wallet:** Experience the secure handshake and address request.
3. **Local Profile:** Fill in "MIT BS in Cryptography" and "5 Years Experience". Save locally.
4. **Proof Factory:** Select "University Degree". Watch the ZK-Circuit initialize, prove locally, and commit to the Midnight ledger.
5. **Ledger History:** See your proof hash appear in the "Talent Ledger History".

### Step 2: The Recruiter Experience
1. Navigate to the **Landing Page** and click **"I'm a Recruiter"**.
2. **Connect Wallet:** Authenticate to enter the **Recruiter OS**.
3. **Rule Builder:** Set a requirement for "Min 2 Years Experience".
4. **ZK Browser:** Find the candidate commitment. Click **"Verify Proof"**.
5. **Mathematical Match:** See the "Valid Proof" status confirmed directly by the Midnight smart contract.

---

## 🔒 Security & Privacy
- **Zero Raw Data Leakage:** Raw input fields never leave the browser's DOM.
- **Stateless interactions:** The platform has no database. User identity is strictly tied to the Lace Wallet address.
- **Protocol Integrity:** Verification is handled by the `proof_hash == pHash` circuit logic on-chain.

---

## 👨‍💻 Author
**Jules** - Senior Software Engineer & Web3 Architect.

*Built for the Midnight Network Hackathon.*
