<script setup>
import { ArrowRight } from "lucide-vue-next";

defineProps({
  title: String,
  description: String,
  icon: Object,
  color: {
    type: String,
    default: "#00A082",
  },
  to: String,
});
</script>

<template>
  <router-link
    :to="to"
    class="action-card text-decoration-none"
  >
    <div
      class="icon-box"
      :style="{ background: color }"
    >
      <component
        :is="icon"
        :size="24"
        color="white"
      />
    </div>

    <div class="flex-grow-1">
      <h6>{{ title }}</h6>

      <p>
        {{ description }}
      </p>
    </div>

    <ArrowRight
      :size="20"
      class="arrow"
    />
  </router-link>
</template>

<style scoped>

.action-card{

display:flex;

align-items:center;

gap:18px;

padding:20px;

background:var(--card);

border:1px solid var(--border);

border-radius:18px;

transition:.25s;

color:var(--text);

height:100%;

}

.action-card:hover{

transform:translateY(-5px);

box-shadow:0 15px 35px rgba(0,0,0,.08);

}

.icon-box{

width:56px;

height:56px;

display:flex;

justify-content:center;

align-items:center;

border-radius:16px;

flex-shrink:0;

}

h6{

margin:0;

font-weight:700;

}

p{

margin:6px 0 0;

font-size:14px;

color:#7b8794;

}

.arrow{

color:#94a3b8;

}

</style>