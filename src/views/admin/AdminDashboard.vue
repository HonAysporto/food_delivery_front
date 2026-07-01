<script setup>
import { ref, onMounted } from "vue";
import api from "../../services/api";

const analytics = ref({
  total_users: 0,
  total_restaurants: 0,
  total_riders: 0,
  total_foods: 0,
  total_orders: 0,
  total_reviews: 0,

  wallet: {
    balance: 0,
    total_earned: 0,
    total_withdrawn: 0,
  },
});

const loading = ref(true);

const loadAnalytics = async () => {
  try {
    const { data } = await api.get("/admin/analytics");
    console.log(data);
    
    analytics.value = data;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(loadAnalytics);
</script>

<template>
  <div class="dashboard">

    <!-- PAGE HEADER -->
    <div class="page-header">
      <div>
        <h2>Dashboard</h2>
        <p>Welcome back. Here's what's happening on your platform.</p>
      </div>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="loading-card">
      Loading dashboard...
    </div>

    <template v-else>

     <!-- STATS -->

<div class="stats-grid">

  <div class="stat-card blue">
    <div class="icon">👥</div>

    <div>
      <h3>{{ analytics.total_users }}</h3>
      <span>Total Users</span>
    </div>
  </div>

  <div class="stat-card green">
    <div class="icon">🏪</div>

    <div>
      <h3>{{ analytics.total_restaurants }}</h3>
      <span>Restaurants</span>
    </div>
  </div>

  <div class="stat-card orange">
    <div class="icon">🚴</div>

    <div>
      <h3>{{ analytics.total_riders }}</h3>
      <span>Riders</span>
    </div>
  </div>

  <div class="stat-card purple">
    <div class="icon">📦</div>

    <div>
      <h3>{{ analytics.total_orders }}</h3>
      <span>Total Orders</span>
    </div>
  </div>

</div>

      <!-- SECOND ROW -->
      <div class="second-row">

        <!-- REVENUE -->
       <div class="revenue-card">

    <small>Platform Wallet</small>

    <h1>
        ₦{{ Number(analytics.wallet?.balance || 0).toLocaleString() }}
    </h1>

    <p>
        Current available balance owned by the platform.
    </p>

</div>

        <!-- PLATFORM -->
        <div class="overview-card">

    <h4>Platform Overview</h4>

    <div class="overview-item">
        <span>Registered Users</span>
        <strong>{{ analytics.total_users }}</strong>
    </div>

    <div class="overview-item">
        <span>Restaurants</span>
        <strong>{{ analytics.total_restaurants }}</strong>
    </div>

    <div class="overview-item">
        <span>Riders</span>
        <strong>{{ analytics.total_riders }}</strong>
    </div>

    <div class="overview-item">
        <span>Orders</span>
        <strong>{{ analytics.total_orders }}</strong>
    </div>

    <div class="overview-item">
        <span>Platform Earnings</span>
        <strong>
            ₦{{ Number(analytics.wallet?.total_earned || 0).toLocaleString() }}
        </strong>
    </div>

     <div class="overview-item">
        <span>Total Platform Revenue</span>
        <strong>
            ₦{{ Number(analytics.total_platform_revenue || 0).toLocaleString() }}
        </strong>
    </div>

    <div class="overview-item">
        <span>Withdrawn</span>
        <strong>
            ₦{{ Number(analytics.wallet?.total_withdrawn || 0).toLocaleString() }}
        </strong>
    </div>

</div>
      </div>

      <!-- INSIGHTS -->
    <div class="insight-card">

    <h4>Wallet Summary</h4>

    <div class="insight-grid">

        <div class="insight-box">

            💰

            <h5>
                ₦{{ Number(analytics.wallet?.balance || 0).toLocaleString() }}
            </h5>

            <span>Current Balance</span>

        </div>

        <div class="insight-box">

            📈

            <h5>
                ₦{{ Number(analytics.wallet?.total_earned || 0).toLocaleString() }}
            </h5>

            <span>Total Earned</span>

        </div>

        <div class="insight-box">

            💸

            <h5>
                ₦{{ Number(analytics.wallet?.total_withdrawn || 0).toLocaleString() }}
            </h5>

            <span>Total Withdrawn</span>

        </div>

    </div>

</div>

    </template>

  </div>
</template>

<style scoped>

.dashboard{
    display:flex;
    flex-direction:column;
    gap:25px;
}

/* HEADER */

.page-header h2{
    font-weight:700;
    margin-bottom:6px;
}

.page-header p{
    color:#6b7280;
}

/* LOADING */

.loading-card{
    background:white;
    padding:30px;
    border-radius:16px;
    text-align:center;
}

/* STATS */

.stats-grid{
    display:grid;
    grid-template-columns:repeat(4,1fr);
    gap:20px;
}

.stat-card{
    background:white;
    border-radius:18px;
    padding:22px;
    display:flex;
    align-items:center;
    gap:18px;
    box-shadow:0 5px 18px rgba(0,0,0,.05);
}

.stat-card h3{
    font-size:30px;
    margin:0;
}

.stat-card span{
    color:#6b7280;
}

.icon{
    width:65px;
    height:65px;
    border-radius:16px;
    display:flex;
    justify-content:center;
    align-items:center;
    font-size:30px;
}

.blue .icon{
    background:#dbeafe;
}

.green .icon{
    background:#dcfce7;
}

.orange .icon{
    background:#ffedd5;
}

.purple .icon{
    background:#ede9fe;
}

/* SECOND */

.second-row{
    display:grid;
    grid-template-columns:2fr 1fr;
    gap:20px;
}

.revenue-card{
    background:#2563eb;
    color:white;
    border-radius:18px;
    padding:35px;
}

.revenue-card small{
    opacity:.8;
}

.revenue-card h1{
    font-size:45px;
    margin:15px 0;
}

.overview-card{
    background:white;
    border-radius:18px;
    padding:25px;
    box-shadow:0 5px 18px rgba(0,0,0,.05);
}

.overview-item{
    display:flex;
    justify-content:space-between;
    padding:15px 0;
    border-bottom:1px solid #eee;
}

.overview-item:last-child{
    border-bottom:none;
}

/* INSIGHTS */

.insight-card{
    background:white;
    border-radius:18px;
    padding:25px;
    box-shadow:0 5px 18px rgba(0,0,0,.05);
}

.insight-grid{
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:20px;
    margin-top:20px;
}

.insight-box{
    background:#f8fafc;
    border-radius:15px;
    padding:25px;
    text-align:center;
}

.insight-box h5{
    margin:15px 0 5px;
    font-size:26px;
}

.insight-box span{
    color:#6b7280;
}

/* MOBILE */

@media(max-width:992px){

.stats-grid{
grid-template-columns:repeat(2,1fr);
}

.second-row{
grid-template-columns:1fr;
}

.insight-grid{
grid-template-columns:1fr;
}

}

@media(max-width:600px){

.stats-grid{
grid-template-columns:1fr;
}

.revenue-card h1{
font-size:34px;
}

}

</style>