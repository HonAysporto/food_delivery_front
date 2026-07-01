<script setup>
import { ref, onMounted } from "vue";
import api from "../../services/api";

const orders = ref([]);
const loading = ref(true);

const loadOrders = async () => {
  loading.value = true;

  try {
    const res = await api.get("/admin/orders");
    orders.value = res.data;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const badgeClass = (status) => {
  switch (status) {
    case "pending":
      return "pending";

    case "accepted":
      return "accepted";

    case "preparing":
      return "preparing";

    case "out_for_delivery":
      return "delivery";

    case "delivered":
      return "delivered";

    default:
      return "";
  }
};

onMounted(loadOrders);
</script>

<template>
<div class="orders-page">

    <div class="page-header">

        <div>
            <h2>Orders</h2>
            <p>
                View every order placed across the platform.
            </p>
        </div>

        <div class="count-card">
            {{ orders.length }} Orders
        </div>

    </div>

    <div
        v-if="loading"
        class="loading"
    >
        Loading orders...
    </div>

    <div
        v-else
        class="orders-list"
    >

        <div
            class="order-card"
            v-for="order in orders"
            :key="order.id"
        >

            <!-- HEADER -->

            <div class="order-header">

                <div>

                    <h4>
                        Order #{{ order.id }}
                    </h4>

                    <small>
                        Customer
                    </small>

                    <h6>
                        {{ order.user?.firstname }}
                        {{ order.user?.lastname }}
                    </h6>

                </div>

                <div class="right">

                    <span
                        class="badge"
                        :class="badgeClass(order.status)"
                    >
                        {{ order.status }}
                    </span>

                    <h3>
                        ₦{{ order.total }}
                    </h3>

                </div>

            </div>

            <hr>

            <!-- ITEMS -->

            <table>

                <thead>

                    <tr>

                        <th>Food</th>

                        <th>Qty</th>

                        <th>Price</th>

                    </tr>

                </thead>

                <tbody>

                    <tr
                        v-for="item in order.items"
                        :key="item.id"
                    >

                        <td>
                            {{ item.food?.name }}
                        </td>

                        <td>
                            {{ item.quantity }}
                        </td>

                        <td>
                            ₦{{ item.price }}
                        </td>

                    </tr>

                </tbody>

            </table>

        </div>

    </div>

</div>
</template>

<style scoped>

.orders-page{
display:flex;
flex-direction:column;
gap:25px;
}

.page-header{
display:flex;
justify-content:space-between;
align-items:center;
}

.page-header h2{
font-weight:700;
margin-bottom:5px;
}

.page-header p{
color:#6b7280;
}

.count-card{
background:#2563eb;
color:white;
padding:12px 20px;
border-radius:12px;
font-weight:600;
}

.orders-list{
display:flex;
flex-direction:column;
gap:20px;
}

.order-card{
background:white;
border-radius:18px;
padding:25px;
box-shadow:0 6px 18px rgba(0,0,0,.05);
}

.order-header{
display:flex;
justify-content:space-between;
align-items:center;
}

.order-header h4{
margin-bottom:6px;
}

.order-header h6{
margin-top:4px;
}

.right{
text-align:right;
}

.right h3{
margin-top:12px;
color:#2563eb;
font-weight:700;
}

table{
width:100%;
border-collapse:collapse;
margin-top:20px;
}

th{
background:#f8fafc;
padding:14px;
text-align:left;
}

td{
padding:14px;
border-top:1px solid #eee;
}

.badge{
padding:7px 14px;
border-radius:30px;
font-size:13px;
font-weight:600;
text-transform:capitalize;
}

.pending{
background:#fef3c7;
color:#92400e;
}

.accepted{
background:#dbeafe;
color:#1d4ed8;
}

.preparing{
background:#fde68a;
color:#92400e;
}

.delivery{
background:#cffafe;
color:#155e75;
}

.delivered{
background:#dcfce7;
color:#166534;
}

.loading{
background:white;
padding:40px;
border-radius:16px;
text-align:center;
}

@media(max-width:768px){

.page-header{
flex-direction:column;
align-items:flex-start;
gap:15px;
}

.order-header{
flex-direction:column;
align-items:flex-start;
gap:20px;
}

.right{
text-align:left;
}

table{
display:block;
overflow-x:auto;
white-space:nowrap;
}

}

</style>