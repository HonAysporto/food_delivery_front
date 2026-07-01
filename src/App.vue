<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "./stores/auth";
import CartButton from "./components/CartButton.vue";
import BottomNv from "./components/BottomNv.vue";
import { useRoute } from "vue-router";

const authStore = useAuthStore();
const route = useRoute();

onMounted(async () => {
  if (authStore.token && !authStore.user) {
    await authStore.fetchUser();
  }
});
</script>

<template>
  <router-view />

  <!-- ONLY show for non-owner pages -->
  <CartButton v-if="route.path.startsWith('/user')" />
  <BottomNv v-if="route.path.startsWith('/user')" />
</template>

<style>
body {
  
}

/* GLOBAL DARK MODE SUPPORT */
body {
  background: var(--bg);
  color: var(--text);
}

.card {
  background: var(--card);
  color: var(--text);
}

:root {
  --bg: #f5f6fa;
  --text: #111;
  --card: #ffffff;
}

[data-theme="dark"] {
  --bg: #0f172a;
  --text: #e5e7eb;
  --card: #1e293b;
}
</style>