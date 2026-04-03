import { FetchZkConfigProvider } from "@midnight-ntwrk/midnight-js-fetch-zk-config-provider";
import { httpClientProofProvider } from "@midnight-ntwrk/midnight-js-http-client-proof-provider";
import { indexerPublicDataProvider } from "@midnight-ntwrk/midnight-js-indexer-public-data-provider";
import { levelPrivateStateProvider } from "@midnight-ntwrk/midnight-js-level-private-state-provider";
import {
  deployContract,
  findDeployedContract,
  getPublicStates
} from '@midnight-ntwrk/midnight-js-contracts';

// We assume these are generated and available
let compiledContract: any;
try {
  compiledContract = require('../managed/proof-hire/contract');
} catch (e) {
  console.warn('Compiled contract bindings not found at managed/proof-hire/contract. Run compact compile first.');
}

export const getMidnightProviders = async () => {
  if (typeof window === 'undefined' || !window.midnight?.mnLace) {
    throw new Error('Midnight Lace wallet not found');
  }

  const wallet = window.midnight.mnLace;
  const connectedApi = await wallet.connect('preview');
  const uris = await connectedApi.getConfiguration();
  const walletState = await connectedApi.state();

  return {
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: "proofhire-private-state",
    }),
    zkConfigProvider: new FetchZkConfigProvider(
      window.location.origin,
      fetch.bind(window)
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
        connectedApi.balanceAndProveTransaction(tx, newCoins),
    },
    midnightProvider: {
      submitTx: (tx: any) => connectedApi.submitTransaction(tx),
    },
  };
};

export const deployAndSubmitProof = async (walletCommitment: Uint8Array, privateCredentialData: string, claimType: string) => {
  const providers = await getMidnightProviders();

  const deployed = await deployContract(providers, {
    compiledContract,
    privateStateId: 'proofhire-talent',
    initialPrivateState: {},
  });

  const contractAddress = deployed.deployTxData.public.contractAddress;
  localStorage.setItem('proofhire_contract_address', contractAddress);

  // Submit the proof after deploy
  await (deployed.callTx as any).submitProof(
    walletCommitment,
    privateCredentialData,
    claimType,
    BigInt(Date.now())
  );

  return contractAddress;
};

export const verifyCandidateClaim = async (contractAddress: string, walletCommitment: Uint8Array, claimType: string) => {
  const providers = await getMidnightProviders();

  const existing = await findDeployedContract(providers, {
    compiledContract,
    contractAddress,
    privateStateId: 'proofhire-recruiter',
  });

  const result = await (existing.callTx as any).verifyProof(
    walletCommitment,
    claimType
  );

  return result;
};

export const getLedgerState = async (contractAddress: string) => {
  const providers = await getMidnightProviders();
  return await getPublicStates(providers, contractAddress);
};
