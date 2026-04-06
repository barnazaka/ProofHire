'use client';

const isBrowser = typeof window !== 'undefined';

export const setupProviders = async () => {
  if (!isBrowser) return null;

  const { setNetworkId } = await import("@midnight-ntwrk/midnight-js-network-id");
  const { FetchZkConfigProvider } = await import("@midnight-ntwrk/midnight-js-fetch-zk-config-provider");
  const { indexerPublicDataProvider } = await import("@midnight-ntwrk/midnight-js-indexer-public-data-provider");
  const { levelPrivateStateProvider } = await import("@midnight-ntwrk/midnight-js-level-private-state-provider");
  const { makeWasmProvingService } = await import("@midnight-ntwrk/wallet-sdk-capabilities");

  // Set network to Preview
  try {
    setNetworkId('preview');
  } catch (e) {
    // Already set or error
  }

  // Find Midnight Lace wallet dynamically (DApp Connector API v4.x)
  const midnight = (window as any).midnight;
  if (!midnight) {
     throw new Error('Midnight Lace wallet not found. Please install the extension.');
  }

  const walletEntry = midnight.mnLace || Object.values(midnight).find(
    (w: any) => !!w && typeof w === 'object' && 'apiVersion' in w
  );

  if (!walletEntry) {
    throw new Error('Midnight Lace wallet entry not found.');
  }

  const connectedApi = await (walletEntry as any).connect();
  const walletState = await (connectedApi as any).state();

  const indexerUri = "https://indexer.preview.midnight.network/api/v4/graphql";
  const indexerWsUri = "wss://indexer.preview.midnight.network/api/v4/graphql";

  return {
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: "talent-credential-private-state-v1",
    }),
    zkConfigProvider: new FetchZkConfigProvider(
      window.location.origin,
      fetch.bind(window),
    ),
    proofProvider: makeWasmProvingService(),
    publicDataProvider: indexerPublicDataProvider(
      indexerUri,
      indexerWsUri,
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

export const deployTalentContract = async () => {
  if (!isBrowser) return null;

  const { deployContract } = await import('@midnight-ntwrk/midnight-js-contracts');
  const providers = await setupProviders();
  const contractMod = await import('../contracts/managed/talent-credential/contract/index');

  const witnesses = {
    getSchoolData: (witnessContext: any) => [witnessContext.privateState, "hidden"],
    getSkillsData: (witnessContext: any) => [witnessContext.privateState, "hidden"],
    getExperienceData: (witnessContext: any) => [witnessContext.privateState, "hidden"],
  };

  const deployed = await (deployContract as any)(providers, {
    compiledContract: {
      Contract: contractMod.Contract,
      ledger: contractMod.ledger,
      pureCircuits: contractMod.pureCircuits,
      contractReferenceLocations: contractMod.contractReferenceLocations
    },
    privateStateId: 'talent-credential-private-state-v1',
    initialPrivateState: {},
    witnesses: witnesses,
  });

  const contractAddress = (deployed as any).deployTxData.public.contractAddress;
  localStorage.setItem('talent_credential_contract_address', contractAddress);

  return contractAddress;
};

export const publishCV = async (address: string, name: string) => {
  const { findDeployedContract } = await import('@midnight-ntwrk/midnight-js-contracts');
  const providers = await setupProviders();
  const contractMod = await import('../contracts/managed/talent-credential/contract/index');

  const contract = await (findDeployedContract as any)(providers, {
    compiledContract: {
      Contract: contractMod.Contract,
      ledger: contractMod.ledger,
      pureCircuits: contractMod.pureCircuits,
      contractReferenceLocations: contractMod.contractReferenceLocations
    },
    contractAddress: address,
    privateStateId: 'talent-credential-private-state-v1',
  });

  return await (contract.callTx as any).publishCV(name);
};

export const proveSchool = async (address: string, commitment: Uint8Array) => {
    const { findDeployedContract } = await import('@midnight-ntwrk/midnight-js-contracts');
    const providers = await setupProviders();
    const contractMod = await import('../contracts/managed/talent-credential/contract/index');

    const contract = await (findDeployedContract as any)(providers, {
      compiledContract: {
        Contract: contractMod.Contract,
        ledger: contractMod.ledger,
        pureCircuits: contractMod.pureCircuits,
        contractReferenceLocations: contractMod.contractReferenceLocations
      },
      contractAddress: address,
      privateStateId: 'talent-credential-private-state-v1',
    });

    return await (contract.callTx as any).proveSchool(commitment);
};

export const proveSkills = async (address: string, commitment: Uint8Array) => {
    const { findDeployedContract } = await import('@midnight-ntwrk/midnight-js-contracts');
    const providers = await setupProviders();
    const contractMod = await import('../contracts/managed/talent-credential/contract/index');

    const contract = await (findDeployedContract as any)(providers, {
      compiledContract: contractMod,
      contractAddress: address,
      privateStateId: 'talent-credential-private-state-v1',
    });

    return await (contract.callTx as any).proveSkills(commitment);
};

export const proveExperience = async (address: string, commitment: Uint8Array) => {
    const { findDeployedContract } = await import('@midnight-ntwrk/midnight-js-contracts');
    const providers = await setupProviders();
    const contractMod = await import('../contracts/managed/talent-credential/contract/index');

    const contract = await (findDeployedContract as any)(providers, {
      compiledContract: contractMod,
      contractAddress: address,
      privateStateId: 'talent-credential-private-state-v1',
    });

    return await (contract.callTx as any).proveExperience(commitment);
};

export const hireCandidate = async (address: string) => {
    const { findDeployedContract } = await import('@midnight-ntwrk/midnight-js-contracts');
    const providers = await setupProviders();
    const contractMod = await import('../contracts/managed/talent-credential/contract/index');

    const contract = await (findDeployedContract as any)(providers, {
      compiledContract: contractMod,
      contractAddress: address,
      privateStateId: 'talent-credential-private-state-v1',
    });

    return await (contract.callTx as any).hireCandidate();
};
