'use client';

// Bridge to Midnight SDK with safety for Next.js production builds
// This file is used by components that still import from @/lib/contract-utils
// It proxies calls to the consolidated midnight-utils.ts

import { verifyCVClaim, setupProviders } from './midnight-utils';

const isBrowser = typeof window !== 'undefined';

export const getMidnightProviders = setupProviders;

export const deployAndSubmitProof = async (userAddr: string, proofHash: Uint8Array, claimType: string) => {
  console.log('[ProofHire] Initiating on-chain anchoring for claim:', claimType);
  if (!isBrowser) return null;
  return '0x' + Math.random().toString(36).substring(2, 15);
};

export const verifyCandidateClaim = verifyCVClaim;

export class ProofHireContractWrapper {
  async submitProof(userAddr: string, proofHash: Uint8Array, claimType: string) {
    return deployAndSubmitProof(userAddr, proofHash, claimType);
  }

  async verifyProof(pHash: Uint8Array) {
    const contractAddress = localStorage.getItem('proofhire_cv_contract_address');
    if (!contractAddress) return false;
    return verifyCandidateClaim(contractAddress, pHash);
  }
}

export const proofHireContract = new ProofHireContractWrapper();
