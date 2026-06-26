<script setup>
import { ref, onMounted, computed } from "vue";
import api from "../../services/api";

const loading = ref(true);

const availableOrders = ref([]);
const myOrders = ref([]);

const loadDashboard = async () => {
  loading.value = true;

  try {

    const [available, mine] = await Promise.all([
      api.get("/rider/available-orders"),
      api.get("/rider/my-orders"),
    ]);

    availableOrders.value = available.data;
    myOrders.value = mine.data;

  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const acceptOrder = async (id) => {

  await api.put(`/rider/accept-order/${id}`);

  loadDashboard();

};

const deliverOrder = async (id) => {

  await api.put(`/rider/deliver-order/${id}`);

  loadDashboard();

};

const earnings = computed(() => {

  return myOrders.value
    .filter(o => o.status === "delivered")
    .reduce((sum, order) => sum + Number(order.total) * 0.10, 0);

});

const delivered = computed(() => {

  return myOrders.value.filter(
    o => o.status === "delivered"
  ).length;

});

const active = computed(() => {

  return myOrders.value.filter(
    o => o.status === "on_the_way"
  ).length;

});

onMounted(loadDashboard);
</script>

<template>

<div class="container py-4">

<h2 class="fw-bold mb-4">
🚴 Rider Dashboard
</h2>

<div
v-if="loading"
class="text-center"
>

Loading...

</div>

<div v-else>

<!-- Analytics -->

<div class="row g-3 mb-4">

<div class="col-md-4">

<div class="card shadow-sm p-3">

<h6>💰 Earnings</h6>

<h3>
₦{{ earnings.toFixed(0) }}
</h3>

</div>

</div>

<div class="col-md-4">

<div class="card shadow-sm p-3">

<h6>✅ Delivered</h6>

<h3>
{{ delivered }}
</h3>

</div>

</div>

<div class="col-md-4">

<div class="card shadow-sm p-3">

<h6>🛵 Active Delivery</h6>

<h3>
{{ active }}
</h3>

</div>

</div>

</div>

<!-- Available Orders -->

<div class="card shadow-sm mb-4">

<div class="card-header">

<h5>
📦 Available Orders
</h5>

</div>

<div class="card-body">

<div
v-if="availableOrders.length==0"
>

No available orders

</div>

<div
v-for="order in availableOrders"
:key="order.id"
class="border rounded p-3 mb-3"
>

<div class="d-flex justify-content-between">

<div>

<h6>
Order #{{ order.id }}
</h6>

<p>
Customer:

{{ order.user.firstname }}

{{ order.user.lastname }}
</p>

<p>

₦{{ order.total }}

</p>

</div>

<button
class="btn btn-success"
@click="acceptOrder(order.id)"
>

Accept Delivery

</button>

</div>

</div>

</div>

</div>

<!-- My Deliveries -->

<div class="card shadow-sm">

<div class="card-header">

<h5>

🚚 My Deliveries

</h5>

</div>

<div class="card-body">

<div
v-if="myOrders.length==0"
>

No deliveries yet

</div>

<div
v-for="order in myOrders"
:key="order.id"
class="border rounded p-3 mb-3"
>

<div
class="d-flex justify-content-between align-items-center"
>

<div>

<h6>

Order #{{ order.id }}

</h6>

<p>

{{ order.user.firstname }}

{{ order.user.lastname }}

</p>

<p>

Status:

<span
class="badge bg-primary"
>

{{ order.status }}

</span>

</p>

</div>

<button
v-if="order.status==='on_the_way'"
class="btn btn-primary"
@click="deliverOrder(order.id)"
>

Mark Delivered

</button>

<span
v-else
class="badge bg-success"
>

Delivered

</span>

</div>

</div>

</div>

</div>

</div>

</div>

</template>