<script setup>
import { useCartStore } from "../stores/cart";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const cartStore = useCartStore();
const router = useRouter();
const toast = useToast();

const updateQuantity = (type, item) => {
  if (type === 'increase') {
    cartStore.increaseQuantity(item.id);
  } else if (type === 'decrease') {
    if (item.quantity <= 1) {
      removeItem(item.id, item.name);
      return;
    }
    cartStore.decreaseQuantity(item.id);
  }
};

const removeItem = (itemId, itemName) => {
  cartStore.items = cartStore.items.filter(item => item.id !== itemId);
  toast.success(`${itemName || 'Item'} removed from your cart`);
};
</script>

<template>
  <div class="cart-page">
    
    <!-- PAGE HEADER -->
    <header class="cart-header">
      <div class="container">
        <h1>🛒 Shopping Cart</h1>
        <p>{{ cartStore.items.length }} item(s) ready for checkout</p>
      </div>
    </header>

    <div class="container content-body">
      
      <!-- EMPTY CART STATE -->
      <div v-if="cartStore.items.length === 0" class="empty-state-card">
        <div class="empty-icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Add some delicious meals from your favorite restaurants to get started!</p>
        <router-link to="/" class="browse-btn">Continue Shopping</router-link>
      </div>

      <!-- CART SPLIT LAYOUT -->
      <div v-else class="cart-layout-grid">
        
        <!-- ITEMS LIST COMPONENT -->
        <div class="items-column">
          <div class="column-header">
            <h3>Your Items</h3>
          </div>

          <div class="items-stack">
            <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="cart-item-card"
            >
              <!-- ITEM INFO -->
              <div class="item-meta-info">
                <h4>{{ item.name }}</h4>
                <p>{{ item.description || "Freshly prepared and packed deliciously." }}</p>
                <div class="item-unit-price font-numeric">₦{{ Number(item.price).toLocaleString() }}</div>
              </div>

              <!-- QUANTITY ADJUSTMENTS CONTROLS -->
              <div class="qty-counter-box">
                <button
                  class="qty-btn"
                  aria-label="Decrease quantity"
                  @click="updateQuantity('decrease', item)"
                >
                  −
                </button>
                <span class="qty-display font-numeric">{{ item.quantity }}</span>
                <button
                  class="qty-btn"
                  aria-label="Increase quantity"
                  @click="updateQuantity('increase', item)"
                >
                  +
                </button>
              </div>

              <!-- SUB-TOTAL DISPLAY NODE -->
              <div class="subtotal-display-box">
                <span class="subtotal-label">Subtotal</span>
                <span class="subtotal-amount font-numeric">₦{{ Number(item.price * item.quantity).toLocaleString() }}</span>
              </div>

              <!-- TRASH REMOVAL CONTROLS -->
              <button
                class="item-delete-btn"
                title="Remove Item"
                @click="removeItem(item.id, item.name)"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>

        <!-- STICKY ORDER SUMMARY SIDEBAR -->
        <div class="summary-sidebar-column">
          <div class="summary-card">
            <h3>Order Summary</h3>

            <!-- PRICE BREAKDOWN MATRIX -->
            <div class="breakdown-table">
              <div class="breakdown-row">
                <span>Subtotal</span>
                <span class="font-numeric">₦{{ Number(cartStore.totalPrice || 0).toLocaleString() }}</span>
              </div>
              <div class="breakdown-row">
                <span>Delivery Fee</span>
                <span class="delivery-free-pill">FREE</span>
              </div>
              <div class="breakdown-row">
                <span>Tax (5%)</span>
                <span class="font-numeric">₦{{ Number(Math.round((cartStore.totalPrice || 0) * 0.05)).toLocaleString() }}</span>
              </div>
            </div>

            <!-- GRAND TOTAL BLOCK -->
            <div class="grand-total-strip">
              <span>Total</span>
              <span class="total-amount font-numeric">₦{{ Number(Math.round((cartStore.totalPrice || 0) * 1.05)).toLocaleString() }}</span>
            </div>

            <!-- STRATEGIC CHECKOUT LINKS ACTIONS -->
            <div class="sidebar-action-buttons">
              <router-link to="/checkout" class="sidebar-primary-btn">
                Proceed to Checkout →
              </router-link>

              <router-link to="/" class="sidebar-secondary-btn">
                Continue Shopping
              </router-link>
            </div>
          </div>

          <!-- PROMO COUPONS APP CARD -->
          <div class="promo-coupon-card">
            <h4>Have a promo code?</h4>
            <div class="promo-input-group">
              <input type="text" class="promo-field" placeholder="Enter code" />
              <button class="promo-apply-btn">Apply</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-page {
  background: #f9f9f9;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  color: #333333;
}

