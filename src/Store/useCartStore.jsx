import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (dish) => {
        const currentCart = get().cart;
        const existingIndex = currentCart.findIndex(
          (item) => item.id === dish.id
        );
        if (existingIndex > -1) {
          const updated = [...currentCart];
          updated[existingIndex].quantity += 1;
          set({ cart: updated });
        } else {
          set({ cart: [...currentCart, { ...dish, quantity: 1 }] });
        }
      },
      removeFromCart: (id) => {
        set({ cart: get().cart.filter((item) => item.id !== id) });
      },
      clearCart: () => set({ cart: [] }),
    }),
    { name: 'addis-eats-cart' }
  )
);
