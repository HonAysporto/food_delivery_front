<script setup>

defineProps({

show:Boolean,

title:String,

message:String,

loading:Boolean,

confirmText:{

type:String,

default:"Confirm",

},

cancelText:{

type:String,

default:"Cancel",

},

});

const emit=defineEmits([

"confirm",

"cancel",

]);

</script>

<template>

<div
v-if="show"
class="modal-overlay"
>

<div class="confirm-card">

<h4>

{{ title }}

</h4>

<p>

{{ message }}

</p>

<div class="actions">

<button
class="btn btn-light"
@click="$emit('cancel')"
>

{{ cancelText }}

</button>

<button
class="btn btn-danger"
@click="$emit('confirm')"
:disabled="loading"
>

{{ loading ? "Please wait..." : confirmText }}

</button>

</div>

</div>

</div>

</template>

<style scoped>

.modal-overlay{

position:fixed;

inset:0;

background:rgba(0,0,0,.5);

display:flex;

justify-content:center;

align-items:center;

z-index:9999;

}

.confirm-card{

width:430px;

background:var(--card);

padding:30px;

border-radius:18px;

box-shadow:0 20px 60px rgba(0,0,0,.2);

}

.actions{

display:flex;

justify-content:flex-end;

gap:12px;

margin-top:24px;

}

button{

border-radius:12px;

min-width:120px;

}

</style>