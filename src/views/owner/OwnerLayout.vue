<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

/* ======================
   STATE
====================== */
const sidebarOpen = ref(false);
const isDark = ref(localStorage.getItem("theme") === "dark");

/* ======================
   COMPUTED FIX (IMPORTANT)
====================== */
const hasRestaurant = computed(() => {
  return !!authStore.user?.restaurant_exists;
});

/* ======================
   LINKS
====================== */
const links = [
  { name: "Dashboard", path: "/owner/dashboard", icon: "📊" },
  { name: "Foods", path: "/owner/foods", icon: "🍔" },
  { name: "Categories", path: "/owner/categories", icon: "🍽️" },
  { name: "Orders", path: "/owner/orders", icon: "📦" },
  { name: "Profile", path: "/owner/profile", icon: "👤" },
];

/* ======================
   FUNCTIONS
====================== */
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

const isActive = (path) => route.path === path;

const toggleDarkMode = () => {
  isDark.value = !isDark.value;
  localStorage.setItem("theme", isDark.value ? "dark" : "light");

  document.documentElement.setAttribute(
    "data-theme",
    isDark.value ? "dark" : "light"
  );
};

onMounted(() => {
  document.documentElement.setAttribute(
    "data-theme",
    isDark.value ? "dark" : "light"
  );
});
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
        🍽️ Food Admin
      </div>

      <nav class="nav">

        <!-- MAIN LINKS -->
        <router-link
          v-for="link in links"
          :key="link.path"
          :to="link.path"
          class="nav-item"
          :class="{ active: isActive(link.path) }"
          @click="closeSidebar"
        >
          <span>{{ link.icon }}</span>
          <span>{{ link.name }}</span>
        </router-link>

        <!-- CREATE RESTAURANT (FIXED) -->
        <router-link
          v-if="!hasRestaurant"
          to="/owner/create-restaurant"
          class="nav-item create-restaurant"
          @click="closeSidebar"
        >
          🍽️ Create Restaurant
        </router-link>

      </nav>

      <!-- DARK MODE -->
      <button class="dark-btn" @click="toggleDarkMode">
        {{ isDark ? "☀️ Light Mode" : "🌙 Dark Mode" }}
      </button>

      <!-- LOGOUT -->
      <button class="logout" @click="logout">
        🚪 Sign Out
      </button>

    </aside>

    <!-- MAIN -->
    <div class="main">

      <header class="topbar">

        <button class="hamburger" @click="toggleSidebar">
          ☰
        </button>

        <div>
          Welcome, <strong>{{ authStore.user?.firstname }}</strong>
        </div>

        <div class="profile">
          👤 {{ authStore.user?.role }}
        </div>

      </header>

      <main class="content">
        <router-view />
      </main>

    </div>

  

  </div>
</template>

<style scoped>
/* LAYOUT */
.layout {
  display: flex;
  height: 100vh;
  background: var(--bg);
  color: var(--text);
}

/* SIDEBAR */
.sidebar {
  width: 250px;
  background: #111827;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
  transition: 0.3s;
}

.brand {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 30px;
}

/* NAV */
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
  transition: 0.2s;
}

.nav-item:hover {
  background: #1f2937;
}

.nav-item.active {
  background: #2563eb;
  color: white;
}

/* CREATE BUTTON */
.create-restaurant {
  background: #10b981;
  color: white;
  font-weight: 500;
}

/* BUTTONS */
.logout {
  background: #ef4444;
  border: none;
  padding: 10px;
  border-radius: 8px;
  color: white;
  margin-top: 10px;
  cursor: pointer;
}

.dark-btn {
  background: #374151;
  border: none;
  padding: 10px;
  border-radius: 8px;
  color: white;
  margin-bottom: 10px;
  cursor: pointer;
}

/* MAIN */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* TOPBAR */
.topbar {
  background: var(--card);
  padding: 15px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e5e7eb;
}

/* CONTENT */
.content {
  padding: 20px;
  overflow-y: auto;
}

/* HAMBURGER */
.hamburger {
  display: none;
  font-size: 22px;
  background: none;
  border: none;
  cursor: pointer;
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
    left: -260px;
    top: 0;
    height: 100%;
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