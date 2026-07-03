<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../../services/api";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { useToast } from "vue-toastification";

const loading = ref(true);
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();
const lastname = ref();

const availableOrders = ref([]);
const myOrders = ref([]);
const wallet = ref({
  balance: 0,
  total_earned: 0,
  total_withdrawn: 0,
});

const loadDashboard = async () => {
  loading.value = true;
   const resuser = await api.get("/user");
     lastname.value = resuser.data.lastname
   
  try {
    const [available, mine, walletRes] = await Promise.all([
      api.get("/rider/available-orders"),
      api.get("/rider/my-orders"),
      api.get("/rider/wallet"),
    ]);

    availableOrders.value = available.data;
    myOrders.value = mine.data;
    wallet.value = walletRes.data;
  } catch (error) {
    console.error(error);
    toast.error("Failed to sync delivery feeds.");
  } finally {
    loading.value = false;
  }
};

const acceptOrder = async (id) => {
  try {
    await api.put(`/rider/accept-order/${id}`);
    toast.success("Delivery route assigned successfully!");
    loadDashboard();
  } catch (err) {
    toast.error("Could not claim order. It might have been taken.");
  }
};

const deliverOrder = async (id) => {
  try {
    await api.put(`/rider/deliver-order/${id}`);
    toast.success("Order logged as delivered. Earnings updated!");
    loadDashboard();
  } catch (err) {
    toast.error("Failed to update status.");
  }
};

const logout = () => {
    
  authStore.logout();
  toast.info("Logged out successfully.");
  router.push("/login");
};

const delivered = computed(() => {
  return myOrders.value.filter(order => order.status === "delivered").length;
});

const active = computed(() => {
  return myOrders.value.filter(order => order.status === "on_the_way").length;
});

const statusClass = (status) => {
  switch (status) {
    case "pending": return "status-pending";
    case "accepted": return "status-accepted";
    case "preparing": return "status-preparing";
    case "ready_for_pickup": return "status-ready";
    case "on_the_way": return "status-transit";
    case "delivered": return "status-delivered";
    default: return "status-pending";
  }
};

const pickupMap = (address) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

const deliveryMap = (address) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

onMounted(loadDashboard);
</script>