/* ==========================================
   PAGE HEADER
========================================== */
.cart-header {
  background: #ffffff;
  padding: 30px 0;
  border-bottom: 1px solid #f2f2f2;
}

.cart-header h1 {
  font-size: 28px;
  font-weight: 900;
  color: #111111;
  margin: 0 0 6px 0;
  letter-spacing: -0.5px;
}

.cart-header p {
  color: #7d7d7d;
  margin: 0;
  font-size: 14.5px;
}

.content-body {
  padding: 40px 16px;
}

/* ==========================================
   CART TWO-COLUMN GRID GRID LAYOUT
========================================== */
.cart-layout-grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 32px;
  align-items: start;
}

.column-header h3 {
  font-size: 20px;
  font-weight: 900;
  color: #111111;
  margin: 0 0 20px 0;
  letter-spacing: -0.3px;
}

.items-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ==========================================
   INTERACTIVE MEAL CART ITEM CARD
========================================== */
.cart-item-card {
  background: #ffffff;
  border: 1px solid #ededed;
  border-radius: 24px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 24px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.01);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.cart-item-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.04);
}

.item-meta-info {
  flex: 1;
}

.item-meta-info h4 {
  font-size: 17px;
  font-weight: 800;
  color: #111111;
  margin: 0 0 4px 0;
}

.item-meta-info p {
  font-size: 13.5px;
  color: #7d7d7d;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.item-unit-price {
  font-size: 15px;
  font-weight: 800;
  color: #00a86b;
}

/* QUANTITY CONTROLS INTERACTIVE REFACTOR */
.qty-counter-box {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f5f5f5;
  padding: 6px;
  border-radius: 50px;
}

.qty-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: #ffffff;
  color: #111111;
  font-size: 16px;
  font-weight: 800;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: background-color 0.15s ease, transform 0.15s ease;
}

.qty-btn:hover {
  background-color: #ededed;
}

.qty-btn:active {
  transform: scale(0.92);
}

.qty-display {
  font-size: 15px;
  font-weight: 800;
  min-width: 24px;
  text-align: center;
  color: #111111;
}

