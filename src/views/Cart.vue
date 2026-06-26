<script setup>
import { useCartStore } from "../stores/cart";
import { useRouter } from "vue-router";

const cartStore = useCartStore();
const router = useRouter();





const removeItem = (itemId) => {
  cartStore.items = cartStore.items.filter(item => item.id !== itemId);
};
</script>

<template>
  <div style="background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%); min-height: 100vh;">
    <!-- HEADER -->
    <div style="background: white; padding: 1.5rem 0; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
      <div class="container">
        <h1 style="margin: 0; font-size: 1.8rem;">🛒 Shopping Cart</h1>
        <p style="margin: 0.5rem 0 0 0; color: #999; font-size: 0.9rem;">{{ cartStore.items.length }} item(s) in cart</p>
      </div>
    </div>

    <div class="container" style="padding: 2rem 1rem;">
      <!-- EMPTY CART STATE -->
      <div v-if="cartStore.items.length === 0" class="text-center py-5">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🛒</div>
        <h3 style="margin-bottom: 0.5rem;">Your cart is empty</h3>
        <p style="color: #999; margin-bottom: 2rem; font-size: 0.95rem;">Add some delicious food to get started!</p>
        <router-link to="/" class="btn btn-primary" style="padding: 0.75rem 2rem;">Continue Shopping</router-link>
      </div>

      <!-- CART ITEMS -->
      <div v-else style="display: grid; grid-template-columns: 1fr auto; gap: 2rem;">
        <!-- ITEMS LIST -->
        <div>
          <div style="margin-bottom: 1rem;">
            <h3 style="margin: 0 0 1.5rem 0;">Your Items</h3>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="card"
              style="padding: 1.5rem; border-radius: 16px; display: flex; flex-direction: row; gap: 1rem; align-items: center; transition: all 0.3s ease;"
            >
              <!-- ITEM INFO -->
              <div style="flex: 1;">
                <h4 style="margin: 0 0 0.5rem 0; font-size: 1.1rem; font-weight: 700;">{{ item.name }}</h4>
                <p style="margin: 0; color: #666; font-size: 0.9rem;">{{ item.description || "Delicious item" }}</p>
                <div style="margin-top: 0.75rem; font-weight: 700; color: #00d084; font-size: 1.1rem;">₦{{ item.price }}</div>
              </div>

              <!-- QUANTITY CONTROLS -->
              <div style="display: flex; align-items: center; gap: 1rem; background: #f5f7fa; padding: 0.75rem 1rem; border-radius: 12px;">
                <button
                  @click="cartStore.decreaseQuantity(item.id)"
                  class="btn btn-light"
                  style="width: 40px; height: 40px; padding: 0; display: flex; align-items: center; justify-content: center; border-radius: 8px; font-weight: 700; font-size: 1.2rem;"
                >
                  −
                </button>
                <span style="font-weight: 700; font-size: 1.1rem; min-width: 2rem; text-align: center;">{{ item.quantity }}</span>
                <button
                  @click="cartStore.increaseQuantity(item.id)"
                  class="btn btn-light"
                  style="width: 40px; height: 40px; padding: 0; display: flex; align-items: center; justify-content: center; border-radius: 8px; font-weight: 700; font-size: 1.2rem;"
                >
                  +
                </button>
              </div>

              <!-- SUBTOTAL -->
              <div style="text-align: right; min-width: 100px;">
                <div style="font-size: 0.85rem; color: #999; margin-bottom: 0.5rem;">Subtotal</div>
                <div style="font-weight: 700; font-size: 1.2rem;">₦{{ item.price * item.quantity }}</div>
              </div>

              <!-- REMOVE BUTTON -->
              <button
                @click="removeItem(item.id)"
                class="btn btn-light"
                style="padding: 0.5rem 1rem; border-radius: 8px; color: #ff4757; font-weight: 600;"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>

        <!-- ORDER SUMMARY SIDEBAR -->
        <div style="position: sticky; top: 2rem; height: fit-content; width: 100%; max-width: 350px;">
          <div class="card" style="padding: 2rem; border-radius: 16px; background: linear-gradient(135deg, #00d084 0%, #00a86b 100%); color: white;">
            <h3 style="margin: 0 0 1.5rem 0; font-size: 1.3rem; font-weight: 700;">Order Summary</h3>

            <!-- BREAKDOWN -->
            <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 2px solid rgba(255, 255, 255, 0.2);">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.95rem;">Subtotal</span>
                <span style="font-weight: 700;">₦{{ cartStore.totalPrice }}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.95rem;">Delivery Fee</span>
                <span style="font-weight: 700; color: #26f5a0;">FREE</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.95rem;">Tax (5%)</span>
                <span style="font-weight: 700;">₦{{ Math.round(cartStore.totalPrice * 0.05) }}</span>
              </div>
            </div>

            <!-- TOTAL -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
              <span style="font-size: 1.1rem; font-weight: 700;">Total</span>
              <span style="font-size: 1.5rem; font-weight: 700;">₦{{ Math.round(cartStore.totalPrice * 1.05) }}</span>
            </div>

            <!-- CHECKOUT BUTTON -->
            <router-link to="/checkout" class="btn btn-light" style="width: 100%; text-align: center; font-weight: 700; padding: 0.9rem; border-radius: 12px; color: #00d084; transition: all 0.3s ease;">
              Proceed to Checkout →
            </router-link>

            <!-- CONTINUE SHOPPING -->
            <router-link to="/" class="btn btn-light" style="width: 100%; text-align: center; font-weight: 600; padding: 0.75rem; border-radius: 12px; color: #00d084; margin-top: 0.75rem; background: rgba(255, 255, 255, 0.1); border: none;">
              Continue Shopping
            </router-link>
          </div>

          <!-- PROMO CODE -->
          <div class="card" style="padding: 1.5rem; border-radius: 16px; margin-top: 1rem;">
            <h4 style="margin: 0 0 1rem 0; font-size: 0.95rem; font-weight: 700;">Have a promo code?</h4>
            <div style="display: flex; gap: 0.5rem;">
              <input type="text" class="form-control" placeholder="Enter code" style="border-radius: 8px; flex: 1;"/>
              <button class="btn btn-light" style="border-radius: 8px; white-space: nowrap;">Apply</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 8px 20px rgba(0, 208, 132, 0.15);
}

@media (max-width: 1024px) {
  div[style*="grid-template-columns: 1fr auto"] {
    grid-template-columns: 1fr !important;
  }
}
</style>