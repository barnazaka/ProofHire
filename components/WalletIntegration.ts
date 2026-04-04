'use client';

// Wallet Detection & Connection Utility for Midnight Preview
import "@midnight-ntwrk/dapp-connector-api";
import type { InitialAPI } from "@midnight-ntwrk/dapp-connector-api";

export const shortenAddress = (address: string) => {
  if (!address) return '';
  if (address.length <= 13) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const checkWalletAvailable = () => {
  return typeof window !== 'undefined' &&
    (window as any).midnight !== undefined &&
    (window as any).midnight.mnLace !== undefined;
};

export const waitForWallet = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
       resolve(false);
       return;
    }

    let attempts = 0;
    const interval = setInterval(() => {
      if ((window as any).midnight?.mnLace) {
        clearInterval(interval);
        resolve(true);
      }
      attempts++;
      if (attempts > 10) {
        clearInterval(interval);
        resolve(false);
      }
    }, 500);
  });
};

export const connectLaceWallet = async () => {
  if (typeof window === 'undefined') return null;

  try {
    const found = await waitForWallet();
    if (!found) {
      throw new Error('Lace wallet not detected. Make sure the extension is installed and the page is refreshed.');
    }

    const wallet: InitialAPI = (window as any).midnight.mnLace;
    const connectedApi = await wallet.connect('preview');

    const addresses = await connectedApi.getShieldedAddresses();
    const address = addresses.shieldedAddress;
    const status = await connectedApi.getConnectionStatus();

    if (!status) {
       throw new Error('Connection failed. Make sure Lace is set to Preview network.');
    }

    return {
      api: connectedApi,
      address,
      status
    };
  } catch (error: any) {
    console.error('Wallet connection failed:', error);
    throw error;
  }
};
