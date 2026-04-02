# ProofHire - Privacy-First Web3 Hiring Platform

ProofHire is a privacy-first hiring platform powered by **Zero-Knowledge Proofs (ZKPs)** on the **Midnight Network**. It allows candidates to prove their skills and qualifications without revealing any personal identifying information (PII) to recruiters.

## Goal
The application empowers talent to maintain full control over their data while providing recruiters with a mathematically guaranteed way to verify claims (e.g., "Has a degree", "2+ years experience").

## How Zero-Knowledge is Used
- **Local Generation:** All personal data is input by the user and stays in the browser's local storage. ZK proofs are generated locally on the candidate's machine.
- **Commitments:** Only the cryptographic proof commitments and metadata (claim type, timestamp) are sent to the Midnight smart contract.
- **Verification:** Recruiters call the smart contract to verify the proof. The contract returns `true` or `false` based on the mathematical validity of the proof, without ever seeing the raw data used to generate it.

## Key Features
- **Talent Flow:** Local data input, sectioned by category. ZK proof generation with real-time status and on-chain confirmation.
- **Recruiter Flow:** Table-based candidate overview. Instant "Verify On-Chain" results. "Request Reveal" for selective disclosure.
- **Lace Wallet Integration:** Secure authentication and identity management on the Midnight Network with demo fallback.
- **NFT Badges:** Visual skill badges generated for verified technical proofs.

---

## Installation

### Prerequisites
- **Node.js:** v22 or higher
- **Compact Compiler:** v0.22.0+ (Installed via the Midnight toolchain)
- **Lace Wallet:** Chrome extension with Midnight Beta enabled.

### Steps
1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd proof-hire
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install the Midnight Compact Toolchain:**
   ```bash
   curl --proto '=https' --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh
   # Add to PATH: export PATH="$HOME/.local/bin:$PATH"
   ```

---

## Smart Contract

### Compile
Compile the Compact smart contract to generate ZK circuits and TypeScript bindings:
```bash
compact compile contracts/proof-hire.compact managed
```

---

## Frontend

### Local Run
1. Copy the environment example:
   ```bash
   cp .env.example .env.local
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Hackathon Demo Script

Follow these steps for a polished presentation:

### Phase 1: Landing Page
1.  **Overview:** Start at the landing page. Explain that ProofHire solves the privacy issue in hiring using Midnight's ZK technology.
2.  **Navigation:** Click on "For Talent".

### Phase 2: Talent Onboarding (Privacy First)
1.  **Identity:** Click **Connect Lace Wallet**. Show the smooth connection (or demo fallback if extension is not present).
2.  **Data Input:** Fill in the **Education** (e.g., MSc Computer Science) and **Experience** (e.g., 5 years) sections.
3.  **Privacy Check:** Point out that as you type, no network requests are sent. Click **Save Locally**.
4.  **ZK Generation:**
    - Under "Generate Proofs", click **Has a Degree**.
    - Watch the status updates: *Initializing SDK -> Loading Circuits -> Generating Local Proof*.
    - Explain that the math is happening in the browser.
    - Once finished, show the **Verified On-Chain** status and the proof hash.
5.  **NFT Badge:** Click **Solidity Expert**. Once generated, highlight the **NFT Badge Generated** label—visual proof of technical skill.

### Phase 3: Recruiter Verification
1.  **Navigation:** Go back to the home page and click **For Recruiters**.
2.  **Overview:** Show the candidate table. Explain that we see Candidate IDs (like `C-9402`) but no names or raw data.
3.  **Verification:**
    - Find a candidate with a "Pending" status.
    - Click **Verify On-Chain**.
    - Explain that the app is now checking the mathematical proof against the Midnight smart contract.
    - Show the green **Valid** status once returned.
4.  **Selective Disclosure:** Click the **Eye icon (Request Reveal)** next to a proof. Explain that this allows for a privacy-preserving way to request more context if the candidate permits.

---

## Project Structure
- `/contracts`: Compact smart contract source code.
- `/managed`: Generated ZK circuits, keys, and TypeScript bindings.
- `/app`: Next.js application pages (App Router).
- `/components`: Reusable UI components including Wallet and ZK logic.

## Security
- **No Raw Data Leaves Browser:** All PII is restricted to `localStorage`.
- **Encrypted Proofs:** Midnight's ZK primitives ensure only mathematical commitments are on-chain.
- **Selective Disclosure:** Users choose exactly which claims to prove.

Lets gooooooo🚀
