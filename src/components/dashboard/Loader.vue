<script setup>
defineProps({
  text: {
    type: String,
    default: "Loading...",
  },
});
</script>

<template>

<div class="loader-wrapper">

<div class="spinner"></div>

<p>{{ text }}</p>

</div>

</template>

<style scoped>

.loader-wrapper{

display:flex;

flex-direction:column;

align-items:center;

justify-content:center;

padding:60px;

gap:20px;

}

.spinner{

width:46px;

height:46px;

border-radius:50%;

border:4px solid #e5e7eb;

border-top-color:var(--primary);

animation:spin .8s linear infinite;

}

@keyframes spin{

to{

transform:rotate(360deg);

}

}

p{

margin:0;

color:#6b7280;

font-weight:500;

}

</style>