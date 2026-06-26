<script setup>
import { ref, onMounted } from "vue";
import api from "../../services/api";

const orders = ref([]);
const loading = ref(true);

const loadOrders = async () => {
  try {
    const res = await api.get("/owner/orders");
    orders.value = res.data;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const updateStatus = async (order, status) => {
  try {
    await api.put(`/owner/orders/${order.id}`, {
      status,
    });

    order.status = status;
  } catch (err) {
    console.log(err);
  }
};

// OWNER WORKFLOW
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

// BADGE COLOR
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

// FRIENDLY LABEL
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

onMounted(loadOrders);
</script>

<template>
  <div class="container py-4">

    <!-- HEADER -->

    <div class="mb-4">
      <h2 class="fw-bold mb-1">
        📦 Orders
      </h2>

      <p class="text-muted mb-0">
        Manage incoming customer orders
      </p>
    </div>

    <!-- LOADING -->

    <div
      v-if="loading"
      class="text-center py-5 text-muted"
    >
      Loading orders...
    </div>

    <!-- EMPTY -->

    <div
      v-else-if="orders.length === 0"
      class="alert alert-light border text-center"
    >
      No orders available yet
    </div>

    <!-- ORDERS -->

    <div
      v-for="order in orders"
      :key="order.id"
      class="order-card card border-0 shadow-sm mb-4"
    >
      <div class="card-body">

        <!-- TOP -->

        <div
          class="d-flex justify-content-between align-items-start mb-3"
        >

          <div>

            <h5 class="fw-semibold mb-1">
              {{ order.user?.firstname }}
              {{ order.user?.lastname }}
            </h5>

            <small class="text-muted">
              Order #{{ order.id }}
            </small>

          </div>

          <div class="text-end">

            <div class="fw-bold fs-5">
              ₦{{ order.total }}
            </div>

            <span
              class="badge mt-2"
              :class="statusBadge(order.status)"
            >
              {{ statusLabel(order.status) }}
            </span>

          </div>

        </div>

        <hr>

        <!-- ITEMS -->

        <h6 class="fw-semibold mb-3">
          Ordered Items
        </h6>

        <div
          v-for="item in order.items"
          :key="item.id"
          class="d-flex justify-content-between py-2 border-bottom"
        >

          <span>
            {{ item.quantity }} ×
            {{ item.food?.name }}
          </span>

          <strong>
            ₦{{ item.price }}
          </strong>

        </div>

        <!-- ACTIONS -->

        <div
          class="d-flex justify-content-end mt-4"
        >

          <!-- Owner Progress -->

          <button
            v-if="nextStatus(order.status)"
            class="btn btn-primary"
            @click="
              updateStatus(
                order,
                nextStatus(order.status).value
              )
            "
          >
            {{ nextStatus(order.status).label }}
          </button>

          <!-- Waiting -->

          <span
            v-else-if="
              order.status === 'ready_for_pickup'
            "
            class="badge badge-soft-info fs-6 px-3 py-2"
          >
            📦 Waiting For Rider
          </span>

          <!-- Rider -->

          <span
            v-else-if="
              order.status === 'on_the_way'
            "
            class="badge badge-soft-dark fs-6 px-3 py-2"
          >
            🛵 Rider Delivering
          </span>

          <!-- Delivered -->

          <span
            v-else-if="
              order.status === 'delivered'
            "
            class="badge badge-soft-success fs-6 px-3 py-2"
          >
            ✅ Delivered
          </span>

        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>

.order-card{
  border-radius:16px;
  transition:.25s;
}

.order-card:hover{
  transform:translateY(-2px);
}

.badge-soft-secondary{
  background:#e5e7eb;
  color:#374151;
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
  color:#0e7490;
}

.badge-soft-success{
  background:#dcfce7;
  color:#166534;
}

.badge-soft-dark{
  background:#e5e7eb;
  color:#111827;
}

</style>