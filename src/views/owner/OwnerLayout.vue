<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const sidebarOpen = ref(false);

/* DARK MODE */
const isDark = ref(localStorage.getItem("theme") === "dark");

const toggleDark = () => {
  isDark.value = !isDark.value;

  localStorage.setItem("theme", isDark.value ? "dark" : "light");

  document.documentElement.setAttribute(
    "data-theme",
    isDark.value ? "dark" : "light"
  );
};

/* INIT THEME */
onMounted(() => {
  document.documentElement.setAttribute(
    "data-theme",
    isDark.value ? "dark" : "light"
  );
});

/* NAV LINKS */
const links = computed(() => {
  const menu = [
    { name: "Dashboard", path: "/owner/dashboard", icon: "📊" },
    { name: "Foods", path: "/owner/foods", icon: "🍔" },
    { name: "Categories", path: "/owner/categories", icon: "🍽️" },
    { name: "Orders", path: "/owner/orders", icon: "📦" },
    { name: "Profile", path: "/owner/profile", icon: "👤" },
  ];

  if (!authStore.user?.restaurant_exists) {
    menu.push({
      name: "Create Restaurant",
      path: "/owner/create-restaurant",
      icon: "🏪",
    });
  }

  return menu;
});

const isActive = (path) => route.path === path;

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const closeSidebar = () => {
  sidebarOpen.value = false;
};

const logout = async () => {
  await authStore.logout();
  router.push("/login");
};
</script>

<template>
  <div class="layout">

    <!-- OVERLAY -->
    <div
      v-if="sidebarOpen"
      class="overlay"
      @click="closeSidebar"
    ></div>

    <!-- SIDEBAR -->
    <aside :class="['sidebar', { open: sidebarOpen }]">

      <div class="brand">
        🍽️ Merchant Panel
      </div>

      <div class="user">
        <strong>
          {{ authStore.user?.firstname }}
        </strong>
        <small>{{ authStore.user?.role }}</small>
      </div>

      <nav class="nav">
<router-link
  v-for="link in links"
  :key="link.path"
  :to="link.path"
  class="nav-item"
  :class="{ active: isActive(link.path) }"
  @click="closeSidebar"
>
  <span class="icon">{{ link.icon }}</span>
  <span>{{ link.name }}</span>
</router-link>

      </nav>

      <div class="bottom">

        <button class="btn dark" @click="toggleDark">
          {{ isDark ? "☀️ Light Mode" : "🌙 Dark Mode" }}
        </button>

        <button class="btn logout" @click="logout">
          🚪 Sign Out
        </button>

      </div>

    </aside>

    <!-- MAIN -->
    <div class="main">

      <!-- TOPBAR -->
      <header class="topbar">

        <button class="hamburger" @click="toggleSidebar">
          ☰
        </button>

        <div class="title">
          {{ route.meta?.title || "Dashboard" }}
        </div>

        <div class="right">
          <span class="role">
            {{ authStore.user?.role }}
          </span>
        </div>

      </header>

      <!-- PAGE CONTENT -->
      <main class="content">
        <router-view />
      </main>

    </div>

  </div>
</template>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
  background: var(--bg);
  color: var(--text);
}

/* SIDEBAR */
.sidebar {
  width: 260px;
  background: #0f172a;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.brand {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}

.user {
  margin-bottom: 20px;
  opacity: 0.8;
}

.nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav-item {
  display: flex;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
  color: #cbd5e1;
  text-decoration: none;
}

.nav-item:hover {
  background: #1e293b;
}

.nav-item.active {
  background: #2563eb;
  color: white;
}

/* BUTTONS */
.bottom {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn {
  padding: 10px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.dark {
  background: #334155;
  color: white;
}

.logout {
  background: #ef4444;
  color: white;
}

/* MAIN */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* TOPBAR */
.topbar {
  height: 60px;
  background: var(--card);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  border-bottom: 1px solid #e5e7eb;
}

.hamburger {
  display: none;
  font-size: 22px;
  background: none;
  border: none;
}

.content {
  padding: 20px;
  overflow-y: auto;
}

/* OVERLAY */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 10;
}

/* MOBILE */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: -270px;
    height: 100%;
    transition: 0.3s;
    z-index: 20;
  }

  .sidebar.open {
    left: 0;
  }

  .hamburger {
    display: block;
  }
}
</style>