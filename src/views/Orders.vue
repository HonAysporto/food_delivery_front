<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const orders = ref([]);
const loading = ref(true);
const router = useRouter();
const toast = useToast();

const fetchOrders = async () => {
  try {
    const res = await api.get("/orders");
    orders.value = res.data;
  } catch (error) {
    console.error(error);
    toast.error("Failed to load your orders history.");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchOrders);

const getStatusIcon = (status) => {
  switch (status) {
    case "delivered":
      return "✓";
    case "preparing":
      return "👨‍🍳";
    case "on_the_way":
      return "🚚";
    default:
      return "📦";
  }
};

const getStatusColorClass = (status) => {
  switch (status) {
    case "delivered":
      return "status-delivered";
    case "preparing":
      return "status-preparing";
    case "on_the_way":
      return "status-on-way";
    default:
      return "status-pending";
  }
};

const getStatusLabel = (status) => {
  const labels = {
    delivered: "Delivered",
    preparing: "Preparing",
    on_the_way: "On the way",
  };
  return labels[status] || status;
};

const showReviewModal = ref(false);
const selectedOrder = ref(null);

const reviewForm = ref({
  rating: 5,
  comment: "",
});

const openReview = (order) => {
  selectedOrder.value = order;
  reviewForm.value = {
    rating: 5,
    comment: "",
  };
  showReviewModal.value = true;
};

const submitReview = async () => {
  try {
    if (!selectedOrder.value?.items?.length) {
      toast.error("Cannot submit a review for an empty order.");
      return;
    }

    const restaurantId = selectedOrder.value.items[0].food.restaurant_id;

    await api.post("/reviews", {
      order_id: selectedOrder.value.id,
      restaurant_id: restaurantId,
      rating: reviewForm.value.rating,
      comment: reviewForm.value.comment,
    });

    toast.success("Review submitted successfully! Thank you.");
    showReviewModal.value = false;
    
    // Optional refresh to update states if applicable
    fetchOrders();
  } catch (err) {
    console.error(err);
    toast.error(
      err.response?.data?.message || "Failed to submit review. Please try again."
    );
  }
};
</script>

<template>
  <div class="orders-page">
    
    <!-- PAGE HEADER -->
    <header class="orders-header">
      <div class="container">
        <h1>My Orders History</h1>
        <p>Track progress, manage orders, and check past favorites</p>
      </div>
    </header>

    <div class="container content-body">
      
      <!-- LOADING STATE -->
      <div v-if="loading" class="loading-state-card">
        <div class="spinner-border text-success mb-3"></div>
        <p>Loading your orders history...</p>
      </div>

      <!-- EMPTY STATE -->
      <div v-else-if="orders.length === 0" class="empty-state-card">
        <div class="empty-icon">🛒</div>
        <h3>No orders yet</h3>
        <p>Start ordering delicious food delivered directly to your doorstep!</p>
        <router-link to="/" class="browse-btn">Browse Restaurants</router-link>
      </div>

      <!-- ORDERS LIST -->
      <div v-else class="orders-stack">
        <div
          v-for="order in orders"
          :key="order.id"
          class="order-item-card"
        >
          <!-- ORDER CARD HEADER -->
          <div class="order-card-header">
            <div>
            
              <p class="order-timestamp">{{ new Date(order.created_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) }}</p>
            </div>

            <!-- STATUS BADGE -->
            <div class="status-badge" :class="getStatusColorClass(order.status)">
              <span class="status-icon">{{ getStatusIcon(order.status) }}</span>
              <span class="status-label">{{ getStatusLabel(order.status) }}</span>
            </div>
          </div>

          <!-- SUMMARY META MATRICES -->
          <div class="order-summary-grid">
            <div class="summary-node">
              <span class="node-icon">🍱</span>
              <span class="node-val">{{ order.items?.length || 0 }}</span>
              <span class="node-lbl">Items</span>
            </div>
            
            <div class="summary-node">
              <span class="node-icon">₦</span>
              <span class="node-val font-numeric">{{ Number(order.total || 0).toLocaleString() }}</span>
              <span class="node-lbl">Total Paid</span>
            </div>
            
            <div class="summary-node">
              <span class="node-icon">⏱️</span>
              <span class="node-val">{{ order.delivery_time || '30-45m' }}</span>
              <span class="node-lbl">Delivery</span>
            </div>
          </div>

          <!-- ITEMS PREVIEW ACCORDION PANEL -->
          <div class="items-preview-panel">
            <h4>Order Summary</h4>
            <div class="preview-stack">
              <div 
                v-for="(item, idx) in order.items?.slice(0, 3)" 
                :key="idx" 
                class="preview-row"
              >
                <span class="item-name-qty">{{ item.food?.name }} <strong class="qty-multiply">× {{ item.quantity }}</strong></span>
                <span class="item-price-calc font-numeric">₦{{ Number(item.price * item.quantity).toLocaleString() }}</span>
              </div>
              
              <div v-if="order.items && order.items.length > 3" class="more-items-indicator">
                + {{ order.items.length - 3 }} more items ordered
              </div>
            </div>
          </div>

          <!-- ACTION CONTROLS BUTTON GROUPS -->
          <div class="action-footer-buttons-group">
            <button class="control-action-btn secondary-btn">
              👁️ Track Live
            </button>
            
            <button 
              v-if="order.status === 'delivered'"
              class="control-action-btn review-trigger-btn"
              @click="openReview(order)"
            >
              ★ Leave Review
            </button>
            
            <button class="control-action-btn secondary-btn">
              💬 Support
            </button>
          </div>

          <!-- CARD LOWER FOOTNOTE TIMELINE TRACKER -->
          <div class="card-timeline-footer">
            <div class="timeline-indicator-dot" :class="getStatusColorClass(order.status)"></div>
            <span class="timeline-note">Status Update: <strong>{{ getStatusLabel(order.status) }}</strong> • Verified Order Reference</span>
          </div>
        </div>
      </div>

    </div>
  </div>

  <!-- LEAVE REVIEW MODAL OVERLAY SHEET -->
  <div v-if="showReviewModal" class="review-overlay" @click.self="showReviewModal = false">
    <div class="review-modal">
      <div class="modal-header-block">
        <h4>Share Your Experience</h4>
        <p>Your feedback helps improve our community service ratings.</p>
      </div>

      <div class="modal-body-form">
        <div class="form-group mb-3">
          <label class="form-label-text">Select Rating Score</label>
          <div class="star-select-wrapper">
            <select v-model="reviewForm.rating" class="styled-form-select">
              <option :value="5">⭐⭐⭐⭐⭐ Excellent (5/5)</option>
              <option :value="4">⭐⭐⭐⭐ Very Good (4/5)</option>
              <option :value="3">⭐⭐⭐ Satisfactory (3/5)</option>
              <option :value="2">⭐⭐ Fairly Good (2/5)</option>
              <option :value="1">⭐ Poor Experience (1/5)</option>
            </select>
          </div>
        </div>

        <div class="form-group mb-4">
          <label class="form-label-text">Write Your Comments</label>
          <textarea
            v-model="reviewForm.comment"
            class="styled-form-textarea"
            rows="4"
            placeholder="Tell us what you liked or how we can improve packaging, taste, or fast tracking delivery..."
          ></textarea>
        </div>
      </div>

      <div class="modal-footer-actions-strip">
        <button class="modal-btn dismiss-btn" @click="showReviewModal = false">
          Cancel
        </button>
        <button class="modal-btn publish-btn" @click="submitReview">
          Submit Review
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.orders-page {
  background: #f9f9f9;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  color: #333333;
}

/* ==========================================
   PAGE HEADER
========================================== */
.orders-header {
  background: #ffffff;
  padding: 30px 0;
  border-bottom: 1px solid #f2f2f2;
}

.orders-header h1 {
  font-size: 28px;
  font-weight: 900;
  color: #111111;
  margin: 0 0 6px 0;
  letter-spacing: -0.5px;
}

.orders-header p {
  color: #7d7d7d;
  margin: 0;
  font-size: 14.5px;
}

.content-body {
  padding: 40px 16px;
}

/* ==========================================
   ORDERS COMPACT STACK LAYOUT
========================================== */
.orders-stack {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.order-item-card {
  background: #ffffff;
  border-radius: 24px;
  padding: 24px;
  border: 1px solid #ededed;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.01);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.order-item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
}

.order-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.order-card-header h3 {
  font-size: 20px;
  font-weight: 800;
  color: #111111;
  margin: 0 0 4px 0;
}

.order-timestamp {
  color: #8c8c8c;
  font-size: 13px;
  margin: 0;
  font-weight: 500;
}

/* STATUS CHIP IMPLEMENTATIONS */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 13.5px;
}

.status-badge.status-delivered {
  background: #e6f6ee;
  color: #00a86b;
}

.status-badge.status-preparing {
  background: #fffdf0;
  color: #ffb300;
  border: 1px solid #ffecb3;
}

.status-badge.status-on-way {
  background: #f0f7ff;
  color: #0066cc;
}

.status-badge.status-pending {
  background: #f5f5f5;
  color: #757575;
}

/* METADATA NODE ROW DESIGNS */
.order-summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  background: #fafafa;
  border-radius: 18px;
  padding: 16px;
  margin-bottom: 24px;
  border: 1px solid #f5f5f5;
}

