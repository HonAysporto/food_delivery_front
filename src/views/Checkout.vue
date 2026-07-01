<script setup>
import { useCartStore } from "../stores/cart";
import api from "../services/api";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useToast } from "vue-toastification";

const cartStore = useCartStore();
const router = useRouter();
const toast = useToast();
const loading = ref(false);

const formData = ref({
  fullName: "",
  email: "",
  phone: "",
  address: "",
  cardNumber: "",
  expiryDate: "",
  cvv: "",
});

const placeOrder = async () => {
  if (cartStore.items.length === 0) {
    toast.error("Your cart is empty. Add some items before checking out!");
    return;
  }

  loading.value = true;
  
  try {
    await api.post("/orders", {
      items: cartStore.items,
      total: Math.round(cartStore.totalPrice * 1.05),
      customer: formData.value,
    });

    toast.success("Order placed successfully! Routing to tracker...");
    cartStore.clearCart();
    router.push("/orders");
  } catch (err) {
    console.error(err);
    toast.error(
      err.response?.data?.message || "Order placement failed. Please verify payment details."
    );
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="checkout-page">
    
    <!-- PAGE HEADER -->
    <header class="checkout-header">
      <div class="container">
        <h1>Checkout</h1>
        <p>Complete your delivery and payment details to place your order</p>
      </div>
    </header>

    <div class="container content-body">
      <div class="checkout-layout-grid">
        
        <!-- LEFT COLUMN: INPUT FORM SHEET -->
        <div class="form-column">
          <h3 class="column-title">📋 Delivery Information</h3>

          <form @submit.prevent="placeOrder" class="checkout-form">
            
            <!-- STEP 1: PERSONAL INFO -->
            <div class="form-card">
              <h4 class="form-card-title">Personal Details</h4>
              
              <div class="form-input-wrapper">
                <label class="form-input-label">Full Name</label>
                <input v-model="formData.fullName" type="text" class="styled-input" placeholder="John Doe" required />
              </div>

              <div class="form-input-wrapper">
                <label class="form-input-label">Email Address</label>
                <input v-model="formData.email" type="email" class="styled-input" placeholder="john@example.com" required />
              </div>

              <div class="form-input-wrapper mb-0">
                <label class="form-input-label">Phone Number</label>
                <input v-model="formData.phone" type="tel" class="styled-input" placeholder="+234 808 123 4567" required />
              </div>
            </div>

            <!-- STEP 2: ADDRESS -->
            <div class="form-card">
              <h4 class="form-card-title">📍 Delivery Location</h4>
              
              <div class="form-input-wrapper mb-0">
                <label class="form-input-label">Street Address</label>
                <input v-model="formData.address" type="text" class="styled-input" placeholder="123 Main Street, Victoria Island, Lagos" required />
              </div>

              <div class="delivery-eta-badge">
                <span class="badge-icon">⚡</span>
                <span class="badge-text">Estimated delivery time: <strong>30-45 minutes</strong></span>
              </div>
            </div>

            <!-- STEP 3: PAYMENT PROFILE -->
            <div class="form-card">
              <h4 class="form-card-title">💳 Secure Payment</h4>
              
              <div class="form-input-wrapper">
                <label class="form-input-label">Card Number</label>
                <input v-model="formData.cardNumber" type="text" class="styled-input font-numeric" placeholder="1234 5678 9012 3456" required />
              </div>

              <div class="row g-3">
                <div class="col-6">
                  <div class="form-input-wrapper mb-0">
                    <label class="form-input-label">Expiry Date</label>
                    <input v-model="formData.expiryDate" type="text" class="styled-input font-numeric" placeholder="MM/YY" required />
                  </div>
                </div>
                <div class="col-6">
                  <div class="form-input-wrapper mb-0">
                    <label class="form-input-label">CVV Secure Pin</label>
                    <input v-model="formData.cvv" type="password" maxlength="3" class="styled-input font-numeric" placeholder="•••" required />
                  </div>
                </div>
              </div>
            </div>

            <!-- SUBMIT BUTTON -->
            <button type="submit" :disabled="loading" class="checkout-submit-btn">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {{ loading ? "Processing Order..." : "Place My Order" }}
            </button>
          </form>
        </div>

        <!-- RIGHT COLUMN: STICKY SIDEBAR ORDER SUMMARY -->
        <div class="summary-column">
          <div class="summary-sticky-card">
            <h3 class="summary-card-title">📦 Order Summary</h3>

            <!-- ORDER ITEMS ROWS -->
            <div class="items-summary-list">
              <div v-for="item in cartStore.items" :key="item.id" class="summary-item-row">
                <div class="item-details-left">
                  <span class="item-title-text">{{ item.name }}</span>
                  <span class="item-qty-count">Quantity: <strong>× {{ item.quantity }}</strong></span>
                </div>
                <div class="item-final-price font-numeric">₦{{ Number(item.price * item.quantity).toLocaleString() }}</div>
              </div>
            </div>

            <!-- COST MATRIX STATS -->
            <div class="breakdown-table">
              <div class="breakdown-row">
                <span>Subtotal</span>
                <span class="font-numeric">₦{{ Number(cartStore.totalPrice || 0).toLocaleString() }}</span>
              </div>
              <div class="breakdown-row">
                <span>Delivery</span>
                <span class="delivery-free-tag">FREE</span>
              </div>
              <div class="breakdown-row">
                <span>Vat Tax (5%)</span>
                <span class="font-numeric">₦{{ Number(Math.round((cartStore.totalPrice || 0) * 0.05)).toLocaleString() }}</span>
              </div>
            </div>

            <!-- GRAND TOTAL PANEL STRIP -->
            <div class="grand-total-block">
              <span>Grand Total</span>
              <span class="total-amount font-numeric">₦{{ Number(Math.round((cartStore.totalPrice || 0) * 1.05)).toLocaleString() }}</span>
            </div>

            <!-- TRUST INDICATOR SIGNALS -->
            <div class="trust-indicators-stack">
              <div class="trust-node">
                <span class="trust-icon">🛡️</span>
                <div class="trust-info">
                  <strong>Encrypted Transmission</strong>
                  <p>Your payment data is fully tokenized and private</p>
                </div>
              </div>

              <div class="trust-node">
                <span class="trust-icon">📍</span>
                <div class="trust-info">
                  <strong>Live Tracking Enabled</strong>
                  <p>Follow your dispatch courier map route in real-time</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.checkout-page {
  background: #f9f9f9;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  color: #333333;
}

/* ==========================================
   PAGE HEADER
========================================== */
.checkout-header {
  
  padding: 30px 0;
  border-bottom: 1px solid #f2f2f2;
}

.checkout-header h1 {
  font-size: 28px;
  font-weight: 900;
  color: #111111;
  margin: 0 0 6px 0;
  letter-spacing: -0.5px;
}

.checkout-header p {
  color: #7d7d7d;
  margin: 0;
  font-size: 14.5px;
}

.content-body {
  padding: 40px 16px;
}

/* ==========================================
   TWO-COLUMN FLEX GRID LAYOUT
========================================== */
.checkout-layout-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 32px;
  align-items: start;
}

.column-title {
  font-size: 20px;
  font-weight: 900;
  color: #111111;
  margin: 0 0 20px 0;
  letter-spacing: -0.3px;
}

.checkout-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* FORM FIELDS INTERACTIVE PROFILE SCENERY */
.form-card {
  background: #ffffff;
  border: 1px solid #ededed;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.01);
}

.form-card-title {
  font-size: 15px;
  font-weight: 800;
  color: #7d7d7d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 20px 0;
}

.form-input-wrapper {
  margin-bottom: 16px;
}

.form-input-label {
  display: block;
  font-size: 13.5px;
  font-weight: 700;
  color: #111111;
  margin-bottom: 6px;
}

.styled-input {
  width: 100%;
  background: #fdfdfd;
  border: 1px solid #dcdcdc;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 14.5px;
  color: #333333;
  outline: none;
  transition: all 0.2s ease;
}

.styled-input:focus {
  border-color: #ffc244; /* Brand Signature Yellow */
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(255, 194, 68, 0.15);
}

/* ETA DECORATION FIELD */
.delivery-eta-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #e6f6ee;
  padding: 12px 16px;
  border-radius: 12px;
  margin-top: 16px;
}

