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

  // Real detection logic
  if (window.midnight?.lace) {
    try {
      // Request connection to Midnight Testnet
      const api = await window.midnight.lace.connect('midnight-testnet');
      console.log('Lace Wallet successfully connected:', api);

      // Real Midnight dApp API retrieval
      // @ts-ignore
      const address = await api.getAddress();
      return { api, address };
    } catch (error: any) {
      if (error.code === 4001) {
        console.warn('User rejected the connection request.');
      } else {
        console.error('Lace Wallet connection failed:', error.message);
      }
      return null;
    }
  }

  // Demo Simulation if extension not present
  return new Promise((resolve) => {
    console.log('Simulating Lace Wallet popup...');
    setTimeout(() => {
      const mockAddress = 'addr_midnight_alice_v1_' + Math.random().toString(36).substring(7, 17);
      resolve({ api: {}, address: mockAddress });
    }, 1200);
  });
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
