<script setup>
import { ref, onMounted } from "vue";
import api from "../../services/api";

const users = ref([]);

const loadUsers = async () => {

  const res = await api.get(
    "/admin/users"
  );

  users.value = res.data;
};

const suspendUser = async (id) => {

  await api.put(
    `/admin/users/${id}/suspend`
  );

  loadUsers();
};

const activateUser = async (id) => {

  await api.put(
    `/admin/users/${id}/activate`
  );

  loadUsers();
};

onMounted(loadUsers);
</script>

<template>

<div class="container py-4">

<h2 class="mb-4">
👥 User Management
</h2>

<div
v-for="user in users"
:key="user.id"
class="card p-3 mb-3"
>

<h5>
{{ user.firstname }}
{{ user.lastname }}
</h5>

<p>
{{ user.email }}
</p>

<p>

Role:

<span class="badge bg-primary">
{{ user.role }}
</span>

</p>

<p>

Status:

<span
class="badge"
:class="
user.status === 'active'
? 'bg-success'
: 'bg-danger'
"
>
{{ user.status }}
</span>

</p>

<button
v-if="user.status === 'active'"
class="btn btn-danger"
@click="suspendUser(user.id)"
>
Suspend
</button>

<button
v-else
class="btn btn-success"
@click="activateUser(user.id)"
>
Activate
</button>

</div>

</div>

</template>