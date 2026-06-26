<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";
import { useRouter } from "vue-router";

const orders = ref([]);
const loading = ref(true);
const router = useRouter();

const fetchOrders = async () => {
  try {
    const res = await api.get("/orders");
    orders.value = res.data;
  } catch (error) {
    console.error(error);
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

const getStatusColor = (status) => {
  switch (status) {
    case "delivered":
      return "#00d084";
    case "preparing":
      return "#ffc107";
    case "on_the_way":
      return "#0099ff";
    default:
      return "#999";
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

    const restaurantId =
      selectedOrder.value.items[0].food.restaurant_id;

    await api.post("/reviews", {
      order_id: selectedOrder.value.id,
      restaurant_id: restaurantId,
      rating: reviewForm.value.rating,
      comment: reviewForm.value.comment,
    });

    alert("Review submitted successfully");

    showReviewModal.value = false;

  } catch (err) {

    console.log(err);

    alert(
      err.response?.data?.message ||
      "Failed to submit review"
    );

  }
};
</script>

<template>
  <div style="background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%); min-height: 100vh;">
    <!-- HEADER -->
    <div style="background: white; padding: 1.5rem 0; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
      <div class="container">
        <h1 style="margin: 0; font-size: 1.8rem;">📦 My Orders</h1>
        <p style="margin: 0.5rem 0 0 0; color: #999; font-size: 0.9rem;">Track and manage your orders</p>
      </div>
    </div>

    <div class="container" style="padding: 2rem 1rem;">
      <!-- LOADING STATE -->
      <div v-if="loading" class="text-center py-5">
        <div style="font-size: 2rem; margin-bottom: 1rem;">⏳</div>
        <p style="color: #999; font-size: 0.95rem;">Loading your orders...</p>
      </div>

      <!-- EMPTY STATE -->
      <div v-else-if="orders.length === 0" class="text-center py-5">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🛒</div>
        <h3 style="margin-bottom: 0.5rem;">No orders yet</h3>
        <p style="color: #999; margin-bottom: 2rem; font-size: 0.95rem;">Start ordering your favorite food now!</p>
        <router-link to="/" class="btn btn-primary" style="padding: 0.75rem 2rem;">Browse Restaurants</router-link>
      </div>

      <!-- ORDERS LIST -->
      <div v-else style="display: flex; flex-direction: column; gap: 1.5rem;">
        <div
          v-for="order in orders"
          :key="order.id"
          class="card"
          style="border-radius: 16px; padding: 1.5rem; overflow: hidden; transition: all 0.3s ease;"
        >
          <!-- ORDER HEADER -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem;">
            <div>
              <h3 style="margin: 0 0 0.5rem 0; font-size: 1.3rem; font-weight: 700;">Order #{{ order.id }}</h3>
              <p style="margin: 0; color: #999; font-size: 0.9rem;">{{ new Date(order.created_at).toLocaleString() }}</p>
            </div>

            <!-- STATUS BADGE -->
            <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1.5rem; background: rgba(0, 208, 132, 0.1); border-radius: 20px; border-left: 4px solid rgb(var(--r), var(--g), var(--b));" :style="{borderLeftColor: getStatusColor(order.status)}">
              <span style="font-size: 1.2rem;">{{ getStatusIcon(order.status) }}</span>
              <span style="font-weight: 700; color: #1a1a1a;">{{ getStatusLabel(order.status) }}</span>
            </div>
          </div>

          <!-- ORDER ITEMS SUMMARY -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; padding: 1rem 0; border-top: 1px solid #f0f0f0; border-bottom: 1px solid #f0f0f0;">
            <div style="text-align: center;">
              <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">🍽️</div>
              <div style="font-weight: 700; font-size: 1rem;">{{ order.items?.length || 0 }}</div>
              <div style="font-size: 0.85rem; color: #999;">Items</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">💰</div>
              <div style="font-weight: 700; font-size: 1rem;">₦{{ order.total }}</div>
              <div style="font-size: 0.85rem; color: #999;">Total</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">📍</div>
              <div style="font-weight: 700; font-size: 1rem;">{{ order.delivery_time || '30-45m' }}</div>
              <div style="font-size: 0.85rem; color: #999;">Delivery</div>
            </div>
          </div>

          <!-- ITEMS PREVIEW -->
          <div style="margin-bottom: 1rem;">
            <h4 style="margin: 0 0 1rem 0; font-size: 0.95rem; font-weight: 700;">Order Details</h4>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <div v-if="order.items && order.items.length > 0" v-for="(item, idx) in order.items.slice(0, 3)" :key="idx" style="display: flex; justify-content: space-between; padding: 0.75rem; background: #f9f9f9; border-radius: 8px;">
                <span style="font-size: 0.9rem;">{{ item.food?.name }} x{{ item.quantity }}</span>
                <span style="font-weight: 600;">₦{{ item.price * item.quantity }}</span>
              </div>
              <div v-if="order.items && order.items.length > 3" style="font-size: 0.85rem; color: #999; padding: 0.5rem;">
                +{{ order.items.length - 3 }} more items
              </div>
            </div>
          </div>

          <!-- ACTION BUTTONS -->
          <div style="display: flex; gap: 1rem;">
            <button class="btn btn-light" style="flex: 1; border-radius: 10px; font-weight: 600; padding: 0.75rem;">
              👁️ Track Order
            </button>
           <button v-if="getStatusLabel(order.status) ==='Delivered'"
  class="btn btn-warning"
  @click="openReview(order)"
>
  ⭐ Leave Review
</button>
            <button class="btn btn-light" style="flex: 1; border-radius: 10px; font-weight: 600; padding: 0.75rem;">
              💬 Contact
            </button>
          </div>

          <!-- TIMELINE -->
          <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #f0f0f0;">
            <div style="display: flex; align-items: center; gap: 1rem; font-size: 0.9rem;">
              <div style="width: 12px; height: 12px; background: #00d084; border-radius: 50%; flex-shrink: 0;"></div>
              <span>{{ getStatusLabel(order.status) }} • {{ new Date(order.created_at).toLocaleDateString() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
  v-if="showReviewModal"
  class="review-overlay"
>

  <div class="review-modal">

    <h4>
      Leave a Review
    </h4>

    <div class="mb-3">

      <label>
        Rating
      </label>

      <select
        v-model="reviewForm.rating"
        class="form-control"
      >
        <option :value="5">
          ⭐⭐⭐⭐⭐
        </option>

        <option :value="4">
          ⭐⭐⭐⭐
        </option>

        <option :value="3">
          ⭐⭐⭐
        </option>

        <option :value="2">
          ⭐⭐
        </option>

        <option :value="1">
          ⭐
        </option>

      </select>

    </div>

    <div class="mb-3">

      <label>
        Comment
      </label>

      <textarea
        v-model="reviewForm.comment"
        class="form-control"
        rows="4"
      ></textarea>

    </div>

    <div class="d-flex gap-2">

      <button
        class="btn btn-secondary"
        @click="showReviewModal = false"
      >
        Cancel
      </button>

      <button
        class="btn btn-success"
        @click="submitReview"
      >
        Submit Review
      </button>

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
  transform: translateY(-4px);
}

button:hover {
  background-color: #f0f0f0;
  transform: translateY(-2px);
}


/* review :modal */

.review-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.5);

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 9999;
}

.review-modal {
  width: 90%;
  max-width: 500px;

  background: white;

  padding: 24px;

  border-radius: 16px;
}
</style>