.badge-icon {
  font-size: 18px;
}

.badge-text {
  font-size: 13.5px;
  color: #333333;
}

.badge-text strong {
  color: #00a86b;
}

/* CRITICAL CHECKOUT TRIGGER */
.checkout-submit-btn {
  width: 100%;
  background: #00a86b; /* Premium Emerald Brand Primary */
  color: #ffffff;
  border: none;
  font-weight: 800;
  font-size: 16px;
  padding: 16px;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(0, 168, 107, 0.25);
  transition: background-color 0.15s ease, transform 0.15s ease;
}

.checkout-submit-btn:hover {
  background: #00935f;
}

.checkout-submit-btn:active {
  transform: scale(0.98);
}

.checkout-submit-btn:disabled {
  background: #e2e8f0;
  color: #94a3b8;
  cursor: not-allowed;
  box-shadow: none;
}

/* ==========================================
   ORDER SUMMARY SIDEBAR COMPONENT PANEL
========================================== */
.summary-sticky-card {
  position: sticky;
  top: 100px;
  background: #ffffff;
  border: 1px solid #ededed;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.01);
}

.summary-card-title {
  font-size: 18px;
  font-weight: 900;
  margin: 0 0 20px 0;
  letter-spacing: -0.3px;
}

.items-summary-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px dashed #e5e7eb;
  margin-bottom: 16px;
}

