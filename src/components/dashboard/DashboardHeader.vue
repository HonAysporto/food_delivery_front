<script setup>
import { computed } from "vue";
import { useAuthStore } from "../../stores/auth";

import ThemeToggle from "./ThemeToggle.vue";

import {
  Menu,
  Bell,
  Search,
  ChevronDown,
} from "lucide-vue-next";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
});

const emit = defineEmits([
  "toggle-sidebar",
]);

const authStore = useAuthStore();

const initials = computed(() => {
  const first =
    authStore.user?.firstname?.charAt(0) || "";

  const last =
    authStore.user?.lastname?.charAt(0) || "";

  return (first + last).toUpperCase();
});
</script>

<template>

<header class="dashboard-header">

<div class="header-left">

<button
class="menu-btn d-lg-none"
@click="$emit('toggle-sidebar')"
>

<Menu :size="22" />

</button>

<div>

<h4 class="page-title">

{{ title }}

</h4>

<p class="page-subtitle">

Manage your platform efficiently

</p>

</div>

</div>

<div class="header-right">

<div class="search-box d-none d-md-flex">

<Search
:size="18"
class="search-icon"
/>

<input
type="text"
placeholder="Search..."
/>

</div>

<ThemeToggle />

<button class="icon-btn">

<Bell :size="20" />

<span class="notification-dot"></span>

</button>

<div class="profile-box">

<div class="avatar">

{{ initials }}

</div>

<div
class="profile-info d-none d-lg-block"
>

<div class="fw-semibold">

{{ authStore.user?.firstname }}

{{ authStore.user?.lastname }}

</div>

<small>

{{ authStore.user?.role }}

</small>

</div>

<ChevronDown
:size="18"
class="d-none d-lg-block"
/>

</div>

</div>

</header>

</template>

<style scoped>

.dashboard-header{

display:flex;

align-items:center;

justify-content:space-between;

padding:0 28px;

height:72px;

background:var(--card);

}

.header-left{

display:flex;

align-items:center;

gap:18px;

}

.page-title{

margin:0;

font-size:24px;

font-weight:700;

color:var(--text);

}

.page-subtitle{

margin:0;

font-size:14px;

color:#7c8798;

}

.header-right{

display:flex;

align-items:center;

gap:16px;

}

.search-box{

width:300px;

height:42px;

display:flex;

align-items:center;

padding:0 15px;

border-radius:12px;

background:var(--background);

border:1px solid var(--border);

}

.search-box input{

flex:1;

border:none;

background:none;

outline:none;

margin-left:10px;

color:var(--text);

}

.icon-btn{

position:relative;

border:none;

background:none;

width:42px;

height:42px;

border-radius:12px;

display:flex;

justify-content:center;

align-items:center;

transition:.3s;

}

.icon-btn:hover{

background:rgba(0,160,130,.08);

}

.notification-dot{

position:absolute;

top:10px;

right:10px;

width:8px;

height:8px;

background:#ef4444;

border-radius:50%;

}

.profile-box{

display:flex;

align-items:center;

gap:12px;

padding:6px 10px;

border-radius:12px;

cursor:pointer;

transition:.3s;

}

.profile-box:hover{

background:rgba(0,160,130,.08);

}

.avatar{

width:42px;

height:42px;

border-radius:50%;

background:var(--primary);

display:flex;

justify-content:center;

align-items:center;

font-weight:700;

color:white;

}

.menu-btn{

border:none;

background:none;

width:42px;

height:42px;

display:flex;

align-items:center;

justify-content:center;

border-radius:10px;

}

.menu-btn:hover{

background:rgba(0,160,130,.08);

}

</style>