<script setup>
import { ref, onMounted, computed } from "vue";
import api from "../services/api";
import { useCartStore } from "../stores/cart";

const restaurants = ref([]);
const search = ref("");
const loading = ref(true);
const cartStore = useCartStore();

const restaurantImages = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9",
  "https://images.unsplash.com/photo-1513104890138-7c749659a591",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4",
];

onMounted(async () => {
  try {
    const res = await api.get("/restaurants");
    restaurants.value = res.data;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
});

const filteredRestaurants = computed(() => {
  return restaurants.value.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

const getRestaurantImage = (index) => {
  return restaurantImages[index % restaurantImages.length];
};
</script>

<template>
  <div class="home-page">
    
    <!-- HERO -->
    <section class="hero-section">
      <div class="container">

        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="brand-title">
              🚀 Foodly
            </h1>

            <p class="brand-subtitle">
              Delicious food delivered fast to your doorstep
            </p>
          </div>

          <router-link to="/cart" class="cart-btn">
            🛒
            <span class="cart-count">
              {{ cartStore.totalItems }}
            </span>
          </router-link>
        </div>

        <div class="hero-content">

          <h2>
            Hungry?
          </h2>

          <h3>
            Discover Amazing Restaurants Near You
          </h3>

          <p>
            Order from the best restaurants in your city with fast delivery.
          </p>

        </div>

        <!-- SEARCH -->
        <div class="search-wrapper">

          <span class="search-icon">
            🔍
          </span>

          <input
            v-model="search"
            class="search-input"
            placeholder="Search restaurants, burgers, pizza..."
          />

        </div>

      </div>
    </section>

    <!-- MAIN CONTENT -->
    <div class="container py-5">

      <!-- CATEGORIES -->
   

      <!-- SECTION HEADER -->
      <div class="section-header mb-4">
        <h2>Popular Restaurants</h2>
        <p>Top-rated restaurants loved by customers</p>
      </div>

      <!-- LOADING -->
      <div v-if="loading" class="loading-state">

        <div class="spinner-border text-success"></div>

        <p class="mt-3">
          Loading amazing restaurants...
        </p>

      </div>

      <!-- RESTAURANTS -->
      <div
        v-else-if="filteredRestaurants.length"
        class="row g-4"
      >
        <div
          v-for="(r, index) in filteredRestaurants"
          :key="r.id"
          class="col-md-6 col-lg-4"
        >
          <router-link
            :to="`/restaurant/${r.id}`"
            class="text-decoration-none"
          >

            <div class="restaurant-card">

              <div class="image-wrapper">

                <img
                  :src="r.image || getRestaurantImage(index)"
                  class="restaurant-image"
                />

<div
  class="badge"
  :class="
    r.is_open
      ? 'bg-success'
      : 'bg-danger'
  "
>
  {{
    r.is_open
      ? 'Open'
      : 'Closed'
  }}
</div>

                <div class="rating-badge">
                  ⭐ {{
  Number(
    r.reviews_avg_rating || 0
  ).toFixed(1)
}}
({{ r.reviews_count }} reviews)
                </div>

              </div>

              <div class="card-content">

                <h4>
                  {{ r.name }}
                </h4>

                <p class="location">
                  📍 {{ r.address || "Lagos" }}
                </p>

                <div class="restaurant-meta">

                  <span>
                    ⏱️ 20 - 30 mins
                  </span>

                  <span>
                    🚚 Free Delivery
                  </span>

                </div>

                <button class="view-menu-btn">
                  View Menu →
                </button>

              </div>

            </div>

          </router-link>
        </div>
      </div>

      <!-- EMPTY -->
      <div
        v-else
        class="empty-state"
      >
        <div class="empty-icon">
          🍽️
        </div>

        <h3>
          No Restaurants Found
        </h3>

        <p>
          Try searching for something else.
        </p>
      </div>

    </div>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #f8fafc;
}

/* HERO */

.hero-section {
  background: linear-gradient(
    135deg,
    #00c896,
    #00a86b
  );
  color: white;
  padding: 40px 0 70px;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
}

.brand-title {
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
}

.brand-subtitle {
  opacity: 0.9;
  margin-top: 5px;
}

.hero-content h2 {
  font-size: 3rem;
  font-weight: 800;
}

.hero-content h3 {
  font-size: 1.8rem;
  margin-bottom: 15px;
}

.hero-content p {
  max-width: 500px;
  opacity: 0.95;
}

/* SEARCH */

.search-wrapper {
  margin-top: 30px;
  position: relative;
}

.search-input {
  width: 100%;
  border: none;
  outline: none;
  border-radius: 50px;
  padding: 18px 20px 18px 55px;
  font-size: 1rem;
  box-shadow: 0 10px 30px rgba(0,0,0,.12);
}

.search-icon {
  position: absolute;
  left: 20px;
  top: 18px;
  z-index: 10;
}

/* CART */

.cart-btn {
  background: white;
  color: black;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display:flex;
  align-items:center;
  justify-content:center;
  position:relative;
  text-decoration:none;
  font-size:1.3rem;
}

.cart-count {
  position:absolute;
  top:-4px;
  right:-2px;
  background:#ff4757;
  color:white;
  width:24px;
  height:24px;
  border-radius:50%;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:.75rem;
  font-weight:bold;
}

/* CATEGORY */

.category-scroll {
  display:flex;
  gap:12px;
  overflow-x:auto;
}

.category-pill {
  border:none;
  padding:12px 18px;
  border-radius:50px;
  background:white;
  box-shadow:0 4px 15px rgba(0,0,0,.08);
  font-weight:600;
}

.category-pill.active {
  background:#00c896;
  color:white;
}

/* SECTION */

.section-header h2 {
  font-weight:800;
}

.section-header p {
  color:#6b7280;
}

/* CARD */

.restaurant-card {
  background:white;
  border-radius:24px;
  overflow:hidden;
  box-shadow:0 10px 25px rgba(0,0,0,.08);
  transition:.3s;
}

.restaurant-card:hover {
  transform:translateY(-8px);
  box-shadow:0 20px 35px rgba(0,0,0,.12);
}

.image-wrapper {
  position:relative;
}

.restaurant-image {
  width:100%;
  height:220px;
  object-fit:cover;
}

.rating-badge {
  position:absolute;
  top:15px;
  right:15px;
  background:white;
  padding:8px 12px;
  border-radius:20px;
  font-weight:700;
}

.card-content {
  padding:20px;
}

.card-content h4 {
  font-weight:700;
}

.location {
  color:#6b7280;
}

.restaurant-meta {
  display:flex;
  justify-content:space-between;
  margin:15px 0;
  color:#555;
  font-size:.9rem;
}

.view-menu-btn {
  width:100%;
  border:none;
  border-radius:14px;
  background:linear-gradient(
    135deg,
    #00c896,
    #00a86b
  );
  color:white;
  padding:14px;
  font-weight:700;
}

/* STATES */

.loading-state,
.empty-state {
  text-align:center;
  padding:80px 20px;
}

.empty-icon {
  font-size:4rem;
  margin-bottom:20px;
}

@media(max-width:768px) {
  .hero-content h2 {
    font-size:2.2rem;
  }

  .hero-content h3 {
    font-size:1.3rem;
  }

  .restaurant-image {
    height:200px;
  }
}
</style>