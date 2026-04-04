'use client';

// Removed explicit global augmentation to avoid type conflicts with SDK
// Interface is handled via type assertions in the connect function

export const shortenAddress = (address: string) => {
  if (!address) return '';
  if (address.length <= 13) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const connectLaceWallet = async () => {
  if (typeof window === 'undefined') return null;

  try {
    const midnight = (window as any).midnight;
    if (!midnight?.mnLace) {
      throw new Error('Midnight Lace wallet not found. Please install the extension.');
    }

    const api = await midnight.mnLace.connect('preview');
    const state = await api.state();

    // Use the coin public key as a proxy for the address in this demo
    const address = state.coinPublicKey;

    return {
      api,
      address,
      state
    };
  } catch (error: any) {
    console.error('Wallet connection failed:', error);
    throw error;
  }
};
