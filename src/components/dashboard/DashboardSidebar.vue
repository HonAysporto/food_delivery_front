<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";

import ThemeToggle from "./ThemeToggle.vue";

import {
  X,
  LogOut,
  User,
} from "lucide-vue-next";

const props = defineProps({
  menu: {
    type: Array,
    required: true,
  },

  open: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const initials = computed(() => {
  const first = authStore.user?.firstname?.charAt(0) || "";
  const last = authStore.user?.lastname?.charAt(0) || "";

  return (first + last).toUpperCase();
});

const logout = () => {
  authStore.logout();
  router.push("/login");
};

const isActive = (path) => {
  return route.path === path;
};

const closeSidebar = () => {
  emit("close");
};
</script>

<template>

  <!-- Mobile Overlay -->
  <div
    v-if="open"
    class="sidebar-overlay"
    @click="closeSidebar"
  />

  <aside
    class="dashboard-sidebar"
    :class="{ open }"
  >

    <!-- LOGO -->

    <div class="sidebar-logo">

      <div class="logo-circle">
        G
      </div>

      <div>

        <h5 class="mb-0 fw-bold">
          Glovo Clone
        </h5>

        <small class="text-muted">
          Dashboard
        </small>

      </div>

      <button
        class="close-btn d-lg-none"
        @click="closeSidebar"
      >
        <X :size="22" />
      </button>

    </div>

    <!-- USER -->

    <div class="sidebar-user">

      <div class="avatar">

        {{ initials }}

      </div>

      <div>

        <div class="fw-semibold">

          {{ authStore.user?.firstname }}
          {{ authStore.user?.lastname }}

        </div>

        <small class="text-muted">

          {{ authStore.user?.role }}

        </small>

      </div>

    </div>

    <!-- MENU -->

    <nav class="sidebar-menu">

      <router-link

        v-for="item in menu"

        :key="item.route"

        :to="item.route"

        class="sidebar-link"

        :class="{
          active: isActive(item.route),
        }"

        @click="closeSidebar"
      >

        <component
          :is="item.icon"
          :size="20"
        />

        <span>

          {{ item.title }}

        </span>

      </router-link>

    </nav>

    <!-- BOTTOM -->

    <div class="sidebar-bottom">

      <ThemeToggle />

      <button
        class="logout-btn"
        @click="logout"
      >

        <LogOut :size="18" />

        Logout

      </button>

    </div>

  </aside>

</template>

<style scoped>

.sidebar-overlay{

position:fixed;

inset:0;

background:rgba(0,0,0,.45);

z-index:999;

}

.sidebar-logo{

display:flex;

align-items:center;

justify-content:space-between;

padding:24px;

border-bottom:1px solid var(--border);

}

.logo-circle{

width:45px;

height:45px;

border-radius:50%;

background:var(--primary);

display:flex;

align-items:center;

justify-content:center;

font-weight:bold;

font-size:20px;

color:white;

}

.close-btn{

background:none;

border:none;

}

.sidebar-user{

padding:20px;

display:flex;

gap:15px;

align-items:center;

border-bottom:1px solid var(--border);

}

.avatar{

width:48px;

height:48px;

border-radius:50%;

background:var(--primary);

color:white;

display:flex;

align-items:center;

justify-content:center;

font-weight:bold;

font-size:18px;

}

.sidebar-menu{

padding:18px 12px;

display:flex;

flex-direction:column;

gap:6px;

}

.sidebar-link{

display:flex;

align-items:center;

gap:14px;

padding:14px 16px;

border-radius:12px;

text-decoration:none;

color:var(--text);

transition:.25s;

font-weight:500;

}

.sidebar-link:hover{

background:rgba(0,160,130,.08);

color:var(--primary);

}

.sidebar-link.active{

background:var(--primary);

color:white;

}

.sidebar-bottom{

position:absolute;

left:0;

right:0;

bottom:0;

padding:20px;

border-top:1px solid var(--border);

background:var(--card);

}

.logout-btn{

width:100%;

margin-top:14px;

border:none;

background:#ef4444;

color:white;

padding:12px;

border-radius:12px;

display:flex;

justify-content:center;

align-items:center;

gap:10px;

font-weight:600;

transition:.3s;

}

.logout-btn:hover{

transform:translateY(-2px);

}

</style>