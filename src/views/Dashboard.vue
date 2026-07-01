<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import api from "../services/api";
import { useToast } from "vue-toastification";

const toast = useToast();
const auth = useAuthStore();

const loading = ref(false);
const changingPassword = ref(false);

const profile = ref({
  firstname: auth.user.firstname,
  lastname: auth.user.lastname,
  email: auth.user.email,
});

const password = ref({
  current_password: "",
  new_password: "",
  confirm_password: "",
});

const updateProfile = async () => {
  loading.value = true;

  try {
    const res = await api.put("/profile", {
      firstname: profile.value.firstname,
      lastname: profile.value.lastname,
    });

    auth.user = res.data.user;

    toast.success("Profile updated successfully");
  } catch (err) {
    toast.error(err.response?.data?.message || "Unable to update profile");
  } finally {
    loading.value = false;
  }
};

const changePassword = async () => {
  if (password.value.new_password !== password.value.confirm_password) {
    toast.error("Passwords do not match");
    return;
  }

  changingPassword.value = true;

  try {
    await api.put("/profile/password", {
      current_password: password.value.current_password,
      new_password: password.value.new_password,
    });

    password.value = {
      current_password: "",
      new_password: "",
      confirm_password: "",
    };

    toast.success("Password changed successfully");
  } catch (err) {
    toast.error(err.response?.data?.message || "Unable to change password");
  } finally {
    changingPassword.value = false;
  }
};
</script>

<template>
<div class="container py-5">

<div class="profile-header">

<div class="avatar">
👤
</div>

<div>
<h2>{{ auth.user.firstname }} {{ auth.user.lastname }}</h2>
<p>{{ auth.user.email }}</p>
</div>

</div>

<div class="row mt-5">

<div class="col-lg-6">

<div class="card shadow-sm border-0 rounded-4">

<div class="card-body p-4">

<h4 class="mb-4">
Profile Information
</h4>

<div class="mb-3">
<label>First Name</label>

<input
v-model="profile.firstname"
class="form-control"
/>

</div>

<div class="mb-3">
<label>Last Name</label>

<input
v-model="profile.lastname"
class="form-control"
/>

</div>

<div class="mb-4">
<label>Email</label>

<input
v-model="profile.email"
class="form-control"
readonly
/>
</div>

<button
class="btn btn-success w-100"
@click="updateProfile"
:disabled="loading"
>

<span
v-if="loading"
class="spinner-border spinner-border-sm me-2"
></span>

Save Changes

</button>

</div>

</div>

</div>

<div class="col-lg-6 mt-4 mt-lg-0">

<div class="card shadow-sm border-0 rounded-4">

<div class="card-body p-4">

<h4 class="mb-4">
Change Password
</h4>

<div class="mb-3">

<label>Current Password</label>

<input
type="password"
v-model="password.current_password"
class="form-control"
/>

</div>

<div class="mb-3">

<label>New Password</label>

<input
type="password"
v-model="password.new_password"
class="form-control"
/>

</div>

<div class="mb-4">

<label>Confirm Password</label>

<input
type="password"
v-model="password.confirm_password"
class="form-control"
/>

</div>

<button
class="btn btn-dark w-100"
@click="changePassword"
:disabled="changingPassword"
>

<span
v-if="changingPassword"
class="spinner-border spinner-border-sm me-2"
></span>

Update Password

</button>

</div>

</div>

</div>

</div>

</div>
</template>

<style scoped>

.profile-header{
display:flex;
align-items:center;
gap:20px;
background:linear-gradient(135deg,#00c896,#00a86b);
padding:35px;
border-radius:25px;
color:white;
}

.avatar{
width:90px;
height:90px;
border-radius:50%;
background:white;
display:flex;
align-items:center;
justify-content:center;
font-size:40px;
}

.card{
transition:.3s;
}

.card:hover{
transform:translateY(-4px);
}

label{
font-weight:600;
margin-bottom:6px;
display:block;
}

.form-control{
border-radius:12px;
height:48px;
}

.btn{
border-radius:12px;
height:50px;
font-weight:600;
}

@media(max-width:768px){

.profile-header{
flex-direction:column;
text-align:center;
padding:25px;
}

.avatar{
width:80px;
height:80px;
font-size:35px;
}

}

</style>