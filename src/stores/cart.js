import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
    persist: true,

  state: () => ({
    items: [],
  }),

  getters: {
    totalItems: (state) =>
      state.items.reduce((sum, item) => sum + item.quantity, 0),

    totalPrice: (state) =>
      state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
  },

  actions: {
    addToCart(food) {
      const existingItem = this.items.find(
        (item) => item.id === food.id
      );

      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.items.push({
          ...food,
          quantity: 1,
        });
      }
    },

    increaseQuantity(id) {
      const item = this.items.find((i) => i.id === id);

      if (item) {
        item.quantity++;
      }
    },

    decreaseQuantity(id) {
      const item = this.items.find((i) => i.id === id);

      if (!item) return;

      if (item.quantity > 1) {
        item.quantity--;
      } else {
        this.removeItem(id);
      }
    },

    removeItem(id) {
      this.items = this.items.filter(
        (item) => item.id !== id
      );
    },

    clearCart() {
      this.items = [];
    },
  },
});