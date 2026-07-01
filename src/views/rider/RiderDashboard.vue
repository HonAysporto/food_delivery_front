<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../../services/api";

const loading = ref(true);

const availableOrders = ref([]);
const myOrders = ref([]);
const wallet = ref({
  balance: 0,
  total_earned: 0,
  total_withdrawn: 0,
});

const loadDashboard = async () => {
  loading.value = true;

  try {
    const [available, mine, walletRes] = await Promise.all([
  api.get("/rider/available-orders"),
  api.get("/rider/my-orders"),
  api.get("/rider/wallet"),
]);

availableOrders.value = available.data;
myOrders.value = mine.data;
wallet.value = walletRes.data;

    availableOrders.value = available.data;
    myOrders.value = mine.data;
   
    
  } catch (error) {
    console.error(error);
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



const delivered = computed(() => {
  return myOrders.value.filter(
    order => order.status === "delivered"
  ).length;
});

const active = computed(() => {
  return myOrders.value.filter(
    order => order.status === "on_the_way"
  ).length;
});

const statusClass = (status) => {
  switch (status) {
    case "pending":
      return "bg-secondary";

    case "accepted":
      return "bg-info";

    case "preparing":
      return "bg-warning text-dark";

    case "ready_for_pickup":
      return "bg-success";

    case "on_the_way":
      return "bg-primary";

    case "delivered":
      return "bg-dark";

    default:
      return "bg-secondary";
  }
};

const pickupMap = (address) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

const deliveryMap = (address) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

onMounted(loadDashboard);
</script>


<template>
<div class="container-fluid py-4">

    <!-- LOADER -->

    <div
        v-if="loading"
        class="text-center py-5"
    >
        <div class="spinner-border text-success"></div>

        <h5 class="mt-3">
            Loading Dashboard...
        </h5>
    </div>

    <div v-else>

        <!-- ============================= -->
        <!-- TOP -->
        <!-- ============================= -->

        <div class="d-flex justify-content-between align-items-center mb-4">

            <div>

                <h2 class="fw-bold">
                    🚴 Rider Dashboard
                </h2>

                <small class="text-muted">

                    Welcome back

                </small>

            </div>

        </div>

        <!-- ============================= -->
        <!-- ANALYTICS -->
        <!-- ============================= -->

        <div class="row g-4 mb-5">


             

                 



  <div class="col-lg-4">

                <div class="card shadow-sm border-0 h-100 analytics">

                    <div class="card-body">

                        <h6 class="text-muted">

                           💰 Wallet

                        </h6>

                        <h2 class="fw-bold">

                          ₦{{ Number(wallet.balance).toLocaleString() }}

                        </h2>

                    </div>

                </div>

            </div>



   <div class="col-lg-4">

                <div class="card shadow-sm border-0 h-100 analytics">

                    <div class="card-body">

                        <h6 class="text-muted">

                            Total Earned

                        </h6>

                        <h2 class="fw-bold">

                           ₦{{ Number(wallet.total_earned).toLocaleString() }}

                        </h2>

                    </div>

                </div>

            </div>


         <div class="col-lg-4">

                <div class="card shadow-sm border-0 h-100 analytics">

                    <div class="card-body">

                        <h6 class="text-muted">

                            Total Withdrawn

                        </h6>

                        <h2 class="fw-bold">

                           ₦{{ Number(wallet.total_withdrawn).toLocaleString() }}

                        </h2>

                    </div>

                </div>

            </div>



            <div class="col-lg-4">

                <div class="card shadow-sm border-0 h-100 analytics">

                    <div class="card-body">

                        <h6 class="text-muted">

                            🏍 Active Delivery

                        </h6>

                        <h2 class="fw-bold">

                            {{ active }}

                        </h2>

                    </div>

                </div>

            </div>

            <div class="col-lg-4">

                <div class="card shadow-sm border-0 h-100 analytics">

                    <div class="card-body">

                        <h6 class="text-muted">

                            ✅ Delivered

                        </h6>

                        <h2 class="fw-bold">

                            {{ delivered }}

                        </h2>

                    </div>

                </div>

            </div>

        </div>

        <!-- ============================= -->
        <!-- AVAILABLE ORDERS -->
        <!-- ============================= -->

        <h3 class="fw-bold mb-3">

            📦 Available Orders

        </h3>

        <div
            v-if="availableOrders.length===0"
            class="alert alert-light text-center"
        >

            No orders waiting for pickup.

        </div>

        <div
            v-for="order in availableOrders"
            :key="order.id"
            class="card shadow border-0 mb-4 rider-card"
        >

            <div class="card-body">

                <div class="row">

                    <!-- LEFT -->

                    <div class="col-lg-8">

                        <div class="d-flex">

                            <img

                                :src="order.restaurant.image"

                                class="restaurant-image me-4"

                            >

                            <div>

                                <h4 class="fw-bold">

                                    {{ order.restaurant.name }}

                                </h4>

                                <p class="text-muted mb-1">

                                    📍 Pickup

                                </p>

                                <p>

                                    {{ order.restaurant.address }}

                                </p>

                                <a
                                    class="btn btn-outline-success btn-sm"

                                    :href="pickupMap(order.restaurant.address)"

                                    target="_blank"
                                >

                                    📍 Open Pickup Map

                                </a>

                            </div>

                        </div>

                        <hr>

                        <h5>

                            👤 Customer

                        </h5>

                        <p>

                            <strong>

                                {{ order.delivery_name }}

                            </strong>

                        </p>

                        <p>

                            📞 {{ order.delivery_phone }}

                        </p>

                        <p>

                            📍 {{ order.delivery_address }}

                        </p>

                        <a
                            class="btn btn-outline-primary btn-sm"

                            :href="deliveryMap(order.delivery_address)"

                            target="_blank"
                        >

                            🗺 Delivery Map

                        </a>

                        <hr>

                        <h5>

                            🍔 Items

                        </h5>

                        <div

                            v-for="item in order.items"

                            :key="item.id"

                            class="food-row"

                        >

                            <span>

                                {{ item.food.name }}

                            </span>

                            <span>

                                x{{ item.quantity }}

                            </span>

                        </div>

                    </div>

                    <!-- RIGHT -->

                    <div class="col-lg-4 text-lg-end mt-4 mt-lg-0">

                       

                        <span

                            class="badge fs-6 mb-4"

                            :class="statusClass(order.status)"

                        >

                            {{ order.status.replaceAll('_',' ') }}

                        </span>

                        <br>

                        <button

                            class="btn btn-success btn-lg"

                            @click="acceptOrder(order.id)"

                        >

                            Accept Delivery

                        </button>

                    </div>

                </div>

            </div>

        </div>

        <!-- ============================= -->
        <!-- MY DELIVERIES -->
        <!-- ============================= -->

        <h3 class="fw-bold mt-5 mb-3">

            🚚 My Deliveries

        </h3>

        <div

            v-if="myOrders.length===0"

            class="alert alert-light text-center"

        >

            You haven't accepted any deliveries yet.

        </div>

        <div

            v-for="order in myOrders"

            :key="order.id"

            class="card shadow border-0 mb-4 rider-card"

        >

            <div class="card-body">

                <div class="d-flex justify-content-between align-items-center flex-wrap">

                    <div>

                        <h4>

                            {{ order?.restaurant.name }}

                        </h4>

                         <p>

                            📍 {{ order.restaurant.address}}

                        </p>


                        <p>

                            👤 {{ order.delivery_name }}

                        </p>

                        <p>

                            📍 {{ order.delivery_address }}

                        </p>

                        <span

                            class="badge"

                            :class="statusClass(order.status)"

                        >

                            {{ order.status.replaceAll('_',' ') }}

                        </span>

                    </div>

                    <div class="text-end">


                        <button

                            v-if="order.status==='on_the_way'"

                            class="btn btn-primary"

                            @click="deliverOrder(order.id)"

                        >

                            Mark Delivered

                        </button>

                        <span

                            v-else-if="order.status==='delivered'"

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

<style scoped>
  .container-fluid {
  max-width: 1400px;
}

/* ======================
   Analytics Cards
====================== */

.analytics {
  border-radius: 18px;
  transition: .25s;
}

.analytics:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 25px rgba(0,0,0,.12);
}

.analytics h2 {
  font-size: 2rem;
  margin-top: 10px;
}

/* ======================
   Order Cards
====================== */

.rider-card {
  border-radius: 18px;
  overflow: hidden;
  transition: .25s;
}

.rider-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 25px rgba(0,0,0,.15);
}

