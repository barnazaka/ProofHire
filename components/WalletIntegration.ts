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
    console.warn('Lace Wallet not found in browser');
    return null;
  }

  try {
    const api = await window.midnight.lace.connect('midnight-testnet');
    console.log('Connected to Lace Wallet', api);
    return api;
  } catch (error) {
    console.error('Failed to connect to Lace Wallet', error);
    return null;
  }
};

export const isLaceInstalled = () => {
  return typeof window !== 'undefined' && !!window.midnight?.lace;
};
