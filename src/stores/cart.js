import { defineStore } from "pinia";
import { toast } from "vue3-toastify";

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
      // Prevent ordering from multiple restaurants
      if (this.items.length > 0) {
        const restaurantId = this.items[0].restaurant_id;

        if (restaurantId !== food.restaurant_id) {
          toast.error(
            "You can only order from one restaurant at a time. Please clear your cart first."
          );
          return;
        }
      }

      const existingItem = this.items.find(
        (item) => item.id === food.id
      );

      if (existingItem) {
        existingItem.quantity++;
        toast.success("Quantity updated.");
      } else {
        this.items.push({
          ...food,
          quantity: 1,
        });

        toast.success(`${food.name} added to cart.`);
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
      toast.success("Cart cleared.");
    },
  },
});