<template>
  <div class="rider-layout">
    
    <header class="rider-topbar">
      <div class="container-fluid d-flex justify-content-between align-items-center header-wrapper">
        <div class="logo-brand">
          <span class="logo-icon">🚴</span> TAZVO <span class="badge-role">Rider Portal</span>
        </div>
        
        <div class="d-flex align-items-center gap-3">
          <div class="rider-avatar-badge">
            <div class="avatar-node">R</div>
            <span class="username-text d-none d-sm-inline">Rider {{ lastname }}</span>
          </div>
          <button class="logout-action-btn" @click="logout">
            Logout
          </button>
        </div>
      </div>
    </header>

    <div class="container-fluid py-4 main-content-max">

      <div v-if="loading" class="loading-state-card">
        <div class="spinner-border text-success"></div>
        <h5 class="mt-3">Syncing Logistics Dashboard...</h5>
      </div>

      <div v-else>
        
        <section class="rider-hero-banner">
          <div class="hero-layer-content">
            <span class="payout-pill">⚡ Real-time Payout Active</span>
            <p class="wallet-micro-title">Available Wallet Balance</p>
            <h2 class="wallet-main-balance font-numeric">
              ₦{{ Number(wallet.balance).toLocaleString() }}
            </h2>
          </div>
        </section>

        <div class="row g-3 mb-5">
          <div class="col-6 col-md-3">
            <div class="metric-analytic-card">
              <span class="metric-icon">💰</span>
              <div class="metric-info">
                <span class="font-numeric">₦{{ Number(wallet.total_earned).toLocaleString() }}</span>
                <p>Total Earned</p>
              </div>
            </div>
          </div>

          <div class="col-6 col-md-3">
            <div class="metric-analytic-card">
              <span class="metric-icon">💸</span>
              <div class="metric-info">
                <span class="font-numeric">₦{{ Number(wallet.total_withdrawn).toLocaleString() }}</span>
                <p>Withdrawn</p>
              </div>
            </div>
          </div>

          <div class="col-6 col-md-3">
            <div class="metric-analytic-card">
              <span class="metric-icon">🏍️</span>
              <div class="metric-info">
                <span class="font-numeric">{{ active }}</span>
                <p>In Transit</p>
              </div>
            </div>
          </div>

          <div class="col-6 col-md-3">
            <div class="metric-analytic-card">
              <span class="metric-icon">✅</span>
              <div class="metric-info">
                <span class="font-numeric">{{ delivered }}</span>
                <p>Completed</p>
              </div>
            </div>
          </div>
        </div>

        <div class="row g-4">
          
          <div class="col-lg-7">
            <h3 class="feed-section-title">📦 Open Request Pool ({{ availableOrders.length }})</h3>
            
            <div v-if="availableOrders.length === 0" class="empty-feed-placeholder">
              <span class="placeholder-icon">📡</span>
              <p>Scanning for nearby orders... No pending pickup packages available currently.</p>
            </div>

            <div v-for="order in availableOrders" :key="order.id" class="logistic-job-card">
              <div class="job-card-header">
                <div class="d-flex align-items-center gap-3">
                  <img :src="order.restaurant.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591'" class="vendor-profile-img" alt="Vendor" />
                  <div>
                    <h4>{{ order.restaurant.name }}</h4>
                    <span class="job-id-tag font-numeric">Order #{{ order.id }}</span>
                  </div>
                </div>
                <span class="logistic-status-badge" :class="statusClass(order.status)">
                  {{ order.status.replaceAll('_',' ') }}
                </span>
              </div>

              <div class="route-timeline-map">
                <div class="timeline-stop border-left-dash">
                  <span class="stop-dot pickup"></span>
                  <div class="stop-details">
                    <p class="stop-label">Store Pickup Location</p>
                    <p class="stop-address">{{ order.restaurant.address }}</p>
                    <a :href="pickupMap(order.restaurant.address)" target="_blank" class="map-link-btn">
                      📍 Open Navigation Map
                    </a>
                  </div>
                </div>

                <div class="timeline-stop">
                  <span class="stop-dot dropoff"></span>
                  <div class="stop-details">
                    <p class="stop-label">Customer Dropoff Destination</p>
                    <p class="stop-address"><strong>{{ order.delivery_name }}</strong> • {{ order.delivery_address }}</p>
                    <p class="customer-phone-text">📞 {{ order.delivery_phone }}</p>
                    <a :href="deliveryMap(order.delivery_address)" target="_blank" class="map-link-btn">
                      🗺️ View Dropoff Location
                    </a>
                  </div>
                </div>
              </div>

              <div class="job-items-accordion">
                <p class="items-heading">Package Manifest Items:</p>
                <div v-for="item in order.items" :key="item.id" class="manifest-item-row font-numeric">
                  <span>{{ item.food.name }}</span>
                  <strong>× {{ item.quantity }}</strong>
                </div>
              </div>

              <div class="job-card-footer mt-4">
                <button class="claim-route-btn" @click="acceptOrder(order.id)">
                  Accept Delivery Route
                </button>
              </div>
            </div>
          </div>

          <div class="col-lg-5">
            <h3 class="feed-section-title">🚚 My Dispatched Runs ({{ myOrders.length }})</h3>
            
            <div v-if="myOrders.length === 0" class="empty-feed-placeholder">
              <span class="placeholder-icon">🏍️</span>
              <p>Your accepted runs log is clean. Claim a route from the open request pool to begin tracking deliveries.</p>
            </div>

            <div v-for="order in myOrders" :key="order.id" class="logistic-job-card active-run">
              <div class="d-flex justify-content-between align-items-start gap-2 mb-3">
                <div>
                  <h4 class="active-run-vendor">{{ order?.restaurant?.name }}</h4>
                  <p class="active-run-id font-numeric">Order Reference: #{{ order.id }}</p>
                </div>
                <span class="logistic-status-badge" :class="statusClass(order.status)">
                  {{ order.status.replaceAll('_',' ') }}
                </span>
              </div>

              <div class="active-run-summary-box">
                <div class="summary-line">
                  <span class="label">From:</span>
                  <span class="val">{{ order.restaurant.address }}</span>
                </div>
                <div class="summary-line">
                  <span class="label">To:</span>
                  <span class="val"><strong>{{ order.delivery_name }}</strong> — {{ order.delivery_address }}</span>
                </div>
              </div>

              <div class="active-run-actions mt-3">
                <button v-if="order.status === 'on_the_way'" class="action-deliver-btn" @click="deliverOrder(order.id)">
                  Complete & Mark Delivered
                </button>
                <div v-else-if="order.status === 'delivered'" class="run-completed-badge">
                  ✓ Order Handed Over Successfully
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.rider-layout {
  background: #f9f9f9;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  color: #333333;
}

