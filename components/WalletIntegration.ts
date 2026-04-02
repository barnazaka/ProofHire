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

  if (!window.midnight?.lace) {
    console.error('Lace Wallet extension is not installed or enabled in Beta.');
    return null;
  }

  try {
    // Request connection to Midnight Testnet
    const api = await window.midnight.lace.connect('midnight-testnet');
    console.log('Lace Wallet successfully connected:', api);

    // In a real Midnight dApp, the API provides methods like getAddress, getBalance, etc.
    // For the demo hackathon, we ensure the connection is active and return the API.
    return api;
  } catch (error: any) {
    if (error.code === 4001) {
      console.warn('User rejected the connection request.');
    } else {
      console.error('Lace Wallet connection failed:', error.message);
    }
    return null;
  }
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
