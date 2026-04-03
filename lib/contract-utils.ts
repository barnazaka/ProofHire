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
    console.log(`[Midnight] Executing submitProof: Type ${proof.claimType}`);

    // DEMO MODE: If we are in a browser environment without a real Midnight CircuitContext,
    // we bypass the actual circuit execution to allow the UI to function for the hackathon demo.
    // In a production environment, 'context' is provided by the Midnight SDK and contains
    // the necessary proving keys and ledger state.
    if (!context || Object.keys(context).length === 0) {
      console.warn('[Midnight] No CircuitContext found. Running in Demo Simulation Mode.');
      return { success: true, txHash: '0x' + Math.random().toString(16).slice(2) };
    }

    return this.contract.circuits.submitProof(
      context,
      proof.userAddr,
      proof.proofHash,
      proof.claimType,
      proof.timestamp
    );
  }

  async verifyProof(context: CircuitContext<any>, hash: Uint8Array) {
    console.log('[Midnight] Executing verifyProof on-chain');
    return this.contract.circuits.verifyProof(context, hash);
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
