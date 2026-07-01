<script setup>
import { ref, onMounted } from "vue";
import api from "../../services/api";

const restaurants = ref([]);
const loading = ref(true);

const loadRestaurants = async () => {
  loading.value = true;

  try {
    const res = await api.get("/admin/restaurants");
    restaurants.value = res.data;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const suspendRestaurant = async (id) => {
  try {
    await api.put(`/admin/restaurants/${id}/suspend`);
    loadRestaurants();
  } catch (err) {
    console.log(err);
  }
};

const activateRestaurant = async (id) => {
  try {
    await api.put(`/admin/restaurants/${id}/activate`);
    loadRestaurants();
  } catch (err) {
    console.log(err);
  }
};

const initials = (restaurant) => {
  return restaurant.name.charAt(0).toUpperCase();
};

onMounted(loadRestaurants);
</script>

<template>
<div class="restaurants-page">

    <div class="page-header">

        <div>
            <h2>Restaurant Management</h2>
            <p>
                Monitor and manage restaurants across the platform.
            </p>
        </div>

        <div class="count-card">
            {{ restaurants.length }} Restaurants
        </div>

    </div>

    <div
        v-if="loading"
        class="loading"
    >
        Loading restaurants...
    </div>

    <div
        v-else
        class="restaurant-grid"
    >

        <div
            v-for="restaurant in restaurants"
            :key="restaurant.id"
            class="restaurant-card"
        >

            <div class="top">

                <div class="avatar">
                    {{ initials(restaurant) }}
                </div>

                <div class="restaurant-info">

                    <h4>
                        {{ restaurant.name }}
                    </h4>

                    <p>
                        Owner:
                        <strong>
                            {{ restaurant.owner?.firstname }}
                            {{ restaurant.owner?.lastname }}
                        </strong>
                    </p>

                </div>

            </div>

            <div class="divider"></div>

            <div class="details">

                <div class="row-item">
                    <span>Status</span>

                    <span
                        class="badge"
                        :class="restaurant.status"
                    >
                        {{ restaurant.status }}
                    </span>
                </div>

                <div class="row-item">
                    <span>Restaurant ID</span>

                    <strong>#{{ restaurant.id }}</strong>
                </div>

            </div>

            <div class="actions">

                <button
                    v-if="restaurant.status=='active'"
                    class="danger-btn"
                    @click="suspendRestaurant(restaurant.id)"
                >
                    Suspend Restaurant
                </button>

                <button
                    v-else
                    class="success-btn"
                    @click="activateRestaurant(restaurant.id)"
                >
                    Activate Restaurant
                </button>

            </div>

        </div>

    </div>

</div>
</template>

<style scoped>

.restaurants-page{
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
margin-bottom:6px;
font-weight:700;
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

.restaurant-grid{
display:grid;
grid-template-columns:repeat(auto-fill,minmax(330px,1fr));
gap:20px;
}

.restaurant-card{
background:white;
border-radius:18px;
padding:22px;
box-shadow:0 6px 18px rgba(0,0,0,.05);
transition:.3s;
}

.restaurant-card:hover{
transform:translateY(-4px);
}

.top{
display:flex;
align-items:center;
gap:15px;
}

.avatar{
width:60px;
height:60px;
border-radius:50%;
background:#2563eb;
display:flex;
justify-content:center;
align-items:center;
font-size:24px;
font-weight:bold;
color:white;
}

.restaurant-info h4{
margin:0;
font-size:20px;
}

.restaurant-info p{
margin-top:6px;
color:#6b7280;
}

.divider{
height:1px;
background:#eee;
margin:20px 0;
}

.details{
display:flex;
flex-direction:column;
gap:15px;
}

.row-item{
display:flex;
justify-content:space-between;
align-items:center;
}

.badge{
padding:7px 14px;
border-radius:30px;
font-size:13px;
font-weight:600;
text-transform:capitalize;
}

.badge.active{
background:#dcfce7;
color:#15803d;
}

.badge.suspended{
background:#fee2e2;
color:#dc2626;
}

.actions{
margin-top:25px;
}

.actions button{
width:100%;
border:none;
padding:13px;
border-radius:10px;
cursor:pointer;
font-weight:600;
}

.danger-btn{
background:#ef4444;
color:white;
}

.success-btn{
background:#22c55e;
color:white;
}

.loading{
background:white;
padding:40px;
border-radius:18px;
text-align:center;
}

@media(max-width:768px){

.page-header{
flex-direction:column;
align-items:flex-start;
gap:15px;
}

.restaurant-grid{
grid-template-columns:1fr;
}

}

</style>