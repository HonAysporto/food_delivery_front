<script setup>
import { ref, onMounted } from "vue";
import api from "../../services/api";

const orders = ref([]);

const loadOrders = async () => {
  const res = await api.get(
    "/admin/orders"
  );

  orders.value = res.data;
};

onMounted(loadOrders);
</script>

<template>

<div class="container py-4">

<h2 class="mb-4">
📦 Platform Orders
</h2>

<div
v-for="order in orders"
:key="order.id"
class="card mb-4 shadow-sm"
>

<div class="card-body">

<h5>
Order #{{ order.id }}
</h5>

<p>
Customer:
<strong>
{{ order.user?.firstname }}
{{ order.user?.lastname }}
</strong>
</p>

<p>
Status:
<span class="badge bg-primary">
{{ order.status }}
</span>
</p>

<p>
Total:
<strong>
₦{{ order.total }}
</strong>
</p>

<hr>

<h6>
Items
</h6>

<ul class="list-group">

<li
v-for="item in order.items"
:key="item.id"
class="list-group-item d-flex justify-content-between"
>

<span>
{{ item.quantity }}x
{{ item.food?.name }}
</span>

<strong>
₦{{ item.price }}
</strong>

</li>

</ul>

</div>

</div>

</div>

</template>