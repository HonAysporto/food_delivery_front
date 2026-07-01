<script setup>
import { ref, onMounted } from "vue";
import api from "../../services/api";

const users = ref([]);
const loading = ref(true);

const loadUsers = async () => {
  loading.value = true;

  try {
    const res = await api.get("/admin/users");
    users.value = res.data;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const suspendUser = async (id) => {
  try {
    await api.put(`/admin/users/${id}/suspend`);
    loadUsers();
  } catch (err) {
    console.log(err);
  }
};

const activateUser = async (id) => {
  try {
    await api.put(`/admin/users/${id}/activate`);
    loadUsers();
  } catch (err) {
    console.log(err);
  }
};

const initials = (user) => {
  return (
    user.firstname.charAt(0) +
    user.lastname.charAt(0)
  ).toUpperCase();
};

onMounted(loadUsers);
</script>

<template>
<div class="users-page">

<div class="page-header">

<div>
<h2>User Management</h2>
<p>
Manage all registered users on the platform.
</p>
</div>

<div class="count-card">
{{ users.length }} Users
</div>

</div>

<div
v-if="loading"
class="loading"
>
Loading users...
</div>

<div
v-else
class="table-card"
>

<table>

<thead>

<tr>
<th>User</th>
<th>Email</th>
<th>Role</th>
<th>Status</th>
<th class="text-end">
Action
</th>
</tr>

</thead>

<tbody>

<tr
v-for="user in users"
:key="user.id"
>

<td>

<div class="user-info">

<div class="avatar">
{{ initials(user) }}
</div>

<div>

<strong>
{{ user.firstname }}
{{ user.lastname }}
</strong>

<small>
ID #{{ user.id }}
</small>

</div>

</div>

</td>

<td>
{{ user.email }}
</td>

<td>

<span
class="role"
:class="user.role"
>
{{ user.role }}
</span>

</td>

<td>

<span
class="status"
:class="user.status"
>
{{ user.status }}
</span>

</td>

<td class="text-end">

<button
v-if="user.status=='active'"
class="danger-btn"
@click="suspendUser(user.id)"
>
Suspend
</button>

<button
v-else
class="success-btn"
@click="activateUser(user.id)"
>
Activate
</button>

</td>

</tr>

</tbody>

</table>

</div>

</div>
</template>

<style scoped>

.users-page{
display:flex;
flex-direction:column;
gap:25px;
}

/* HEADER */

.page-header{
display:flex;
justify-content:space-between;
align-items:center;
}

.page-header h2{
margin-bottom:5px;
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

/* TABLE */

.table-card{
background:white;
border-radius:18px;
overflow:hidden;
box-shadow:0 5px 20px rgba(0,0,0,.05);
}

table{
width:100%;
border-collapse:collapse;
}

thead{
background:#f8fafc;
}

th{
padding:18px;
text-align:left;
font-size:14px;
color:#6b7280;
}

td{
padding:18px;
border-top:1px solid #eee;
}

.user-info{
display:flex;
align-items:center;
gap:15px;
}

.avatar{
width:45px;
height:45px;
background:#2563eb;
border-radius:50%;
display:flex;
justify-content:center;
align-items:center;
font-weight:bold;
color:white;
}

.user-info small{
display:block;
color:#9ca3af;
margin-top:4px;
}

.role{
padding:6px 12px;
border-radius:30px;
font-size:13px;
font-weight:600;
text-transform:capitalize;
}

.role.admin{
background:#dbeafe;
color:#1d4ed8;
}

.role.owner{
background:#dcfce7;
color:#15803d;
}

.role.customer{
background:#ede9fe;
color:#7c3aed;
}

.status{
padding:6px 12px;
border-radius:30px;
font-size:13px;
font-weight:600;
text-transform:capitalize;
}

.status.active{
background:#dcfce7;
color:#15803d;
}

.status.suspended{
background:#fee2e2;
color:#dc2626;
}

.danger-btn,
.success-btn{
border:none;
padding:10px 16px;
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
border-radius:16px;
text-align:center;
}

.text-end{
text-align:right;
}

/* MOBILE */

@media(max-width:900px){

.table-card{
overflow-x:auto;
}

table{
min-width:900px;
}

.page-header{
flex-direction:column;
align-items:flex-start;
gap:15px;
}

}

</style>