<script setup>
import { Clock3 } from "lucide-vue-next";

const activities = [
  {
    title: "Dashboard Ready",
    time: "Today",
  },
  {
    title: "Restaurant Active",
    time: "Today",
  },
  {
    title: "Waiting for recent activities",
    time: "",
  },
];
</script>

<template>
  <div class="card-box">

    <div class="header">
      <h5>Recent Activity</h5>
    </div>

    <div
      v-for="activity in activities"
      :key="activity.title"
      class="activity"
    >
      <div class="circle">
        <Clock3 :size="16" />
      </div>

      <div class="flex-grow-1">

        <strong>
          {{ activity.title }}
        </strong>

        <small>
          {{ activity.time }}
        </small>

      </div>

    </div>

  </div>
</template>

<style scoped>

.card-box{

background:var(--card);

border:1px solid var(--border);

border-radius:18px;

padding:24px;

}

.header{

margin-bottom:20px;

}

.header h5{

margin:0;

font-weight:700;

}

.activity{

display:flex;

gap:15px;

padding:14px 0;

border-bottom:1px solid var(--border);

}

.activity:last-child{

border:none;

padding-bottom:0;

}

.circle{

width:40px;

height:40px;

background:rgba(0,160,130,.12);

display:flex;

justify-content:center;

align-items:center;

border-radius:12px;

color:var(--primary);

}

small{

display:block;

color:#94a3b8;

margin-top:4px;

}

</style>