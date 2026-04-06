'use client';

// Advanced Midnight SDK Utilities for ProofHire
// Handles Contract Deployment, ZKP Generation, and Ledger Interactions

/**
 * FIXED VERSION with all declarations moved to top level
 * and dynamic imports handled within functions to avoid TDZ.
 */

const isBrowser = typeof window !== 'undefined';

// --- Types ---
export type ContractProviders = any;

// --- Helper Functions ---

/**
 * Wait for Midnight Lace wallet to be available in the window object.
 * Supports v0.4.x UUID-style keys.
 */
export const waitForWallet = (): Promise<string | null> => {
  return new Promise((resolve) => {
    if (!isBrowser) return resolve(null);

    let attempts = 0;
    const interval = setInterval(() => {
      const midnight = (window as any).midnight;
      if (midnight) {
        // Try to find mnLace or any UUID key
        const keys = Object.keys(midnight);
        const laceKey = keys.find(k => k === 'mnLace' || /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(k));
        if (laceKey) {
            clearInterval(interval);
            resolve(laceKey);
        }
      }
      attempts++;
      if (attempts > 20) {
        clearInterval(interval);
        resolve(null);
      }
    }, 500);
  });
};

/**
 * Initialize and setup Midnight Providers using dynamic configuration from the wallet.
 */
export const setupProviders = async () => {
  if (!isBrowser) throw new Error('Midnight SDK requires a browser environment.');

  // Wait for wallet first
  const walletKey = await waitForWallet();
  if (!walletKey) {
    throw new Error('Midnight Lace wallet not detected. Please install and refresh.');
  }

  // Import SDK components
  const { setNetworkId } = await import("@midnight-ntwrk/midnight-js-network-id");
  const { FetchZkConfigProvider } = await import("@midnight-ntwrk/midnight-js-fetch-zk-config-provider");
  const { httpClientProofProvider } = await import("@midnight-ntwrk/midnight-js-http-client-proof-provider");
  const { indexerPublicDataProvider } = await import("@midnight-ntwrk/midnight-js-indexer-public-data-provider");
  const { levelPrivateStateProvider } = await import("@midnight-ntwrk/midnight-js-level-private-state-provider");

  // Connect to wallet and get config
  const midnight = (window as any).midnight![walletKey];
  const connectedApi = await (midnight as any).connect('preview');
  const config = await (connectedApi as any).getConfiguration();
  const walletState = await (connectedApi as any).state();

  // Ensure network ID is set correctly
  // Set network to Preview/Testnet
  try {
    (setNetworkId as any)('testnet');
  } catch (e) {
    // Already set or error
  }

  return {
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: "proofhire-private-state-v3",
    }),
    zkConfigProvider: new FetchZkConfigProvider(
      window.location.origin,
      fetch.bind(window),
    ),
    proofProvider: (httpClientProofProvider as any)(config.proverServerUri),
    publicDataProvider: (indexerPublicDataProvider as any)(
      config.indexerUri,
      config.indexerWsUri,
    ),
    walletProvider: {
      coinPublicKey: walletState.coinPublicKey,
      encryptionPublicKey: walletState.encryptionPublicKey,
      balanceTx: (tx: any, newCoins: any) =>
        (connectedApi as any).balanceAndProveTransaction(tx, newCoins),
    },
    midnightProvider: {
      submitTx: (tx: any) => (connectedApi as any).submitTransaction(tx),
    },
  };
};

/**
 * Deploys the ProofHire contract and anchors the user's identity.
 */
export const deployAndAnchorCV = async (secretKey: Uint8Array) => {
  if (!isBrowser) return null;

  const { deployContract } = await import('@midnight-ntwrk/midnight-js-contracts');
  const providers = await setupProviders();

  // Dynamic import with verification to avoid "initialization" errors
  const contractMod = await import('../managed/proof-hire/contract/index');
  if (!contractMod || !contractMod.Contract) {
    throw new Error('Contract module failed to initialize correctly.');
  }

  // Witness for the CV Contract
  const witnesses = {
    localSecretKey: (witnessContext: any) => {
      return [witnessContext.privateState, secretKey];
    },
    getSchoolCredential: (witnessContext: any) => [witnessContext.privateState, new Uint8Array(32)],
    getSkillsCredential: (witnessContext: any) => [witnessContext.privateState, new Uint8Array(32)],
    getExperienceCredential: (witnessContext: any) => [witnessContext.privateState, new Uint8Array(32)],
    getCertificationsCredential: (witnessContext: any) => [witnessContext.privateState, new Uint8Array(32)],
  };

  const deployed = await (deployContract as any)(providers, {
    compiledContract: {
      Contract: contractMod.Contract,
      ledger: contractMod.ledger,
      pureCircuits: contractMod.pureCircuits,
      contractReferenceLocations: contractMod.contractReferenceLocations
    } as any,
    privateStateId: 'proofhire-private-state-v1',
    initialPrivateState: {},
    witnesses,
  });

  const contractAddress = (deployed as any).deployTxData.public.contractAddress;
  localStorage.setItem('proofhire_contract_address', contractAddress);

  return {
    contractAddress,
    deployed
  };
};

/**
 * Submits a school proof to the contract.
 */
