<script setup>
import { ref, onMounted } from "vue";
import api from "../../services/api";

const analytics = ref(null);
const loading = ref(true);

const loadAnalytics = async () => {
  try {
    const res = await api.get("/admin/analytics");
    analytics.value = res.data;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

onMounted(loadAnalytics);
</script>

<template>
<div class="container py-4">

  <h2 class="fw-bold mb-4">
    📊 Admin Dashboard
  </h2>

  <div v-if="loading">
    Loading...
  </div>

  <div v-else class="row g-3">

    <div class="col-md-3">
      <div class="card p-3 shadow-sm">
        <h6>👥 Users</h6>
        <h2>{{ analytics.total_users }}</h2>
      </div>
    </div>

    <div class="col-md-3">
      <div class="card p-3 shadow-sm">
        <h6>🏪 Restaurants</h6>
        <h2>{{ analytics.total_restaurants }}</h2>
      </div>
    </div>

    <div class="col-md-3">
      <div class="card p-3 shadow-sm">
        <h6>🍔 Foods</h6>
        <h2>{{ analytics.total_foods }}</h2>
      </div>
    </div>

    <div class="col-md-3">
      <div class="card p-3 shadow-sm">
        <h6>📦 Orders</h6>
        <h2>{{ analytics.total_orders }}</h2>
      </div>
    </div>

    <div class="col-md-6">
      <div class="card p-3 shadow-sm">
        <h6>💰 Revenue</h6>
        <h2>₦{{ analytics.total_revenue }}</h2>
      </div>
    </div>

    <div class="col-md-6">
      <div class="card p-3 shadow-sm">
        <h6>⭐ Reviews</h6>
        <h2>{{ analytics.total_reviews }}</h2>
      </div>
    </div>

  </div>

</div>
</template>