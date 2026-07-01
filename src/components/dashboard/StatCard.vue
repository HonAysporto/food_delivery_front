<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },

  value: {
    type: [String, Number],
    required: true,
  },

  icon: {
    type: Object,
    required: true,
  },

  color: {
    type: String,
    default: "primary",
  },

  subtitle: {
    type: String,
    default: "",
  },

  trend: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <div class="stat-card">

    <div class="stat-top">

      <div>

        <p class="stat-title">
          {{ title }}
        </p>

        <h3 class="stat-value">
          {{ value }}
        </h3>

      </div>

      <div
        class="stat-icon"
        :class="color"
      >
        <component
          :is="icon"
          :size="24"
        />
      </div>

    </div>

    <div
      v-if="subtitle || trend"
      class="stat-bottom"
    >

      <span class="subtitle">
        {{ subtitle }}
      </span>

      <span
        v-if="trend"
        class="trend"
      >
        {{ trend }}
      </span>

    </div>

  </div>
</template>

<style scoped>

.stat-card{

background:var(--card);

border:1px solid var(--border);

border-radius:18px;

padding:22px;

transition:.3s;

height:100%;

display:flex;

flex-direction:column;

justify-content:space-between;

}

.stat-card:hover{

transform:translateY(-4px);

box-shadow:0 12px 30px rgba(0,0,0,.08);

}

.stat-top{

display:flex;

justify-content:space-between;

align-items:flex-start;

}

.stat-title{

margin:0;

font-size:14px;

font-weight:500;

color:#7b8794;

}

.stat-value{

margin-top:10px;

font-size:34px;

font-weight:700;

color:var(--text);

}

.stat-icon{

width:54px;

height:54px;

border-radius:16px;

display:flex;

align-items:center;

justify-content:center;

color:white;

}

.primary{

background:#2563eb;

}

.success{

background:#22c55e;

}

.warning{

background:#f59e0b;

}

.danger{

background:#ef4444;

}

.info{

background:#06b6d4;

}

.stat-bottom{

display:flex;

justify-content:space-between;

margin-top:18px;

font-size:13px;

}

.subtitle{

color:#7b8794;

}

.trend{

font-weight:600;

color:#22c55e;

}

</style>