.summary-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-right: 1px solid #ededed;
}

.summary-node:last-child {
  border-right: none;
}

.node-icon {
  font-size: 20px;
  margin-bottom: 4px;
}

.node-val {
  font-size: 16px;
  font-weight: 800;
  color: #111111;
}

.node-lbl {
  font-size: 11px;
  color: #8c8c8c;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-top: 2px;
}

/* ITEMS PREVIEW SUB PANELS */
.items-preview-panel h4 {
  font-size: 14px;
  font-weight: 800;
  color: #111111;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 12px 0;
}

.preview-stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.preview-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fdfdfd;
  border: 1px solid #f2f2f2;
  padding: 12px 16px;
  border-radius: 12px;
}

.item-name-qty {
  font-size: 14px;
  color: #444444;
  font-weight: 500;
}

.qty-multiply {
  color: #8c8c8c;
  margin-left: 4px;
  font-weight: 700;
}

.item-price-calc {
  font-size: 14px;
  font-weight: 700;
  color: #111111;
}

.more-items-indicator {
  font-size: 13px;
  color: #7d7d7d;
  font-weight: 600;
  padding: 4px 6px;
}

/* ACTIONS STRIP BUTTON DESIGNS */
.action-footer-buttons-group {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.control-action-btn {
  flex: 1;
  border: none;
  font-size: 14px;
  font-weight: 800;
  padding: 12px;
  border-radius: 50px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: background-color 0.15s ease, transform 0.15s ease;
}

.control-action-btn:active {
  transform: scale(0.98);
}

.control-action-btn.secondary-btn {
  background: #f5f5f5;
  color: #444444;
  border: 1px solid #e6e6e6;
}

.control-action-btn.secondary-btn:hover {
  background: #ededed;
}

.control-action-btn.review-trigger-btn {
  background: #ffc244;
  color: #333333;
}

.control-action-btn.review-trigger-btn:hover {
  background: #eebb37;
}

/* CARD LOWER FOOTER */
.card-timeline-footer {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  gap: 10px;
}

.timeline-indicator-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.timeline-indicator-dot.status-delivered { background: #00a86b; }
.timeline-indicator-dot.status-preparing { background: #ffb300; }
.timeline-indicator-dot.status-on-way { background: #0066cc; }
.timeline-indicator-dot.status-pending { background: #757575; }

.timeline-note {
  font-size: 12.5px;
  color: #7d7d7d;
}

.timeline-note strong {
  color: #333333;
}

/* ==========================================
   APP APP STATE PAGES MODES CARD LAYOUTS
========================================== */
.loading-state-card,
.empty-state-card {
  text-align: center;
  padding: 80px 20px;
  background: #ffffff;
  border-radius: 24px;
  margin: 40px auto;
  max-width: 500px;
  border: 1px solid #ededed;
  box-shadow: 0 4px 20px rgba(0,0,0,0.01);
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

/* ==========================================
   MODAL DIALOG DIALOG OVERLAY SHEET BOX
========================================== */
.review-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 16px;
}

.review-modal {
  width: 100%;
  max-width: 480px;
  background: #ffffff;
  padding: 28px;
  border-radius: 24px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  border: 1px solid #f2f2f2;
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-header-block {
  margin-bottom: 24px;
}

.modal-header-block h4 {
  font-size: 22px;
  font-weight: 900;
  color: #111111;
  margin: 0 0 6px 0;
}

.modal-header-block p {
  color: #7d7d7d;
  font-size: 14px;
  margin: 0;
}

.form-label-text {
  display: block;
  font-size: 13.5px;
  font-weight: 800;
  color: #111111;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: 8px;
}

.styled-form-select {
  width: 100%;
  padding: 12px 16px;
  border-radius: 14px;
  border: 1px solid #dcdcdc;
  font-size: 15px;
  color: #333333;
  background: #fcfcfc;
  outline: none;
  font-weight: 600;
  transition: border-color 0.2s ease;
}

.styled-form-select:focus {
  border-color: #ffc244;
}

.styled-form-textarea {
  width: 100%;
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid #dcdcdc;
  font-size: 14.5px;
  color: #333333;
  background: #fcfcfc;
  outline: none;
  resize: none;
  transition: border-color 0.2s ease;
}

.styled-form-textarea:focus {
  border-color: #ffc244;
}

.modal-footer-actions-strip {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.modal-btn {
  flex: 1;
  border: none;
  padding: 12px;
  font-size: 15px;
  font-weight: 800;
  border-radius: 50px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.modal-btn.dismiss-btn {
  background: #f5f5f5;
  color: #444444;
  border: 1px solid #e6e6e6;
}

.modal-btn.dismiss-btn:hover {
  background: #ededed;
}

.modal-btn.publish-btn {
  background: #00a86b;
  color: #ffffff;
}

.modal-btn.publish-btn:hover {
  background: #00935f;
}

/* Utility Class */
.font-numeric {
  font-variant-numeric: tabular-nums;
}

/* ==========================================
   MOBILE DISPLACEMENT OVERRIDES
========================================== */
@media (max-width: 576px) {
  .order-card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .status-badge {
    width: 100%;
    justify-content: center;
  }

  .action-footer-buttons-group {
    flex-direction: column;
    gap: 8px;
  }

  .control-action-btn {
    width: 100%;
  }
}
</style>