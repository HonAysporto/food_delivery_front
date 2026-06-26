<script setup>
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "../../stores/auth";
import { getOwnerAnalytics } from "../../services/ownerAnalytics";
import api from "../../services/api";

const authStore = useAuthStore();

const analytics = ref(null);
const loading = ref(true);

const restaurant = ref(null);

const hasRestaurant = computed(() => {
  return Boolean(authStore.user?.restaurant_exists);
});

const loadRestaurant = async () => {
  try {
    const res = await api.get(
      "/owner/restaurant"
    );

    restaurant.value = res.data;
  } catch (err) {
    console.log(err);
  }
};

const toggleRestaurant = async () => {
  if (!restaurant.value) return;

  try {
    const res = await api.put(
      "/owner/restaurant/status"
    );

    restaurant.value =
      res.data.restaurant;
  } catch (err) {
    console.log(err);
  }
};

onMounted(async () => {
  try {
    analytics.value =
      await getOwnerAnalytics();

    await loadRestaurant();
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="container py-5">

    <!-- HEADER -->
    <div class="mb-4">
      <h2 class="fw-bold">
        👋 Welcome, {{ authStore.user?.lastname }}
      </h2>
      <p class="text-muted">
        Restaurant Owner Dashboard
      </p>
    </div>

    <!-- ANALYTICS CARDS -->
    <div v-if="!loading" class="row g-3 mb-4">

      <div class="col-md-4">
        <div class="card p-3 shadow-sm">
          <h6>📦 Total Orders</h6>
          <h3>{{ analytics.total_orders }}</h3>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card p-3 shadow-sm">
          <h6>💰 Revenue</h6>
          <h3>₦{{ analytics.total_revenue }}</h3>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card p-3 shadow-sm">
          <h6>🍔 Foods</h6>
          <h3>{{ analytics.total_foods }}</h3>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card p-3 shadow-sm">
          <h6>⏳ Pending Orders</h6>
          <h3>{{ analytics.pending_orders }}</h3>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card p-3 shadow-sm">
          <h6>✅ Delivered</h6>
          <h3>{{ analytics.delivered_orders }}</h3>
        </div>
      </div>

   <div
  v-if="restaurant"
  class="card p-4 shadow-sm mt-4"
>
  <h5 class="mb-3">
    🍽 Restaurant Status
  </h5>

  <span
    class="badge fs-6"
    :class="
      restaurant.is_open
        ? 'bg-success'
        : 'bg-danger'
    "
  >
    {{
      restaurant.is_open
        ? '🟢 Open'
        : '🔴 Closed'
    }}
  </span>

  <button
    class="btn btn-dark mt-3"
    @click="toggleRestaurant"
  >
    {{
      restaurant.is_open
        ? 'Close Restaurant'
        : 'Open Restaurant'
    }}
  </button>
</div>

    </div>

    <!-- LOADING -->
    <div v-else class="text-muted">
      Loading analytics...
    </div>

  

  </div>
</template>

<style scoped>
.card {
  border-radius: 12px;
}
</style>