<script setup>
import { computed, watch } from "vue";
import {
  CheckCircle,
  AlertCircle,
  Info,
  XCircle,
  X
} from "lucide-vue-next";

const props = defineProps({
  show: Boolean,

  message: {
    type: String,
    default: "",
  },

  type: {
    type: String,
    default: "success",
  },

  duration: {
    type: Number,
    default: 3000,
  },
});

const emit = defineEmits(["close"]);

const icon = computed(() => {
  switch (props.type) {
    case "success":
      return CheckCircle;

    case "error":
      return XCircle;

    case "warning":
      return AlertCircle;

    default:
      return Info;
  }
});

watch(
  () => props.show,
  (value) => {
    if (value) {
      setTimeout(() => {
        emit("close");
      }, props.duration);
    }
  }
);
</script>

<template>
  <transition name="toast">

    <div
      v-if="show"
      class="toast-card"
      :class="type"
    >

      <component
        :is="icon"
        :size="22"
      />

      <div class="toast-content">

        <strong>
          {{ message }}
        </strong>

      </div>

      <button
        class="close-btn"
        @click="$emit('close')"
      >
        <X :size="18" />
      </button>

    </div>

  </transition>
</template>

<style scoped>

.toast-card{

position:fixed;

top:20px;

right:20px;

min-width:340px;

max-width:420px;

padding:18px;

display:flex;

align-items:center;

gap:15px;

border-radius:14px;

color:white;

z-index:9999;

box-shadow:0 20px 45px rgba(0,0,0,.2);

}

.success{

background:#22c55e;

}

.error{

background:#ef4444;

}

.warning{

background:#f59e0b;

}

.info{

background:#2563eb;

}

.toast-content{

flex:1;

}

.close-btn{

background:none;

border:none;

color:white;

}

.toast-enter-active,

.toast-leave-active{

transition:.35s;

}

.toast-enter-from{

opacity:0;

transform:translateX(100%);

}

.toast-leave-to{

opacity:0;

transform:translateX(100%);

}

</style>