<script setup>
import { useCartStore } from "../stores/cart";

const cartStore = useCartStore();
</script>

<template>
  <RouterLink
    v-if="cartStore.totalItems > 0"
    to="/cart"
    class="cart-button"
  >
    <span>
      🛒 {{ cartStore.totalItems }} item(s)
    </span>

    <strong>
      ₦{{ cartStore.totalPrice }}
    </strong>
  </RouterLink>
</template>

<style scoped>
.cart-button {
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 15px;

  background: #00a082;
  color: white;

  border-radius: 15px;

  text-decoration: none;

  z-index: 999;
}
</style>