/* ======================
   Restaurant Image
====================== */

.restaurant-image {
  width: 130px;
  height: 130px;
  object-fit: cover;
  border-radius: 15px;
  border: 3px solid #f3f4f6;
}

/* ======================
   Food List
====================== */

.food-row {
  display: flex;
  justify-content: space-between;
  align-items: center;

  background: #f8fafc;

  padding: 12px 15px;

  border-radius: 10px;

  margin-bottom: 10px;

  transition: .2s;
}

.food-row:hover {
  background: #eef2ff;
}

/* ======================
   Buttons
====================== */

.btn {
  border-radius: 10px;
}

.btn-success {
  background: #16a34a;
  border: none;
}

.btn-success:hover {
  background: #15803d;
}

.btn-primary {
  border: none;
}

/* ======================
   Badges
====================== */

.badge {
  padding: 10px 16px;
  border-radius: 20px;
  text-transform: capitalize;
}

/* ======================
   Card Titles
====================== */

.card h4 {
  font-weight: 700;
}

.card h5 {
  font-weight: 600;
}

/* ======================
   Loading
====================== */

.spinner-border {
  width: 3rem;
  height: 3rem;
}

/* ======================
   Mobile
====================== */

@media (max-width:768px) {

.restaurant-image{

width:100%;
height:220px;

margin-bottom:20px;

}

.card-body{

padding:20px;

}

.food-row{

font-size:.9rem;

}

.analytics h2{

font-size:1.6rem;

}

.btn-lg{

width:100%;

margin-top:20px;

}

.text-lg-end{

text-align:left !important;

margin-top:25px;

}

}


</style>