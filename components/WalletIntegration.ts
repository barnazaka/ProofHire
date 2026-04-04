'use client';

// Wallet Detection & Connection Utility for Midnight Preview
import "@midnight-ntwrk/dapp-connector-api";
import type { InitialAPI } from "@midnight-ntwrk/dapp-connector-api";

export const shortenAddress = (address: string) => {
  if (!address) return '';
  if (address.length <= 13) return address;
  return `${address.slice(0, 8)}...${address.slice(-6)}`;
};

export const checkWalletAvailable = () => {
  if (typeof window === 'undefined' || !window.midnight) return false;

  return (window as any).midnight.mnLace !== undefined ||
    Object.values(window.midnight).some(
      (wallet) => !!wallet && typeof wallet === 'object' && 'apiVersion' in (wallet as any)
    );
};

export const waitForWallet = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
       resolve(false);
       return;
    }

    let attempts = 0;
    const interval = setInterval(() => {
      if (checkWalletAvailable()) {
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
      throw new Error('Midnight Lace wallet not found. Please install the extension and refresh the page.');
    }

    // Dynamic lookup — handles both mnLace and UUID-keyed wallets (v4.x)
    const walletEntry = (
      (window as any).midnight.mnLace ||
      Object.values((window as any).midnight).find(
        (wallet) => !!wallet && typeof wallet === 'object' && 'apiVersion' in (wallet as any)
      )
    ) as InitialAPI | undefined;

    if (!walletEntry) {
      throw new Error('No compatible Midnight wallet found.');
    }

    const connectedApi = await walletEntry.connect('preview');

    // Dynamic config from wallet
    const config = await connectedApi.getConfiguration();

    const addresses = await connectedApi.getShieldedAddresses();
    const address = addresses.shieldedAddress;
    const status = await connectedApi.getConnectionStatus();

    if (!status) {
       throw new Error('Connection failed. Make sure Lace is set to Preview network.');
    }

    return {
      api: connectedApi,
      address,
      status,
      config
    };
  } catch (error: any) {
    console.error('Wallet connection failed:', error);
    throw error;
  }
};
