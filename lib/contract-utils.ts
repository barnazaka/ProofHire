import { Contract, Witnesses, Ledger, ledger } from '../managed/contract';
import { CircuitContext } from '@midnight-ntwrk/compact-runtime';

// This utility provides a bridge between the React UI and the Midnight Smart Contract
// In a production environment, 'context' would be provided by the Midnight SDK / Lace Wallet
// For this hackathon demo, we provide a structured way to call these circuits

export interface ProofData {
  userAddr: string;
  proofHash: Uint8Array;
  claimType: bigint;
  timestamp: bigint;
}

export class ProofHireContractWrapper {
  private contract: Contract;

  constructor() {
    // Basic witnesses for the ZK circuits
    const witnesses: Witnesses<any> = {};
    this.contract = new Contract(witnesses);
  }

  // Wrappers for the Compact circuits defined in proof-hire.compact

  async registerUser(context: CircuitContext<any>, userAddr: string, commitment: Uint8Array) {
    console.log(`[Midnight] Executing registerUser for ${userAddr}`);
    return this.contract.circuits.registerUser(context, userAddr, commitment);
  }

  async submitProof(context: CircuitContext<any>, proof: ProofData) {
    console.log(`[Midnight] Transmitting cryptographic proof to ledger: Type ${proof.claimType}`);

    // Production SDK Path: 'context' must be a valid CircuitContext from Midnight SDK.
    // We remove the explicit "Demo Mode" fallback to ensure production readiness.
    if (!context || Object.keys(context).length === 0) {
      throw new Error('[Midnight] Midnight SDK Context missing. Connection required for on-chain submission.');
    }

    return this.contract.circuits.submitProof(
      context,
      proof.userAddr,
      proof.proofHash,
      proof.claimType,
      proof.timestamp
    );
  }

  async verifyProof(context: CircuitContext<any>, proof: { proofHash: Uint8Array, userAddr: string }) {
    console.log('[Midnight] Initializing on-chain verification protocol...');

    if (!context || Object.keys(context).length === 0) {
      throw new Error('[Midnight] Midnight SDK Context missing. Connection required for verification.');
    }

    return this.contract.circuits.verifyProof(context, proof.proofHash);
  }

  async grantAccess(context: CircuitContext<any>, recipient: string) {
    // @ts-ignore - added in recent compact update
    if (this.contract.circuits.grantAccess) {
       // @ts-ignore
       return this.contract.circuits.grantAccess(context, recipient);
    }
  }

  async clearProfile(context: CircuitContext<any>) {
    // @ts-ignore - added in recent compact update
    if (this.contract.circuits.clearProfile) {
       // @ts-ignore
       return this.contract.circuits.clearProfile(context);
    }
  }
}

export const proofHireContract = new ProofHireContractWrapper();
