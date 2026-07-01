<script setup>
import { ref } from "vue";
import DashboardSidebar from "../components/dashboard/DashboardSidebar.vue";
import DashboardHeader from "../components/dashboard/DashboardHeader.vue";

defineProps({
  menu: {
    type: Array,
    required: true,
  },

  title: {
    type: String,
    default: "",
  },
});

const sidebarOpen = ref(false);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const closeSidebar = () => {
  sidebarOpen.value = false;
};
</script>

<template>
  <div class="dashboard-layout">

    <DashboardSidebar
      :menu="menu"
      :open="sidebarOpen"
      @close="closeSidebar"
    />

    <div class="dashboard-main">

      <DashboardHeader
        :title="title"
        @toggle-sidebar="toggleSidebar"
      />

      <main class="dashboard-content">
        <slot />
      </main>

    </div>

  </div>
</template>