/* SUB TOTAL CELL BLOCK */
.subtotal-display-box {
  min-width: 110px;
  text-align: right;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.subtotal-label {
  font-size: 12px;
  color: #8c8c8c;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 2px;
}

.subtotal-amount {
  font-size: 18px;
  font-weight: 800;
  color: #111111;
}

/* DELETION CROSS BUTTON */
.item-delete-btn {
  background: #ffffff;
  border: 1px solid #f2f2f2;
  font-size: 16px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.item-delete-btn:hover {
  background: #fff5f5;
  border-color: #fecaca;
}

/* ==========================================
   ORDER SUMMARY PREMIUM SIDEBAR CARD
========================================== */
.summary-sidebar-column {
  position: sticky;
  top: 100px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.summary-card {
  background: linear-gradient(135deg, #00a86b 0%, #008755 100%);
  border-radius: 24px;
  padding: 30px;
  color: #ffffff;
  box-shadow: 0 10px 30px rgba(0, 168, 107, 0.2);
}

.summary-card h3 {
  font-size: 20px;
  font-weight: 900;
  margin: 0 0 24px 0;
  letter-spacing: -0.3px;
}

.breakdown-table {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  margin-bottom: 20px;
}

.breakdown-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14.5px;
  opacity: 0.92;
}

.delivery-free-pill {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 10px;
  border-radius: 50px;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.5px;
}

.grand-total-strip {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}

.grand-total-strip span:first-child {
  font-size: 16px;
  font-weight: 700;
}

.total-amount {
  font-size: 24px;
  font-weight: 900;
}

/* SIDEBAR ACTIONS ACTION STRIPS */
.sidebar-action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sidebar-primary-btn {
  display: block;
  width: 100%;
  background: #ffc244; /* Signature Accent Yellow */
  color: #333333;
  text-decoration: none;
  text-align: center;
  font-weight: 800;
  font-size: 15px;
  padding: 14px;
  border-radius: 50px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: background-color 0.15s ease, transform 0.15s ease;
}

.sidebar-primary-btn:hover {
  background: #eebb37;
  color: #333333;
}

.sidebar-primary-btn:active {
  transform: scale(0.98);
}

.sidebar-secondary-btn {
  display: block;
  width: 100%;
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  text-decoration: none;
  text-align: center;
  font-weight: 700;
  font-size: 14px;
  padding: 12px;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: background-color 0.15s ease;
}

.sidebar-secondary-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

/* PROMO CARD PANEL */
.promo-coupon-card {
  background: #ffffff;
  border: 1px solid #ededed;
  border-radius: 20px;
  padding: 20px;
}

.promo-coupon-card h4 {
  font-size: 14px;
  font-weight: 800;
  color: #111111;
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.promo-input-group {
  display: flex;
  gap: 8px;
}

.promo-field {
  flex: 1;
  background: #fcfcfc;
  border: 1px solid #dcdcdc;
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
}

.promo-field:focus {
  border-color: #00a86b;
}

.promo-apply-btn {
  background: #f5f5f5;
  color: #333333;
  border: 1px solid #dcdcdc;
  font-weight: 700;
  font-size: 14px;
  padding: 10px 18px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.promo-apply-btn:hover {
  background: #ededed;
}

/* ==========================================
   APP PAGE STATE SYSTEM SCREENS
========================================== */
.empty-state-card {
  text-align: center;
  padding: 80px 20px;
  background: #ffffff;
  border-radius: 24px;
  margin: 40px auto;
  max-width: 500px;
  border: 1px solid #ededed;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.01);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state-card h3 {
  font-size: 20px;
  font-weight: 900;
  margin-bottom: 8px;
}

.empty-state-card p {
  color: #7d7d7d;
  font-size: 14.5px;
  margin-bottom: 24px;
}

.browse-btn {
  display: inline-block;
  background: #00a86b;
  color: #ffffff;
  text-decoration: none;
  font-weight: 700;
  padding: 12px 28px;
  border-radius: 50px;
  transition: background-color 0.2s ease;
}

.browse-btn:hover {
  background: #00935f;
  color: #ffffff;
}

.font-numeric {
  font-variant-numeric: tabular-nums;
}

/* ==========================================
   RESPONSIVE MEDIA QUERIES OVERRIDES
========================================== */
@media (max-width: 1024px) {
  .cart-layout-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .summary-sidebar-column {
    position: static;
    max-width: 100%;
  }
}

@media (max-width: 680px) {
  .cart-item-card {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
    padding: 20px;
  }

  .qty-counter-box {
    justify-content: space-between;
    width: 100%;
  }

  .subtotal-display-box {
    text-align: left;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-top: 1px dashed #f2f2f2;
    padding-top: 12px;
  }

  .item-delete-btn {
    align-self: flex-end;
    margin-top: -8px;
  }
}
</style>