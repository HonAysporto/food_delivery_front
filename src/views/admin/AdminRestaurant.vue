<script setup>
import { ref, onMounted } from "vue";
import api from "../../services/api";

const restaurants = ref([]);

const loadRestaurants = async () => {

  const res = await api.get(
    "/admin/restaurants"
  );

  restaurants.value = res.data;
};

const suspendRestaurant = async (id) => {

  await api.put(
    `/admin/restaurants/${id}/suspend`
  );

  loadRestaurants();
};

const activateRestaurant = async (id) => {

  await api.put(
    `/admin/restaurants/${id}/activate`
  );

  loadRestaurants();
};

onMounted(loadRestaurants);
</script>

<template>

<div class="container py-4">

<h2 class="mb-4">
🏪 Restaurant Management
</h2>

<div
v-for="restaurant in restaurants"
:key="restaurant.id"
class="card mb-3 p-3"
>

<h5>
{{ restaurant.name }}
</h5>

<p>
Owner:
{{ restaurant.owner?.firstname }}
{{ restaurant.owner?.lastname }}
</p>

<p>
Status:

<span
class="badge"
:class="
restaurant.status === 'active'
? 'bg-success'
: 'bg-danger'
"
>
{{ restaurant.status }}
</span>

</p>


<button
v-if="
restaurant.status === 'active'
"
class="btn btn-danger"
@click="
suspendRestaurant(
restaurant.id
)
"
>
Suspend
</button>

<button
v-else
class="btn btn-success"
@click="
activateRestaurant(
restaurant.id
)
"
>
Activate
</button>

</div>

</div>

</template>