.summary-item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.item-details-left {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.item-title-text {
  font-size: 14.5px;
  font-weight: 700;
  color: #111111;
}

.item-qty-count {
  font-size: 12px;
  color: #8c8c8c;
}

.item-qty-count strong {
  color: #444444;
}

.item-final-price {
  font-size: 14.5px;
  font-weight: 700;
  color: #111111;
}

/* CALCULATION PRICING SPLITS */
.breakdown-table {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 16px;
  border-bottom: 1px dashed #e5e7eb;
  margin-bottom: 16px;
}

.breakdown-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #4b5563;
}

.delivery-free-tag {
  color: #00a86b;
  font-weight: 800;
}

/* BRAND PANEL TOTAL CONTAINER */
.grand-total-block {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #00a86b 0%, #008755 100%);
  color: #ffffff;
  padding: 16px 20px;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 4px 15px rgba(0, 168, 107, 0.2);
}

.grand-total-block span:first-child {
  font-weight: 700;
  font-size: 15px;
}

.total-amount {
  font-size: 20px;
  font-weight: 900;
}

/* SECURITY SIGNALS UNDER CARDS */
.trust-indicators-stack {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.trust-node {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: #fdfdfd;
  border: 1px solid #f5f5f5;
  padding: 12px;
  border-radius: 12px;
}

.trust-icon {
  font-size: 18px;
}

.trust-info {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.trust-info strong {
  font-size: 13px;
  font-weight: 700;
  color: #111111;
}

.trust-info p {
  margin: 0;
  font-size: 11.5px;
  color: #7d7d7d;
}

.font-numeric {
  font-variant-numeric: tabular-nums;
}

/* ==========================================
   RESPONSIVE LAYOUT CONSTRAINTS OVERRIDES
========================================== */
@media (max-width: 1024px) {
  .checkout-layout-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .summary-column {
    position: static;
    max-width: 100%;
  }
}
</style>