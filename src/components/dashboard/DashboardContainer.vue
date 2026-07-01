<template>
  <section class="dashboard-container">
    <slot />
  </section>
</template>

<style scoped>
.dashboard-container{

width:100%;

max-width:1600px;

margin:auto;

display:flex;

flex-direction:column;

gap:28px;

padding-bottom:40px;

}

@media(max-width:768px){

.dashboard-container{

gap:20px;

}

}
</style>