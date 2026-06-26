<script setup>
import { useCartStore } from "../stores/cart";
import api from "../services/api";
import { useRouter } from "vue-router";
import { ref } from "vue";

const cartStore = useCartStore();
const router = useRouter();
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
  loading.value = true;
  console.log(cartStore.items);
  

  try {
    await api.post("/orders", {
      items: cartStore.items,
      total: Math.round(cartStore.totalPrice * 1.05),
      customer: formData.value,
    });

    cartStore.clearCart();
    router.push("/orders");
  } catch (err) {
    console.log(err);
    alert("Order failed. Please try again.");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div style="background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%); min-height: 100vh;">
    <!-- HEADER -->
    <div style="background: white; padding: 1.5rem 0; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
      <div class="container">
        <h1 style="margin: 0; font-size: 1.8rem;">✅ Checkout</h1>
        <p style="margin: 0.5rem 0 0 0; color: #999; font-size: 0.9rem;">Complete your order</p>
      </div>
    </div>

    <div class="container" style="padding: 2rem 1rem;">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
        <!-- LEFT COLUMN - FORM -->
        <div>
          <h3 style="margin-bottom: 1.5rem; font-size: 1.3rem;">📋 Delivery Information</h3>

          <form @submit.prevent="placeOrder" style="display: flex; flex-direction: column; gap: 1rem;">
            <!-- PERSONAL INFO -->
            <div class="card" style="padding: 1.5rem; border-radius: 16px;">
              <h4 style="margin: 0 0 1rem 0; font-size: 1rem; font-weight: 700;">Personal Details</h4>
              
              <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; font-size: 0.9rem;">Full Name</label>
                <input v-model="formData.fullName" type="text" class="form-control" placeholder="John Doe" required style="border-radius: 8px;"/>
              </div>

              <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; font-size: 0.9rem;">Email Address</label>
                <input v-model="formData.email" type="email" class="form-control" placeholder="john@example.com" required style="border-radius: 8px;"/>
              </div>

              <div style="margin-bottom: 0;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; font-size: 0.9rem;">Phone Number</label>
                <input v-model="formData.phone" type="tel" class="form-control" placeholder="+234 808 123 4567" required style="border-radius: 8px;"/>
              </div>
            </div>

            <!-- ADDRESS -->
            <div class="card" style="padding: 1.5rem; border-radius: 16px;">
              <h4 style="margin: 0 0 1rem 0; font-size: 1rem; font-weight: 700;">📍 Delivery Address</h4>
              
              <div style="margin-bottom: 0;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; font-size: 0.9rem;">Street Address</label>
                <input v-model="formData.address" type="text" class="form-control" placeholder="123 Main Street, Apt 4B" required style="border-radius: 8px;"/>
              </div>

              <div style="margin-top: 1rem; padding: 1rem; background: #f5f7fa; border-radius: 8px;">
                <div style="display: flex; align-items: center; gap: 0.5rem; color: #00d084; font-size: 0.9rem; font-weight: 600;">
                  <span style="font-size: 1rem;">✓</span>
                  Delivery in 30-45 minutes
                </div>
              </div>
            </div>

            <!-- PAYMENT -->
            <div class="card" style="padding: 1.5rem; border-radius: 16px;">
              <h4 style="margin: 0 0 1rem 0; font-size: 1rem; font-weight: 700;">💳 Payment Method</h4>
              
              <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; font-size: 0.9rem;">Card Number</label>
                <input v-model="formData.cardNumber" type="text" class="form-control" placeholder="1234 5678 9012 3456" required style="border-radius: 8px;"/>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div>
                  <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; font-size: 0.9rem;">Expiry Date</label>
                  <input v-model="formData.expiryDate" type="text" class="form-control" placeholder="MM/YY" required style="border-radius: 8px;"/>
                </div>
                <div>
                  <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; font-size: 0.9rem;">CVV</label>
                  <input v-model="formData.cvv" type="text" class="form-control" placeholder="123" required style="border-radius: 8px;"/>
                </div>
              </div>
            </div>

            <!-- SUBMIT BUTTON -->
            <button type="submit" :disabled="loading" class="btn btn-primary" style="width: 100%; padding: 1rem; border-radius: 12px; font-weight: 700; font-size: 1.05rem; transition: all 0.3s ease;">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {{ loading ? "Processing..." : "Place Order" }}
            </button>
          </form>
        </div>

        <!-- RIGHT COLUMN - ORDER SUMMARY -->
        <div>
          <div class="card" style="padding: 2rem; border-radius: 16px; position: sticky; top: 2rem; background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);">
            <h3 style="margin: 0 0 1.5rem 0; font-size: 1.3rem; font-weight: 700;">📦 Order Summary</h3>

            <!-- ORDER ITEMS -->
            <div style="margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 2px solid #e8e8e8;">
              <div v-for="item in cartStore.items" :key="item.id" style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                <div>
                  <div style="font-weight: 600;">{{ item.name }}</div>
                  <div style="font-size: 0.85rem; color: #999;">x {{ item.quantity }}</div>
                </div>
                <div style="font-weight: 700;">₦{{ item.price * item.quantity }}</div>
              </div>
            </div>

            <!-- CALCULATIONS -->
            <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 2px solid #e8e8e8;">
              <div style="display: flex; justify-content: space-between; font-size: 0.95rem;">
                <span>Subtotal</span>
                <span style="font-weight: 600;">₦{{ cartStore.totalPrice }}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.95rem;">
                <span>Delivery</span>
                <span style="font-weight: 600; color: #00d084;">FREE</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.95rem;">
                <span>Tax (5%)</span>
                <span style="font-weight: 600;">₦{{ Math.round(cartStore.totalPrice * 0.05) }}</span>
              </div>
            </div>

            <!-- TOTAL -->
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: linear-gradient(135deg, #00d084 0%, #00a86b 100%); border-radius: 12px; color: white; margin-bottom: 1rem;">
              <span style="font-weight: 700; font-size: 1.05rem;">Total</span>
              <span style="font-weight: 700; font-size: 1.4rem;">₦{{ Math.round(cartStore.totalPrice * 1.05) }}</span>
            </div>

            <!-- INFO BOXES -->
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <div style="display: flex; gap: 1rem; padding: 1rem; background: #e8f5f3; border-radius: 8px; border-left: 4px solid #00d084;">
                <span style="font-size: 1.2rem;">✓</span>
                <div>
                  <div style="font-weight: 600; font-size: 0.9rem;">Secure Payment</div>
                  <div style="font-size: 0.8rem; color: #666;">Your payment is encrypted</div>
                </div>
              </div>

              <div style="display: flex; gap: 1rem; padding: 1rem; background: #e8f5f3; border-radius: 8px; border-left: 4px solid #00d084;">
                <span style="font-size: 1.2rem;">📍</span>
                <div>
                  <div style="font-weight: 600; font-size: 0.9rem;">Real-time Tracking</div>
                  <div style="font-size: 0.8rem; color: #666;">Track your order live</div>
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
@media (max-width: 1024px) {
  div[style*="grid-template-columns: 1fr 1fr"] {
    grid-template-columns: 1fr !important;
  }
}
</style>