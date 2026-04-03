export interface MidnightWallet {
  name: string;
  icon: string;
  apiVersion: string;
  connect: (networkId: string) => Promise<any>;
}

declare global {
  interface Window {
    midnight?: {
      lace?: MidnightWallet;
    };
  }
}

export const connectLaceWallet = async () => {
  if (typeof window === 'undefined') return null;

  // Real detection logic - Strictly following Midnight dApp Connector API
  if (window.midnight?.lace) {
    try {
      // Request connection as per @midnight-ntwrk/dapp-connector-api
      // For Midnight, usually we connect then get the API
      const api = await window.midnight.lace.connect('midnight-testnet');
      console.log('[Lace] API instance retrieved:', api);

      // Get the unshielded address from the real wallet API
      const address = await api.getUnshieldedAddress();
      console.log('[Lace] Unshielded address:', address);

      return { api, address };
    } catch (error: any) {
      if (error.code === 4001) {
        console.warn('[Lace] User rejected the connection request.');
      } else {
        console.error('[Lace] Wallet connection failed:', error.message);
      }
      return null;
    }
  }

  // Strictly no more simulation logic for production readiness.
  // If the user has Lace, it will work. If not, it returns null.
  console.error('[Lace] Wallet extension NOT detected in window.midnight.lace');
  return null;
};

export const signData = async (address: string, payload: string) => {
  if (typeof window === 'undefined') return null;

  if (window.midnight?.lace) {
    try {
      const api = await window.midnight.lace.connect('midnight-testnet');
      console.log('[Lace] Requesting real signature for payload:', payload);

      // Real signature request via Midnight dapp API
      // Note: Actual method name depends on final Midnight SDK spec,
      // typically signData or signMessage. Using signData as per instructions.
      const signature = await api.signData(payload);
      return signature;
    } catch (error: any) {
      console.error('[Lace] Real signing failed:', error.message);
      return null;
    }
  }

  console.error('[Lace] Cannot sign: Wallet NOT detected');
  return null;
};

export const isLaceInstalled = () => {
  return typeof window !== 'undefined' && !!window.midnight?.lace;
};

// Helper to format addresses for UI
export const shortenAddress = (address: string) => {
  if (!address) return '';
  if (address.length < 15) return address;
  return `${address.slice(0, 10)}...${address.slice(-6)}`;
};
