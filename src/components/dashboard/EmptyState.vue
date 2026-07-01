<script setup>
defineProps({

title:String,

description:String,

buttonText:String,

icon:Object,

});

const emit=defineEmits(["action"]);

</script>

<template>

<div class="empty-state">

<component
:is="icon"
:size="70"
/>

<h3>

{{ title }}

</h3>

<p>

{{ description }}

</p>

<button
v-if="buttonText"
class="btn btn-primary"
@click="$emit('action')"
>

{{ buttonText }}

</button>

</div>

</template>

<style scoped>

.empty-state{

padding:80px 30px;

display:flex;

flex-direction:column;

align-items:center;

text-align:center;

gap:18px;

color:#6b7280;

}

h3{

color:var(--text);

margin:0;

}

p{

max-width:420px;

}

button{

border-radius:12px;

padding:12px 24px;

}

</style>