.main-content-max {
  max-width: 1300px;
}

/* ==========================================
   TOP APPLICATION BAR
========================================== */
.rider-topbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: #ffffff;
  padding: 14px 0;
  border-bottom: 1px solid #ededed;
}

.header-wrapper {
  padding: 0 24px;
}

.logo-brand {
  font-size: 22px;
  font-weight: 900;
  color: #111111;
  display: flex;
  align-items: center;
  gap: 8px;
}

.badge-role {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  background: #ffc244; /* Core amber brand asset */
  color: #333333;
  padding: 3px 8px;
  border-radius: 6px;
  letter-spacing: 0.3px;
}

.rider-avatar-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f5f5f5;
  padding: 4px 12px 4px 4px;
  border-radius: 50px;
}

.avatar-node {
  width: 28px;
  height: 28px;
  background: #00a86b;
  color: #ffffff;
  font-weight: 800;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
}

.username-text {
  font-size: 13px;
  font-weight: 700;
  color: #444444;
}

.logout-action-btn {
  background: #ffffff;
  border: 1px solid #e6e6e6;
  color: #ef4444;
  font-weight: 700;
  font-size: 13px;
  padding: 8px 16px;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-action-btn:hover {
  background: #fff5f5;
  border-color: #fecaca;
}

/* ==========================================
   HERO DISPLAY BOARD PANEL
========================================== */
.rider-hero-banner {
  background: linear-gradient(135deg, #00a86b 0%, #008755 100%);
  border-radius: 24px;
  padding: 35px;
  color: #ffffff;
  margin-bottom: 24px;
  box-shadow: 0 10px 30px rgba(0, 168, 107, 0.15);
}

.payout-pill {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 50px;
  font-size: 12px;
  font-weight: 800;
  margin-bottom: 16px;
}

.wallet-micro-title {
  font-size: 14px;
  opacity: 0.85;
  margin-bottom: 4px;
  font-weight: 500;
}

.wallet-main-balance {
  font-size: 38px;
  font-weight: 900;
  margin: 0;
  letter-spacing: -0.5px;
}

/* ==========================================
   METRIC SUMMARY BLOCKS
========================================== */
.metric-analytic-card {
  background: #ffffff;
  border: 1px solid #ededed;
  border-radius: 20px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  height: 100%;
}

.metric-icon {
  font-size: 24px;
}

.metric-info {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.metric-info span {
  font-size: 18px;
  font-weight: 800;
  color: #111111;
}

.metric-info p {
  margin: 0;
  font-size: 12px;
  color: #7d7d7d;
  font-weight: 600;
}

/* ==========================================
   LOGISTIC JOBS CARDS FEED
========================================== */
.feed-section-title {
  font-size: 18px;
  font-weight: 900;
  color: #111111;
  margin-bottom: 18px;
  letter-spacing: -0.3px;
}

.logistic-job-card {
  background: #ffffff;
  border: 1px solid #ededed;
  border-radius: 24px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.01);
}

.job-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding-bottom: 18px;
  border-bottom: 1px dashed #f2f2f2;
  margin-bottom: 20px;
}

.vendor-profile-img {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  object-fit: cover;
  background: #f5f5f5;
}

.job-card-header h4 {
  font-size: 17px;
  font-weight: 800;
  color: #111111;
  margin: 0 0 2px 0;
}

.job-id-tag {
  font-size: 12px;
  color: #8c8c8c;
  font-weight: 600;
}

/* STATUS CHIPS BADGING STYLES */
.logistic-status-badge {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  padding: 6px 12px;
  border-radius: 50px;
  letter-spacing: 0.3px;
}

.logistic-status-badge.status-ready { background: #e6f6ee; color: #00a86b; }
.logistic-status-badge.status-preparing { background: #fffdf0; color: #ffb300; }
.logistic-status-badge.status-transit { background: #f0f7ff; color: #0066cc; }
.logistic-status-badge.status-delivered { background: #f5f5f5; color: #555555; }
.logistic-status-badge.status-accepted { background: #fdf2f8; color: #db2777; }
.logistic-status-badge.status-pending { background: #f3f4f6; color: #1f2937; }

/* ROUTE TIMELINE TRACKS */
.route-timeline-map {
  display: flex;
  flex-direction: column;
}

.timeline-stop {
  position: relative;
  padding-left: 24px;
  padding-bottom: 20px;
}

.timeline-stop.border-left-dash {
  border-left: 2px dashed #e6e6e6;
}

.stop-dot {
  position: absolute;
  left: -6px;
  top: 4px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid #ffffff;
  box-shadow: 0 0 0 2px var(--dot-color);
}

.stop-dot.pickup { --dot-color: #ffc244; background: #ffc244; }
.stop-dot.dropoff { --dot-color: #00a86b; background: #00a86b; }

.timeline-stop.border-left-dash .stop-dot {
  left: -6px;
}
.timeline-stop:last-child .stop-dot {
  left: -4px;
}

.stop-details {
  line-height: 1.4;
}

.stop-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: #8c8c8c;
  margin: 0 0 2px 0;
  letter-spacing: 0.3px;
}

.stop-address {
  font-size: 14.5px;
  color: #333333;
  margin: 0 0 6px 0;
}

.customer-phone-text {
  font-size: 13.5px;
  font-weight: 600;
  color: #444444;
  margin: 0 0 8px 0;
}

.map-link-btn {
  display: inline-flex;
  align-items: center;
  font-size: 12.5px;
  font-weight: 700;
  color: #0066cc;
  text-decoration: none;
  background: #f0f7ff;
  padding: 4px 10px;
  border-radius: 6px;
  transition: all 0.15s ease;
}

.map-link-btn:hover {
  background: #e1effe;
}

/* PACK MANIFEST PANEL ITEM ROWS */
.job-items-accordion {
  background: #fafafa;
  border: 1px solid #f5f5f5;
  border-radius: 16px;
  padding: 14px 16px;
  margin-top: 10px;
}

.items-heading {
  font-size: 12px;
  font-weight: 700;
  color: #8c8c8c;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.manifest-item-row {
  display: flex;
  justify-content: space-between;
  font-size: 13.5px;
  color: #444444;
  margin-bottom: 6px;
}

.manifest-item-row:last-child {
  margin-bottom: 0;
}

.claim-route-btn {
  width: 100%;
  background: #ffc244;
  color: #333333;
  border: none;
  font-weight: 800;
  font-size: 15px;
  padding: 14px;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(255, 194, 68, 0.2);
  transition: all 0.2s ease;
}

.claim-route-btn:hover {
  background: #eebb37;
}

/* ==========================================
   ACTIVE CONSOLE DISPATCH COLUMN
========================================== */
.logistic-job-card.active-run {
  border-left: 4px solid #00a86b;
}

.active-run-vendor {
  font-size: 16px;
  font-weight: 800;
  color: #111111;
  margin: 0 0 2px 0;
}

.active-run-id {
  font-size: 12px;
  color: #8c8c8c;
  margin: 0;
}

.active-run-summary-box {
  background: #fbfbfb;
  border-radius: 14px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.summary-line {
  display: flex;
  gap: 8px;
  font-size: 13px;
}

.summary-line .label {
  font-weight: 700;
  color: #8c8c8c;
  min-width: 45px;
}

.summary-line .val {
  color: #444444;
}

.action-deliver-btn {
  width: 100%;
  background: #00a86b;
  color: #ffffff;
  border: none;
  font-weight: 800;
  font-size: 14px;
  padding: 12px;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 168, 107, 0.15);
  transition: background-color 0.15s ease;
}

.action-deliver-btn:hover {
  background: #00935f;
}

.run-completed-badge {
  background: #e6f6ee;
  color: #00a86b;
  font-weight: 700;
  font-size: 13.5px;
  text-align: center;
  padding: 10px;
  border-radius: 50px;
}

/* ==========================================
   APP APP LOADING & BLANK ERROR STATE
========================================== */
.loading-state-card,
.empty-feed-placeholder {
  text-align: center;
  padding: 50px 20px;
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #ededed;
  color: #7d7d7d;
}

.placeholder-icon {
  font-size: 32px;
  display: block;
  margin-bottom: 12px;
}

.empty-feed-placeholder p {
  font-size: 14px;
  margin: 0;
  max-width: 400px;
  margin: 0 auto;
}

.loading-state-card {
  max-width: 400px;
  margin: 40px auto;
}

.font-numeric {
  font-variant-numeric: tabular-nums;
}

/* ==========================================
   MOBILE INTERFACE OPTIMIZATIONS
========================================== */
@media (max-width: 768px) {
  .header-wrapper {
    padding: 0 16px;
  }
  
  .rider-hero-banner {
    padding: 24px;
  }

  .wallet-main-balance {
    font-size: 30px;
  }

  .logistic-job-card {
    padding: 16px;
  }

  .job-card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .logistic-status-badge {
    width: 100%;
    text-align: center;
  }
}
</style>