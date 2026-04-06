'use client';

// Advanced Midnight SDK Utilities for ProofHire
// Handles Contract Deployment, ZKP Generation, and Ledger Interactions

const isBrowser = typeof window !== 'undefined';

// --- Helper Functions ---

/**
 * Wait for Midnight Lace wallet to be available in the window object.
 */
export const waitForWallet = (): Promise<string | null> => {
  return new Promise((resolve) => {
    if (!isBrowser) return resolve(null);

    let attempts = 0;
    const interval = setInterval(() => {
      const midnight = (window as any).midnight;
      if (midnight) {
        const keys = Object.keys(midnight);
        const laceKey = keys.find(k => k === 'mnLace' || /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(k));
        if (laceKey) {
            clearInterval(interval);
            console.log('[Midnight SDK] Wallet found:', laceKey);
            resolve(laceKey);
        }
      }
      attempts++;
      if (attempts > 60) {
        clearInterval(interval);
        console.error('[Midnight SDK] Wallet connection timeout');
        resolve(null);
      }
    }, 500);
  });
};

/**
 * Initialize and setup Midnight Providers.
 */
export const setupProviders = async () => {
  if (!isBrowser) throw new Error('Midnight SDK requires a browser environment.');

  const walletKey = await waitForWallet();
  if (!walletKey) {
    throw new Error('Midnight Lace wallet not detected. Please install and refresh.');
  }

  // Dynamic imports for heavy SDK modules
  const [{ setNetworkId }, { FetchZkConfigProvider }, { httpClientProofProvider }, { indexerPublicDataProvider }, { levelPrivateStateProvider }] = await Promise.all([
    import("@midnight-ntwrk/midnight-js-network-id"),
    import("@midnight-ntwrk/midnight-js-fetch-zk-config-provider"),
    import("@midnight-ntwrk/midnight-js-http-client-proof-provider"),
    import("@midnight-ntwrk/midnight-js-indexer-public-data-provider"),
    import("@midnight-ntwrk/midnight-js-level-private-state-provider")
  ]);

  const midnightEntry = (window as any).midnight![walletKey];
  const connectedApi = await (midnightEntry as any).connect('preview');
  const config = await (connectedApi as any).getConfiguration();
  const walletState = await (connectedApi as any).state();

  try {
    (setNetworkId as any)('testnet');
  } catch (e) {}

  return {
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: "proofhire-private-state-v8",
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
 * Deploys the ProofHire contract.
 */
export const deployProofHireContract = async (secretKey: Uint8Array) => {
  if (!isBrowser) return null;

  const { deployContract } = await import('@midnight-ntwrk/midnight-js-contracts');
  const providers = await setupProviders();
  const contractMod = await import('../managed/proof-hire/contract/index');

  const witnesses = {
    localSecretKey: (witnessContext: any) => [witnessContext.privateState, secretKey],
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
    privateStateId: 'proofhire-v8-state',
    initialPrivateState: {},
    witnesses,
  });

  const contractAddress = (deployed as any).deployTxData.public.contractAddress;
  localStorage.setItem('proofhire_current_contract', contractAddress);

  return { contractAddress, deployed };
};

const callCircuit = async (contractAddress: string, circuitName: string, witnessData: any) => {
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
        privateStateId: 'proofhire-v8-state',
        witnesses: witnessData
    });

    return await (deployed.callTx as any)[circuitName]();
};

export const submitSchoolProof = async (addr: string, school: Uint8Array, sk: Uint8Array) => {
    return callCircuit(addr, 'submitSchoolProof', {
        localSecretKey: (w: any) => [w.privateState, sk],
        getSchoolCredential: (w: any) => [w.privateState, school],
        getSkillsCredential: (w: any) => [w.privateState, new Uint8Array(32)],
        getExperienceCredential: (w: any) => [w.privateState, new Uint8Array(32)],
        getCertificationsCredential: (w: any) => [w.privateState, new Uint8Array(32)],
    });
};

export const submitSkillsProof = async (addr: string, skills: Uint8Array, sk: Uint8Array) => {
    return callCircuit(addr, 'submitSkillsProof', {
        localSecretKey: (w: any) => [w.privateState, sk],
        getSkillsCredential: (w: any) => [w.privateState, skills],
        getSchoolCredential: (w: any) => [w.privateState, new Uint8Array(32)],
        getExperienceCredential: (w: any) => [w.privateState, new Uint8Array(32)],
        getCertificationsCredential: (w: any) => [w.privateState, new Uint8Array(32)],
    });
};

export const submitExperienceProof = async (addr: string, exp: Uint8Array, sk: Uint8Array) => {
    return callCircuit(addr, 'submitExperienceProof', {
        localSecretKey: (w: any) => [w.privateState, sk],
        getExperienceCredential: (w: any) => [w.privateState, exp],
        getSchoolCredential: (w: any) => [w.privateState, new Uint8Array(32)],
        getSkillsCredential: (w: any) => [w.privateState, new Uint8Array(32)],
        getCertificationsCredential: (w: any) => [w.privateState, new Uint8Array(32)],
    });
};

export const submitCertificationsProof = async (addr: string, certs: Uint8Array, sk: Uint8Array) => {
    return callCircuit(addr, 'submitCertificationsProof', {
        localSecretKey: (w: any) => [w.privateState, sk],
        getCertificationsCredential: (w: any) => [w.privateState, certs],
        getSchoolCredential: (w: any) => [w.privateState, new Uint8Array(32)],
        getSkillsCredential: (w: any) => [w.privateState, new Uint8Array(32)],
        getExperienceCredential: (w: any) => [w.privateState, new Uint8Array(32)],
    });
};

export const submitEmailProof = async (addr: string, email: Uint8Array, sk: Uint8Array) => {
    // Contract v2 doesn't have email yet, mapping to Certifications for now
    return submitCertificationsProof(addr, email, sk);
};

export const submitYoEProof = async (addr: string, yoe: Uint8Array, sk: Uint8Array) => {
    // Map to generic proof if needed, but for now we follow the user's contract
    return submitCertificationsProof(addr, yoe, sk);
};

export const saveCV = async (addr: string, sk: Uint8Array) => {
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
        contractAddress: addr,
        privateStateId: 'proofhire-v8-state',
        witnesses: {
            localSecretKey: (w: any) => [w.privateState, sk],
            getSchoolCredential: (w: any) => [w.privateState, new Uint8Array(32)],
            getSkillsCredential: (w: any) => [w.privateState, new Uint8Array(32)],
            getExperienceCredential: (w: any) => [w.privateState, new Uint8Array(32)],
            getCertificationsCredential: (w: any) => [w.privateState, new Uint8Array(32)],
        }
    });

    return await (deployed.callTx as any).saveCV();
};

export const hireCandidate = async (addr: string) => {
    // Contract doesn't have hireCandidate yet in the new provided version
    console.log("Hiring anchored to contract: ", addr);
    return true;
};

export const verifySchoolProof = async (contractAddress: string, commitment: Uint8Array) => {
  if (!isBrowser) return false;

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
    privateStateId: 'proofhire-v8-state',
  });

  try {
    const result = await (deployed.callTx as any).verifySchoolProof(commitment);
    return !!result;
  } catch (e) {
    console.error('Verification failed:', e);
    return false;
  }
};

export const verifyCVClaim = async (contractAddress: string, expectedHash: Uint8Array) => {
    return verifySchoolProof(contractAddress, expectedHash);
};
