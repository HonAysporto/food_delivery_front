<template>
  <div class="orders-page">

    <!-- ===========================
        PAGE HEADER
    ============================ -->

    <div class="page-header">

      <div>
        <h2>Order Management</h2>
        <p>
          Manage incoming orders and monitor restaurant activity.
        </p>
      </div>

      <div class="header-right">

        <div class="stat-box">
          <span>Total</span>
          <strong>{{ orders.length }}</strong>
        </div>

      </div>

    </div>

    <!-- ===========================
        FILTERS
    ============================ -->

    <div class="card custom-card mb-4">

      <div class="card-body">

        <div class="row g-3">

          <div class="col-lg-8">

            <input
              v-model="search"
              class="form-control"
              placeholder="Search customer or order ID..."
            >

          </div>

          <div class="col-lg-4">



          </div>

        </div>

      </div>

    </div>

    <!-- ===========================
        LOADING
    ============================ -->

    <div
      v-if="loading"
      class="row"
    >

      <div
        class="col-xl-6 mb-4"
        v-for="i in 4"
        :key="i"
      >

        <div class="card custom-card">

          <div class="card-body">

            <div class="placeholder-line shimmer"></div>

            <div class="placeholder-line short shimmer"></div>

            <div class="placeholder-line shimmer"></div>

            <div class="placeholder-line short shimmer"></div>

          </div>

        </div>

      </div>

    </div>

    <!-- ===========================
        EMPTY STATE
    ============================ -->

    <div
      v-else-if="filteredOrders.length===0"
      class="empty-state"
    >

      <i class="bi bi-receipt"></i>

      <h3>No Orders Found</h3>

      <p>
        Orders matching your search will appear here.
      </p>

    </div>

    <!-- ===========================
        ORDERS
    ============================ -->

    <div
      v-else
      class="row"
    >

      <div
        class="col-xl-6 mb-4"
        v-for="order in filteredOrders"
        :key="order.id"
      >

        <div class="card order-card">

          <div class="card-body">

            <!-- HEADER -->

            <div class="order-header">

              <div>

                <h5>

                  {{ order.user?.firstname }}

                  {{ order.user?.lastname }}

                </h5>

                <small>

                  Order #{{ order.id }}

                </small>

              </div>

              <div class="text-end">

                <h4 class="price">

                  ₦{{ order.total }}

                </h4>

                <span
                  class="badge"
                  :class="statusBadge(order.status)"
                >
                  {{ statusLabel(order.status) }}
                </span>

              </div>

            </div>

            <!-- DATE -->

            <div class="date">

              {{ order.created_at }}

            </div>

            <!-- ITEMS -->

            <div class="items">

              <div
                v-for="item in order.items"
                :key="item.id"
                class="item-row"
              >

                <div>

                  <strong>

                    {{ item.food?.name }}

                  </strong>

                  <div class="qty">

                    Qty:
                    {{ item.quantity }}

                  </div>

                </div>

                <strong>

                  ₦{{ item.price }}

                </strong>

              </div>

            </div>

            <!-- ACTIONS -->

            <div class="actions">

              <button
  v-if="nextStatus(order.status)"
  class="btn btn-primary"
  @click="confirmAction(order)"
>
  {{ nextStatus(order.status).label }}
</button>

              <div
                v-else-if="
                  order.status==='ready_for_pickup'
                "
                class="waiting-badge"
              >

                📦 Waiting For Rider

              </div>

              <div
                v-else-if="
                  order.status==='on_the_way'
                "
                class="waiting-badge dark"
              >

                🛵 Rider Delivering

              </div>

              <div
                v-else
                class="waiting-badge success"
              >

                ✅ Delivered

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>

  <!-- ===========================
     CONFIRM MODAL
=========================== -->

<div
  v-if="showModal"
  class="modal-overlay"
>
  <div class="confirm-modal">

    <h4>Update Order?</h4>

    <p>
      Are you sure you want to change this order to
      <strong>{{ nextAction?.label }}</strong>?
    </p>

    <div class="confirm-actions">

      <button
        class="btn btn-light"
        @click="cancelModal"
      >
        Cancel
      </button>

      <button
        class="btn btn-primary"
        @click="updateStatus"
      >
        Yes, Update
      </button>

    </div>

  </div>
