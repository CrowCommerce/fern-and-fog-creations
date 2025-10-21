import { create } from 'zustand';

type ProductState = {
  [key: string]: string;
} & {
  image?: string;
};

interface ProductStoreState {
  state: ProductState;
  setOptions: (options: ProductState) => void;
  updateOption: (name: string, value: string) => void;
  updateImage: (index: string) => void;
  resetOptions: () => void;
}

export const useProductStore = create<ProductStoreState>((set) => ({
  state: {},
  setOptions: (options) => set({ state: options }),
  updateOption: (name, value) =>
    set((state) => ({
      state: { ...state.state, [name]: value }
    })),
  updateImage: (index) =>
    set((state) => ({
      state: { ...state.state, image: index }
    })),
  resetOptions: () => set({ state: {} })
}));

