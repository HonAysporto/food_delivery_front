<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";


const route = useRoute();
const router = useRouter();

const form = ref({
  email: "",
  token: "",
  password: "",
  password_confirmation: "",
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const loading = ref(false);
const success = ref("");
const error = ref("");

import { watch } from "vue";

watch(
  () => route.query,
  (query) => {
    form.value.email = query.email || "";
    form.value.token = query.token || "";

    console.log("Email:", form.value.email);
    console.log("Token:", form.value.token);
  },
  {
    immediate: true,
  }
);

console.log(route.query);

console.log("Email:", form.value.email);
console.log("Token:", form.value.token);

const resetPassword = async () => {
  loading.value = true;
  error.value = "";
  success.value = "";

  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/api/reset-password",
      form.value
    );

    success.value = response.data.message;

    setTimeout(() => {
      router.push("/login");
    }, 2500);
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      "Unable to reset password.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div
    style="
      min-height:100vh;
      display:flex;
      justify-content:center;
      align-items:center;
      background:linear-gradient(135deg,#00d084,#00a86b);
    "
  >
    <div
      style="
        width:450px;
        background:white;
        border-radius:20px;
        padding:35px;
      "
    >
      <h2>Create New Password</h2>

      <p style="color:#666;margin-bottom:20px;">
        Choose a strong password for your account.
      </p>

      <input
        v-model="form.password"
        :type="showPassword ? 'text':'password'"
        placeholder="New Password"
        class="form-control mb-3"
      />

      <button
        type="button"
        @click="showPassword=!showPassword"
      >
        {{showPassword ? "Hide" : "Show"}}
      </button>

      <br><br>

      <input
        v-model="form.password_confirmation"
        :type="showConfirmPassword ? 'text':'password'"
        placeholder="Confirm Password"
        class="form-control"
      />

      <button
        type="button"
        @click="showConfirmPassword=!showConfirmPassword"
      >
        {{showConfirmPassword ? "Hide" : "Show"}}
      </button>

      <br><br>

      <button
        @click="resetPassword"
        :disabled="loading"
        class="btn btn-success w-100"
      >
        {{loading ? "Updating..." : "Reset Password"}}
      </button>

      <p
        v-if="success"
        style="color:green;margin-top:15px;"
      >
        {{success}}
      </p>

      <p
        v-if="error"
        style="color:red;margin-top:15px;"
      >
        {{error}}
      </p>
    </div>
  </div>
</template>