</div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import api from "../../services/api";

/* =========================
   STATE
========================= */

const orders = ref([]);
const loading =ref(true);

const search = ref("");
const filter = ref("all");

const showModal = ref(false);
const selectedOrder = ref(null);
const nextAction = ref(null);

/* =========================
   LOAD ORDERS
========================= */

const loadOrders = async () => {
  loading.value = true;

  try {
    const res = await api.get("/owner/orders");
    orders.value = res.data;
    console.log(res.data);
    
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

/* =========================
   FILTERED ORDERS
========================= */

const filteredOrders = computed(() => {
  let data = [...orders.value];

  if (filter.value !== "all") {
    data = data.filter(
      (o) => o.status === filter.value
    );
  }

  if (search.value.trim()) {
    const keyword = search.value.toLowerCase();

    data = data.filter((o) => {
      return (
        String(o.id).includes(keyword) ||
        `${o.user?.firstname} ${o.user?.lastname}`
          .toLowerCase()
          .includes(keyword)
      );
    });
  }

  return data;
});

/* =========================
   NEXT STATUS
========================= */

const nextStatus = (status) => {
  switch (status) {
    case "pending":
      return {
        label: "Accept Order",
        value: "accepted",
      };

    case "accepted":
      return {
        label: "Start Preparing",
        value: "preparing",
      };

    case "preparing":
      return {
        label: "Ready For Pickup",
        value: "ready_for_pickup",
      };

    default:
      return null;
  }
};

/* =========================
   CONFIRM MODAL
========================= */

const confirmAction = (order) => {
  selectedOrder.value = order;
  nextAction.value = nextStatus(order.status);

  showModal.value = true;
};

const cancelModal = () => {
  showModal.value = false;
  selectedOrder.value = null;
  nextAction.value = null;
};

const updateStatus = async () => {
  if (!selectedOrder.value || !nextAction.value) return;

  try {
    await api.put(`/owner/orders/${selectedOrder.value.id}`, {
      status: nextAction.value.value,
    });

    // Update the order on the page immediately
    selectedOrder.value.status = nextAction.value.value;

    cancelModal();
  } catch (err) {
    console.log(err);

    alert("Failed to update order.");
  }
};

/* =========================
   BADGES
========================= */

const statusBadge = (status) => {
  switch (status) {
    case "pending":
      return "badge-soft-secondary";

    case "accepted":
      return "badge-soft-primary";

    case "preparing":
      return "badge-soft-warning";

    case "ready_for_pickup":
      return "badge-soft-info";

    case "on_the_way":
      return "badge-soft-dark";

    case "delivered":
      return "badge-soft-success";

    default:
      return "badge-soft-secondary";
  }
};

const statusLabel = (status) => {
  switch (status) {
    case "pending":
      return "Pending";

    case "accepted":
      return "Accepted";

    case "preparing":
      return "Preparing";

    case "ready_for_pickup":
      return "Ready For Pickup";

    case "on_the_way":
      return "On The Way";

    case "delivered":
      return "Delivered";

    default:
      return status;
  }
};

/* =========================
   STATS
========================= */

const totalOrders = computed(() => orders.value.length);

const pendingOrders = computed(() =>
  orders.value.filter(
    (o) => o.status === "pending"
  ).length
);

const preparingOrders = computed(() =>
  orders.value.filter(
    (o) => o.status === "preparing"
  ).length
);

const deliveredOrders = computed(() =>
  orders.value.filter(
    (o) => o.status === "delivered"
  ).length
);

/* =========================
   INIT
========================= */

onMounted(loadOrders);
</script>


<style scoped>

/* ===========================
   PAGE
=========================== */

.page-header h2{
  color:#111827;
}

.page-header p{
  color:#6b7280;
}

/* ===========================
   STATS
=========================== */

.stat-card{
  border:none;
  border-radius:18px;
  overflow:hidden;
  transition:.25s;
}

.stat-card:hover{
  transform:translateY(-4px);
  box-shadow:0 18px 40px rgba(0,0,0,.08);
}

.stat-icon{
  width:58px;
  height:58px;
  border-radius:14px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:24px;
  background:#eef2ff;
}

.stat-title{
  color:#6b7280;
  font-size:14px;
}

.stat-value{
  font-size:30px;
  font-weight:700;
}

/* ===========================
   FILTER CARD
=========================== */

.filter-card{
  border:none;
  border-radius:18px;
}

.search-box{
  position:relative;
}

.search-box i{
  position:absolute;
  left:14px;
  top:50%;
  transform:translateY(-50%);
  color:#9ca3af;
}

.search-box input{
  padding-left:42px;
  height:48px;
  border-radius:12px;
}

.form-select{
  height:48px;
  border-radius:12px;
}

/* ===========================
   ORDER CARD
=========================== */

.order-card{
  border:none;
  border-radius:18px;
  transition:.25s;
  overflow:hidden;
}

.order-card:hover{
  transform:translateY(-3px);
  box-shadow:0 18px 35px rgba(0,0,0,.08);
}

.order-header{
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  gap:20px;
}

.order-id{
  font-size:20px;
  font-weight:700;
}

.customer-name{
  font-size:18px;
  font-weight:600;
}

.order-meta{
  color:#6b7280;
  font-size:14px;
}

.total{
  font-size:28px;
  font-weight:700;
}

.items-title{
  font-weight:600;
  margin-bottom:15px;
}

.item-row{
  display:flex;
  justify-content:space-between;
  padding:12px 0;
  border-bottom:1px solid #f3f4f6;
}

.item-row:last-child{
  border-bottom:none;
}

/* ===========================
   BUTTONS
=========================== */

.action-btn{
  border-radius:12px;
  padding:11px 22px;
  font-weight:600;
}

/* ===========================
   BADGES
=========================== */

.badge{
  padding:10px 16px;
  border-radius:30px;
  font-weight:600;
  font-size:13px;
}

.badge-soft-secondary{
  background:#f3f4f6;
  color:#4b5563;
}

.badge-soft-primary{
  background:#dbeafe;
  color:#1d4ed8;
}

.badge-soft-warning{
  background:#fef3c7;
  color:#92400e;
}

.badge-soft-info{
  background:#cffafe;
  color:#155e75;
}

.badge-soft-dark{
  background:#e5e7eb;
  color:#111827;
}

.badge-soft-success{
  background:#dcfce7;
  color:#166534;
}

/* ===========================
   EMPTY STATE
=========================== */

.empty-state{
  background:white;
  border-radius:18px;
  padding:70px 20px;
  text-align:center;
  box-shadow:0 8px 25px rgba(0,0,0,.04);
}

.empty-state .icon{
  font-size:70px;
  margin-bottom:20px;
}

.empty-state h4{
  font-weight:700;
}

.empty-state p{
  color:#6b7280;
}

/* ===========================
   LOADER
=========================== */

.skeleton{
  height:180px;
  border-radius:18px;
  background:linear-gradient(
      90deg,
      #f3f4f6 25%,
      #e5e7eb 37%,
      #f3f4f6 63%
  );
  background-size:400% 100%;
  animation:loading 1.3s infinite;
  margin-bottom:20px;
}

@keyframes loading{

0%{
background-position:100% 0;
}

100%{
background-position:-100% 0;
}

}

/* ===========================
   MODAL
=========================== */

.modal-overlay{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.45);
  display:flex;
  align-items:center;
  justify-content:center;
  z-index:9999;
}

.confirm-modal{
  width:420px;
  max-width:92%;
  background:white;
  border-radius:20px;
  padding:28px;
  animation:pop .2s ease;
}

.confirm-modal h4{
  font-weight:700;
}

.confirm-modal p{
  color:#6b7280;
}

.confirm-actions{
  display:flex;
  justify-content:flex-end;
  gap:12px;
  margin-top:24px;
}

@keyframes pop{

from{
transform:scale(.9);
opacity:0;
}

to{
transform:scale(1);
opacity:1;
}

}

/* ===========================
   MOBILE
=========================== */

@media(max-width:768px){

.order-header{
flex-direction:column;
}

.total{
font-size:22px;
}

.stat-value{
font-size:24px;
}

.confirm-actions{
flex-direction:column;
}

.confirm-actions button{
width:100%;
}

}

</style>