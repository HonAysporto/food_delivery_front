<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const sidebarOpen = ref(false);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const closeSidebar = () => {
  sidebarOpen.value = false;
};

const logout = () => {
  authStore.logout();
  router.push("/login");
};

const menuItems = [
  {
    title: "Dashboard",
    icon: "📊",
    path: "/admin/dashboard",
  },
  {
    title: "Users",
    icon: "👥",
    path: "/admin/users",
  },
  {
    title: "Restaurants",
    icon: "🏪",
    path: "/admin/restaurants",
  },
  {
    title: "Orders",
    icon: "📦",
    path: "/admin/orders",
  },
];
</script>

<template>
  <div class="admin-layout">

    <!-- Mobile Overlay -->
    <div
      v-if="sidebarOpen"
      class="overlay"
      @click="closeSidebar"
    ></div>

    <!-- Sidebar -->
    <aside
      class="sidebar"
      :class="{ open: sidebarOpen }"
    >
      <div class="logo">
        <h3>🍔 Food Admin</h3>
        <small>Management Panel</small>
      </div>

      <nav>
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="menu-item"
          :class="{ active: route.path === item.path }"
          @click="closeSidebar"
        >
          <span class="icon">
            {{ item.icon }}
          </span>

          {{ item.title }}
        </router-link>
      </nav>

      <button
        class="logout-btn"
        @click="logout"
      >
        🚪 Logout
      </button>
    </aside>

    <!-- Main -->
    <div class="main">

      <!-- Topbar -->
      <header class="topbar">

        <button
          class="hamburger"
          @click="toggleSidebar"
        >
          ☰
        </button>

        <div>
          <h5 class="m-0 fw-bold">
            {{
              menuItems.find(
                m => m.path === route.path
              )?.title
            }}
          </h5>
        </div>

        <div class="admin-info">
          <div class="avatar">
            {{ authStore.user?.firstname?.charAt(0) }}
          </div>

          <div>
            <strong>
              {{ authStore.user?.firstname }}
            </strong>

            <small>Administrator</small>
          </div>
        </div>

      </header>

      <!-- Page -->
      <main class="content">
        <router-view />
      </main>

    </div>

  </div>
</template>

<style scoped>
.admin-layout{
    display:flex;
    min-height:100vh;
    background:#f4f6f9;
}

/* Sidebar */

.sidebar{
    width:260px;
    background:#111827;
    color:white;
    display:flex;
    flex-direction:column;
    padding:25px;
    transition:.3s;
}

.logo{
    margin-bottom:40px;
}

.logo h3{
    margin-bottom:5px;
}

.logo small{
    color:#9ca3af;
}

nav{
    display:flex;
    flex-direction:column;
    gap:10px;
}

.menu-item{
    color:#d1d5db;
    text-decoration:none;
    padding:14px;
    border-radius:12px;
    transition:.25s;
    display:flex;
    align-items:center;
    gap:12px;
}

.menu-item:hover{
    background:#1f2937;
    color:white;
}

.active{
    background:#2563eb;
    color:white;
}

.icon{
    width:24px;
}

.logout-btn{
    margin-top:auto;
    border:none;
    background:#ef4444;
    color:white;
    padding:12px;
    border-radius:10px;
    cursor:pointer;
}

.logout-btn:hover{
    background:#dc2626;
}

/* Main */

.main{
    flex:1;
    display:flex;
    flex-direction:column;
}

.topbar{
    background:white;
    height:70px;
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:0 30px;
    border-bottom:1px solid #e5e7eb;
}

.admin-info{
    display:flex;
    align-items:center;
    gap:12px;
}

.avatar{
    width:45px;
    height:45px;
    border-radius:50%;
    background:#2563eb;
    color:white;
    display:flex;
    justify-content:center;
    align-items:center;
    font-weight:bold;
    font-size:18px;
}

.content{
    padding:30px;
}

/* Mobile */

.hamburger{
    display:none;
    background:none;
    border:none;
    font-size:25px;
}

.overlay{
    position:fixed;
    inset:0;
    background:rgba(0,0,0,.45);
    z-index:998;
}

@media(max-width:992px){

.sidebar{
    position:fixed;
    left:-270px;
    top:0;
    bottom:0;
    z-index:999;
}

.sidebar.open{
    left:0;
}

.hamburger{
    display:block;
}

.content{
    padding:20px;
}

.topbar{
    padding:0 20px;
}

}
</style>