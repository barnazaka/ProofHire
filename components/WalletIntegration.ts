import '@midnight-ntwrk/dapp-connector-api';
import type { InitialAPI, DAppConnectorAPI } from '@midnight-ntwrk/dapp-connector-api';

declare global {
  interface Window {
    midnight?: {
      mnLace?: InitialAPI;
    };
  }
}

const NETWORK_ID = 'preview';

export interface WalletConnection {
  api: DAppConnectorAPI;
  address: string;
}

export const connectLaceWallet = async (): Promise<WalletConnection | null> => {
  if (typeof window === 'undefined') return null;

  // Real detection logic - Strictly following Midnight mnLace dApp Connector API
  if (window.midnight?.mnLace) {
    try {
      const wallet: InitialAPI = window.midnight.mnLace;
      console.log('[Lace] Initial API found. Version:', wallet.apiVersion);

      const connectedApi = await wallet.connect(NETWORK_ID);
      const connectionStatus = await connectedApi.getConnectionStatus();

      if (!connectionStatus) {
        console.error('[Lace] Connection established but status is false.');
        return null;
      }

      // Retrieve shielded address for privacy-first operations
      const addresses = await connectedApi.getShieldedAddresses();
      const address = addresses.shieldedAddress;

      console.log('[Lace] Connected to wallet:', address);

      return { api: connectedApi, address };
    } catch (error: any) {
      if (error.code === 4001) {
        console.warn('[Lace] User rejected the connection request.');
      } else {
        console.error('[Lace] Wallet connection failed:', error.message || error);
      }
      return null;
    }
  }

  console.error('[Lace] Wallet extension NOT detected in window.midnight.mnLace');
  return null;
};

export const isLaceInstalled = () => {
  return typeof window !== 'undefined' && !!window.midnight?.mnLace;
};

export const shortenAddress = (address: string) => {
  if (!address) return '';
  if (address.length < 15) return address;
  return `${address.slice(0, 8)}...${address.slice(-6)}`;
};
