<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "../../stores/auth";
import { getOwnerAnalytics } from "../../services/ownerAnalytics";
import api from "../../services/api";

const authStore = useAuthStore();

const analytics = ref(null);
const restaurant = ref(null);
const wallet = ref(null);
const loading = ref(true);
const toggling = ref(false);


const loadWallet = async () => {
  try {
    const res = await api.get("/owner/wallet");
    wallet.value = res.data;
  } catch (err) {
    console.log(err);
  }
};

const hasRestaurant = computed(() =>
  Boolean(authStore.user?.restaurant_exists)
);

const loadRestaurant = async () => {
  try {
    const res = await api.get("/owner/restaurant");
    restaurant.value = res.data;
  } catch (err) {
    console.log(err);
  }
};

const toggleRestaurant = async () => {
  if (!restaurant.value) return;

  toggling.value = true;

  try {
    const res = await api.put("/owner/restaurant/status");

    restaurant.value = res.data.restaurant;
  } catch (err) {
    console.log(err);
  } finally {
    toggling.value = false;
  }
};

onMounted(async () => {
  try {
  await Promise.all([
  getOwnerAnalytics().then(res => analytics.value = res),
  loadRestaurant(),
  loadWallet(),
]);
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
<div>

<!-- PAGE HEADER -->

<div class="page-header">

<div>

<h2 class="fw-bold mb-1">
Welcome back,
{{ authStore.user?.firstname }}
👋
</h2>

<p class="text-muted">
Here's what's happening today.
</p>

</div>

</div>

<!-- LOADER -->

<div
v-if="loading"
class="row g-4"
>

<div
v-for="i in 6"
:key="i"
class="col-lg-4 col-md-6"
>

<div class="card dashboard-card skeleton">

<div class="placeholder"></div>

</div>

</div>

</div>

<div v-else>

<!-- ANALYTICS -->

<div class="row g-4">

<div class="col-lg-3 col-md-6">

<div class="dashboard-card">

<div class="icon blue">
📦
</div>

<div>

<h6>Total Orders</h6>

<h2>
{{ analytics.total_orders }}
</h2>

</div>

</div>

</div>


<div class="col-lg-3 col-md-6">

<div class="dashboard-card">

<div class="icon green">
🏦
</div>

<div>

<h6>Wallet Balance</h6>

<h2>
₦{{ Number(wallet?.balance || 0).toLocaleString() }}
</h2>

</div>

</div>

</div>


<div class="col-lg-3 col-md-6">

<div class="dashboard-card">

<div class="icon green">
🏦
</div>

<div>

<h6>Total Earned</h6>

<h2>
₦{{ Number(wallet?.total_earned || 0).toLocaleString() }}
</h2>

</div>

</div>

</div>

<div class="col-lg-3 col-md-6">

<div class="dashboard-card">

<div class="icon green">
🏦
</div>

<div>

<h6>Total Withdrawn</h6>

<h2>
₦{{ Number(wallet?.total_withdrawn || 0).toLocaleString() }}
</h2>

</div>

</div>

</div>


<div class="col-lg-3 col-md-6">

<div class="dashboard-card">

<div class="icon orange">
🍔
</div>

<div>

<h6>Total Foods</h6>

<h2>
{{ analytics.total_foods }}
</h2>

</div>

</div>

</div>

<div class="col-lg-3 col-md-6">

<div class="dashboard-card">

<div class="icon purple">
🚚
</div>

<div>

<h6>Delivered</h6>

<h2>
{{ analytics.delivered_orders }}
</h2>

</div>

</div>

</div>

<div class="col-lg-6">

<div class="dashboard-card">

<div class="icon yellow">
⏳
</div>

<div>

<h6>Pending Orders</h6>

<h2>
{{ analytics.pending_orders }}
</h2>

</div>

</div>

</div>

<div class="col-lg-6">

<div
v-if="restaurant"
class="dashboard-card"
>

<div class="d-flex justify-content-between align-items-center w-100">

<div>

<h5 class="fw-bold">
Restaurant Status
</h5>

<span
class="badge fs-6"
:class="restaurant.is_open ? 'bg-success' : 'bg-danger'"
>

{{ restaurant.is_open ? "Open" : "Closed" }}

</span>

</div>

<button
class="btn btn-dark"
@click="toggleRestaurant"
:disabled="toggling"
>

{{
toggling
? "Updating..."
: restaurant.is_open
? "Close Restaurant"
: "Open Restaurant"
}}

</button>

</div>

</div>

<div
v-else
class="dashboard-card text-center"
>

<h5>
No restaurant yet
</h5>

<p class="text-muted">
Create your restaurant to begin selling food.
</p>

<router-link
v-if="!hasRestaurant"
to="/owner/create-restaurant"
class="btn btn-success"
>

Create Restaurant

</router-link>

</div>

</div>

</div>

</div>

</div>
</template>

<style scoped>

.page-header{
margin-bottom:30px;
}

.dashboard-card{

background:white;

border-radius:18px;

padding:25px;

display:flex;

align-items:center;

gap:20px;

height:100%;

box-shadow:0 10px 25px rgba(0,0,0,.06);

transition:.3s;

}

.dashboard-card:hover{

transform:translateY(-4px);

}

.icon{

width:60px;

height:60px;

border-radius:15px;

display:flex;

align-items:center;

justify-content:center;

font-size:24px;

color:white;

}

.blue{

background:#2563eb;

}

.green{

background:#16a34a;

}

.orange{

background:#ea580c;

}

.purple{

background:#7c3aed;

}

.yellow{

background:#f59e0b;

}

.skeleton{

height:140px;

}

.placeholder{

width:100%;

height:30px;

border-radius:10px;

background:#ececec;

animation:pulse 1.2s infinite;

}

@keyframes pulse{

0%{

opacity:.4;

}

50%{

opacity:1;

}

100%{

opacity:.4;

}

}

[data-theme="dark"] .dashboard-card{

background:#1e293b;

color:white;

}

[data-theme="dark"] .text-muted{

color:#94a3b8!important;

}

@media(max-width:768px){

.dashboard-card{

padding:18px;

}

}
</style>