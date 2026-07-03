<script setup>
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { useAuthStore } from "../stores/auth";



const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
  const token = route.query.token;

  if (!token) {
    return router.push("/login");
  }

  try {
    await authStore.googleLogin(token);

    const role = authStore.user.role;

    if (role === "admin") {
      router.push("/admin/dashboard");
    } else if (role === "owner") {
      router.push("/owner/dashboard");
    } else if (role === "rider") {
      router.push("/rider/dashboard");
    } else {
      router.push("/");
    }

  } catch (e) {
    authStore.logout();
    router.push("/login");
  }
});
</script>

<template>
  <div
    style="
      height:100vh;
      display:flex;
      justify-content:center;
      align-items:center;
      font-size:22px;
    "
  >
    Signing you in with Google...
  </div>
</template>