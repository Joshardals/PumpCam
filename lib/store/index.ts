import { create } from "zustand";
import { createOrUpdateUser } from "../database";

interface WalletStore {
  walletAddress: string | null;
  setWalletAddress: (address: string | null) => Promise<void>; 
}

export const useWalletStore = create<WalletStore>((set) => ({
  walletAddress: null,
  setWalletAddress: async (address) => {
    if (address) {
      await createOrUpdateUser(address);
    }
    set({ walletAddress: address });
  },
}));