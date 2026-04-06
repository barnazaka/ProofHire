'use client';

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
  if (!isBrowser) return null;

  // Wait for wallet first
  const walletKey = await waitForWallet();
  if (!walletKey) {
    throw new Error('Midnight Lace wallet not detected. Please install and refresh.');
  }

  // Import SDK components
  const { setNetworkId } = await import("@midnight-ntwrk/midnight-js-network-id");
  const { FetchZkConfigProvider } = await import("@midnight-ntwrk/midnight-js-fetch-zk-config-provider");
  const { indexerPublicDataProvider } = await import("@midnight-ntwrk/midnight-js-indexer-public-data-provider");
  const { levelPrivateStateProvider } = await import("@midnight-ntwrk/midnight-js-level-private-state-provider");
  const { httpClientProofProvider } = await import("@midnight-ntwrk/midnight-js-http-client-proof-provider");

  // Connect to wallet and get config
  const midnight = (window as any).midnight![walletKey];
  const connectedApi = await (midnight as any).connect('preview');
  const uris = await (connectedApi as any).getConfiguration();
  const walletState = await (connectedApi as any).state();

  // Ensure network ID is set correctly
  try {
    setNetworkId('preview');
  } catch (e) {
    // Ignore if already set
  }

  return {
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: "proofhire-private-state-v3",
    }),
    zkConfigProvider: new FetchZkConfigProvider(
      window.location.origin,
      fetch.bind(window),
    ),
    proofProvider: httpClientProofProvider(uris.proverServerUri),
    publicDataProvider: indexerPublicDataProvider(
      uris.indexerUri,
      uris.indexerWsUri
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
 * Deployment and Contract Interaction Functions
 */

export const deployTalentContract = async () => {
  if (!isBrowser) return null;

  const { deployContract } = await import('@midnight-ntwrk/midnight-js-contracts');
  const providers = await setupProviders();
  const contractMod = await import('../contracts/managed/proof-hire/contract/index');

  // Witnesses for the contract
  const witnesses = {
    localSecretKey: () => {
        const stored = localStorage.getItem('proofhire_sk');
        if (stored) return new Uint8Array(JSON.parse(stored));
        const sk = crypto.getRandomValues(new Uint8Array(32));
        localStorage.setItem('proofhire_sk', JSON.stringify(Array.from(sk)));
        return sk;
    },
    getSchoolCredential: (context: any) => context.privateState.school || new Uint8Array(32),
    getSkillsCredential: (context: any) => context.privateState.skills || new Uint8Array(32),
    getExperienceCredential: (context: any) => context.privateState.experience || new Uint8Array(32),
    getCertificationsCredential: (context: any) => context.privateState.certs || new Uint8Array(32),
  };

  const deployed = await (deployContract as any)(providers, {
    compiledContract: {
      Contract: contractMod.Contract,
      ledger: contractMod.ledger,
      pureCircuits: contractMod.pureCircuits,
      contractReferenceLocations: contractMod.contractReferenceLocations
    },
    privateStateId: 'proofhire-private-state-v3',
    initialPrivateState: {},
    witnesses,
  });

  const contractAddress = (deployed as any).deployTxData.public.contractAddress;
  localStorage.setItem('talent_credential_contract_address', contractAddress);

  return contractAddress;
};

// --- Generic Call Wrapper with Private State Update ---
const callContractCircuit = async (address: string, circuitName: string, privateStateUpdate?: any, ...args: any[]) => {
    const { findDeployedContract } = await import('@midnight-ntwrk/midnight-js-contracts');
    const providers = await setupProviders();
    const contractMod = await import('../contracts/managed/proof-hire/contract/index');

    const contract = await (findDeployedContract as any)(providers, {
        compiledContract: {
            Contract: contractMod.Contract,
            ledger: contractMod.ledger,
            pureCircuits: contractMod.pureCircuits,
            contractReferenceLocations: contractMod.contractReferenceLocations
        },
        contractAddress: address,
        privateStateId: 'proofhire-private-state-v3',
    });

    if (privateStateUpdate) {
        // Update private state before proving
        const currentState = await providers?.privateStateProvider.get('proofhire-private-state-v3');
        await providers?.privateStateProvider.set('proofhire-private-state-v3', {
            ...currentState,
            ...privateStateUpdate
        });
    }

    return await (contract.callTx as any)[circuitName](...args);
};

// --- Specific Circuit Wrappers (Aligned with UI & Contract) ---

export const proveSchool = (address: string, commitment: Uint8Array) =>
    callContractCircuit(address, 'submitSchoolProof', { school: commitment });

export const proveSkills = (address: string, commitment: Uint8Array) =>
    callContractCircuit(address, 'submitSkillsProof', { skills: commitment });

export const proveExperience = (address: string, commitment: Uint8Array) =>
    callContractCircuit(address, 'submitExperienceProof', { experience: commitment });

export const proveCertifications = (address: string, commitment: Uint8Array) =>
    callContractCircuit(address, 'submitCertificationsProof', { certs: commitment });

export const publishCV = (address: string, name: string) =>
    callContractCircuit(address, 'saveCV');

export const hireCandidate = (address: string) =>
    callContractCircuit(address, 'saveCV'); // Reusing saveCV as a placeholder for 'hire' if ledger update is needed

export const verifySchoolProof = (address: string, commitment: Uint8Array) =>
    callContractCircuit(address, 'verifySchoolProof', null, commitment);

export const verifySkillsProof = (address: string, commitment: Uint8Array) =>
    callContractCircuit(address, 'verifySkillsProof', null, commitment);

export const verifyExperienceProof = (address: string, commitment: Uint8Array) =>
    callContractCircuit(address, 'verifyExperienceProof', null, commitment);