export const submitSchoolProof = async (contractAddress: string, schoolCredential: Uint8Array, secretKey: Uint8Array) => {
  if (!isBrowser) return null;

  const { findDeployedContract } = await import('@midnight-ntwrk/midnight-js-contracts');
  const providers = await setupProviders();
  const contractMod = await import('../managed/proof-hire/contract/index');

  const deployed = await (findDeployedContract as any)(providers, {
    compiledContract: {
        Contract: contractMod.Contract,
        ledger: contractMod.ledger,
        pureCircuits: contractMod.pureCircuits,
        contractReferenceLocations: contractMod.contractReferenceLocations
      } as any,
    contractAddress,
    privateStateId: 'proofhire-private-state-v1',
    witnesses: {
        localSecretKey: (witnessContext: any) => [witnessContext.privateState, secretKey],
        getSchoolCredential: (witnessContext: any) => [witnessContext.privateState, schoolCredential],
    }
  });

  return await (deployed.callTx as any).submitSchoolProof();
};

/**
 * Submits a skills proof to the contract.
 */
export const submitSkillsProof = async (contractAddress: string, skillsCredential: Uint8Array, secretKey: Uint8Array) => {
    if (!isBrowser) return null;

    const { findDeployedContract } = await import('@midnight-ntwrk/midnight-js-contracts');
    const providers = await setupProviders();
    const contractMod = await import('../managed/proof-hire/contract/index');

    const deployed = await (findDeployedContract as any)(providers, {
      compiledContract: {
          Contract: contractMod.Contract,
          ledger: contractMod.ledger,
          pureCircuits: contractMod.pureCircuits,
          contractReferenceLocations: contractMod.contractReferenceLocations
        } as any,
      contractAddress,
      privateStateId: 'proofhire-private-state-v1',
      witnesses: {
          localSecretKey: (witnessContext: any) => [witnessContext.privateState, secretKey],
          getSkillsCredential: (witnessContext: any) => [witnessContext.privateState, skillsCredential],
      }
    });

    return await (deployed.callTx as any).submitSkillsProof();
};

/**
 * Submits an experience proof to the contract.
 */
export const submitExperienceProof = async (contractAddress: string, experienceCredential: Uint8Array, secretKey: Uint8Array) => {
    if (!isBrowser) return null;

    const { findDeployedContract } = await import('@midnight-ntwrk/midnight-js-contracts');
    const providers = await setupProviders();
    const contractMod = await import('../managed/proof-hire/contract/index');

    const deployed = await (findDeployedContract as any)(providers, {
      compiledContract: {
          Contract: contractMod.Contract,
          ledger: contractMod.ledger,
          pureCircuits: contractMod.pureCircuits,
          contractReferenceLocations: contractMod.contractReferenceLocations
        } as any,
      contractAddress,
      privateStateId: 'proofhire-private-state-v1',
      witnesses: {
          localSecretKey: (witnessContext: any) => [witnessContext.privateState, secretKey],
          getExperienceCredential: (witnessContext: any) => [witnessContext.privateState, experienceCredential],
      }
    });

    return await (deployed.callTx as any).submitExperienceProof();
};

/**
 * Saves the CV, moving it from DRAFT to LIVE.
 */
export const saveCV = async (contractAddress: string, secretKey: Uint8Array) => {
    if (!isBrowser) return null;

    const { findDeployedContract } = await import('@midnight-ntwrk/midnight-js-contracts');
    const providers = await setupProviders();
    const contractMod = await import('../managed/proof-hire/contract/index');

    const deployed = await (findDeployedContract as any)(providers, {
      compiledContract: {
          Contract: contractMod.Contract,
          ledger: contractMod.ledger,
          pureCircuits: contractMod.pureCircuits,
          contractReferenceLocations: contractMod.contractReferenceLocations
        } as any,
      contractAddress,
      privateStateId: 'proofhire-private-state-v1',
      witnesses: {
          localSecretKey: (witnessContext: any) => [witnessContext.privateState, secretKey],
      }
    });

    return await (deployed.callTx as any).saveCV();
};

/**
 * Verifies a specific school proof using the ZK circuit.
 */
export const verifySchoolProof = async (contractAddress: string, commitment: Uint8Array) => {
  if (!isBrowser) return false;

  const { findDeployedContract } = await import('@midnight-ntwrk/midnight-js-contracts');
  const providers = await setupProviders();

  // Dynamic import with verification
  const contractMod = await import('../managed/proof-hire/contract/index');
  if (!contractMod || !contractMod.Contract) {
    throw new Error('Contract module failed to initialize correctly.');
  }

  const deployed = await (findDeployedContract as any)(providers, {
    compiledContract: {
      Contract: contractMod.Contract,
      ledger: contractMod.ledger,
      pureCircuits: contractMod.pureCircuits,
      contractReferenceLocations: contractMod.contractReferenceLocations
    } as any,
    contractAddress,
    privateStateId: 'proofhire-private-state-v1',
  });

  try {
    const result = await (deployed.callTx as any).verifySchoolProof(commitment);
    return !!result;
  } catch (e) {
    console.error('Verification failed:', e);
    return false;
  }
};

/**
 * Verifies a specific claim using the ZK circuit. (Legacy for compatibility)
 */
export const verifyCVClaim = async (contractAddress: string, expectedHash: Uint8Array) => {
    return verifySchoolProof(contractAddress, expectedHash);
};
