<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../services/api";
import { useCartStore } from "@/stores/cart";
import { useToast } from "vue-toastification";

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const toast = useToast();

const restaurant = ref(null);
const foods = ref([]);
const loading = ref(true);

// reviews state
const reviews = ref([]);
const averageRating = ref(0);
const totalReviews = ref(0);

const loadRestaurant = async () => {
  try {
    const id = route.params.id;

    const restRes = await api.get("/restaurants");
    restaurant.value = restRes.data.find((r) => r.id == id);

    const foodRes = await api.get(`/restaurants/${id}/foods`);
    foods.value = foodRes.data;

    try {
      const reviewRes = await api.get(`/restaurants/${id}/reviews`);
      
      reviews.value = reviewRes.data.reviews || [];
      averageRating.value = reviewRes.data.average_rating || 0;
      totalReviews.value = reviewRes.data.total_reviews || 0;
    } catch (e) {
      console.log("Reviews not available yet");
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const addToCart = (food) => {
  if (!restaurant.value?.is_open) {
    toast.error("Restaurant is currently closed.");
    return;
  }

  cartStore.addToCart(food);
  // toast.success(`${food.name} added to cart!`);
};

onMounted(loadRestaurant);

const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="restaurant-page">

    <!-- LOADING STATE -->
    <div v-if="loading" class="loading-section">
      <div class="spinner-border text-success"></div>
      <p class="mt-3">Loading restaurant menu...</p>
    </div>

    <!-- MAIN CONTENT VIEW -->
    <div v-else-if="restaurant">

      <!-- HERO BACKGROUND BANNER -->
      <section class="hero-banner">
        <img
          :src="restaurant.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591'"
          class="hero-image"
          alt="Restaurant Banner"
        />
        <div class="hero-cover-overlay"></div>
      </section>

      <!-- RESTAURANT INFORMATION IDENTITY CARD -->
      <div class="container restaurant-header-container">
        <div class="restaurant-profile-card">
          <div class="profile-card-top d-flex flex-wrap justify-content-between align-items-start gap-3">
            <div>
              <span class="restaurant-pill-status" :class="restaurant.is_open ? 'open' : 'closed'">
                {{ restaurant.is_open ? '🟢 Open Now' : '🔴 Closed' }}
              </span>
              <h1 class="restaurant-main-title">{{ restaurant.name }}</h1>
              <p class="restaurant-address-text">📍 {{ restaurant.address || "Lagos, Nigeria" }}</p>
            </div>
            
            <div class="rating-display-box">
              <span class="rating-number">⭐ {{ Number(averageRating || 0).toFixed(1) }}</span>
              <span class="rating-count-text">({{ totalReviews }} reviews)</span>
            </div>
          </div>
        </div>

        <!-- APP FEATURES QUICK STATS -->
        <div class="row g-3 mb-5 mt-2">
          <div class="col-6 col-md-4">
            <div class="stat-meta-box">
              <div class="stat-meta-icon">⏱️</div>
              <div class="stat-meta-info">
                <strong>30-45 min</strong>
                <p>Delivery Time</p>
              </div>
            </div>
          </div>

          <div class="col-6 col-md-4">
            <div class="stat-meta-box">
              <div class="stat-meta-icon">🚚</div>
              <div class="stat-meta-info">
                <strong>Free Delivery</strong>
                <p>On all local orders</p>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-4 d-none d-md-block">
            <div class="stat-meta-box">
              <div class="stat-meta-icon">🍱</div>
              <div class="stat-meta-info">
                <strong>{{ foods.length }} Items</strong>
                <p>Available on Menu</p>
              </div>
            </div>
          </div>
        </div>

        <!-- MENU TITLE HEADER -->
        <div class="menu-section-title-block">
          <h2>Popular Menu Selection</h2>
          <p>Freshly prepared items delivered directly to your destination</p>
        </div>

        <!-- FOOD DISPLAY GRID -->
        <div v-if="foods.length" class="row g-4">
          <div v-for="food in foods" :key="food.id" class="col-md-6 col-lg-4">
            <div class="food-display-card">
              <div class="food-img-frame">
                <img
                  :src="food.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4'"
                  class="food-display-img"
                  alt="Food Item Image"
                />
                <div class="food-price-badge">
                  ₦{{ Number(food.price).toLocaleString() }}
                </div>
              </div>

              <div class="food-display-body">
                <h4 class="food-display-title">{{ food.name }}</h4>
                <p class="food-display-desc">
                  {{ food.description || "Freshly prepared authentic local ingredients selection crafted by culinary professionals." }}
                </p>

                <div class="d-flex align-items-center justify-content-between mt-auto pt-3 border-top-divider">
                  <span class="stock-indicator-text" :class="food.is_available ? 'in-stock' : 'out-of-stock'">
                    {{ food.is_available ? 'Available' : 'Out of Stock' }}
                  </span>

                  <button
                    v-if="food.is_available"
                    :disabled="!restaurant.is_open"
                    class="food-action-add-btn"
                    @click="addToCart(food)"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Add
                  </button>

                  <button v-else class="food-action-disabled-btn" disabled>
                    Unavailable
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- EMPTY STATE VIEW -->
        <div v-else class="empty-state-card">
          <div class="empty-state-icon">🍽️</div>
          <h3>No Menu Available</h3>
          <p>This restaurant hasn't uploaded any items to their catalog yet.</p>
        </div>

        <!-- ==========================================
             REVIEWS SECTION
        ========================================== -->
        <div class="reviews-section-wrapper">
          <div class="menu-section-title-block">
            <h2>Customer Feedback</h2>
            <p>What people say about their dining experience here</p>
          </div>

          <div v-if="reviews.length" class="row g-3">
            <div v-for="review in reviews" :key="review.id" class="col-12 col-md-6">
              <div class="review-card">
                <div class="d-flex align-items-start justify-content-between gap-2">
                  <div class="d-flex align-items-center gap-3">
                    <div class="review-avatar">
                      {{ review.user?.firstname?.charAt(0).toUpperCase() || review.customer_name?.charAt(0).toUpperCase() || 'C' }}
                    </div>
                    <div>
                      <h5 class="review-username">
                        {{ review.user?.firstname || review.customer_name || 'Verified Customer' }}
                      </h5>
                      <div class="review-stars">
                        <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= (review.rating || review.stars) }">
                          ★
                        </span>
                      </div>
                    </div>
                  </div>
                  <span class="review-date">
                    {{ review.created_at ? new Date(review.created_at).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : 'Recent' }}
                  </span>
                </div>
                <p class="review-comment">
                  {{ review.comment || review.text || "Great service, delicious meals, and super clean packaging!" }}
                </p>
              </div>
            </div>
          </div>

          <!-- NO REVIEWS PLACEHOLDER -->
          <div v-else class="empty-reviews-box">
            <p>No written reviews available yet for this restaurant. Be the first to place an order and share your feedback!</p>
          </div>
        </div>

      </div>
    </div>

    <!-- RESTAURANT ERROR CRITICAL STATE -->
    <div v-else class="empty-state-card">
      <div class="empty-state-icon">😕</div>
      <h3>Restaurant Profile Missing</h3>
      <p>We can't find the restaurant matching this parameters link setup profile identifier.</p>
      <router-link to="/" class="fallback-home-btn">
        Return Home
      </router-link>
    </div>

  </div>
</template>

<style scoped>
.restaurant-page {
  background: #f9f9f9;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #333333;
}

/* ==========================================
   HERO PRESENTATION SCENERY
========================================== */
.hero-banner {
  position: relative;
  height: 280px;
  width: 100%;
  overflow: hidden;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.4));
}

/* ==========================================
   RESTAURANT FLOATING CARD CONTAINER
========================================== */
.restaurant-header-container {
  margin-top: -80px;
  position: relative;
  z-index: 30;
  padding-left: 16px;
  padding-right: 16px;
}

.restaurant-profile-card {
  background: #ffffff;
  border-radius: 24px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid #f2f2f2;
}

.restaurant-pill-status {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 800;
  margin-bottom: 14px;
}

.restaurant-pill-status.open {
  background: #e6f6ee;
  color: #00a86b;
}

.restaurant-pill-status.closed {
  background: #fff5f5;
  color: #ef4444;
}

.restaurant-main-title {
  font-size: 34px;
  font-weight: 900;
  color: #111111;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.restaurant-address-text {
  color: #7d7d7d;
  font-weight: 500;
  margin: 0;
  font-size: 15px;
}

/* RATING COMPACT DISPLAY */
.rating-display-box {
  background: #fffdf6;
  border: 1px solid #fff1ce;
  padding: 12px 18px;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 110px;
}

.rating-number {
  font-size: 18px;
  font-weight: 800;
  color: #333333;
}

.rating-count-text {
  font-size: 11px;
  color: #8c8c8c;
  font-weight: 600;
  margin-top: 2px;
}

/* ==========================================
   METADATA FEATURES BOX STRIP
========================================== */
.stat-meta-box {
  background: #ffffff;
  border-radius: 20px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid #ededed;
  height: 100%;
}

.stat-meta-icon {
  font-size: 24px;
}

.stat-meta-info {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.stat-meta-info strong {
  font-size: 15px;
  font-weight: 800;
  color: #111111;
}

.stat-meta-info p {
  margin: 0;
  font-size: 12px;
  color: #8c8c8c;
  font-weight: 500;
}

/* ==========================================
   MENU LIST TITLE CARD SECTION
========================================== */
.menu-section-title-block {
  margin: 45px 0 25px 0;
}

.menu-section-title-block h2 {
  font-size: 24px;
  font-weight: 900;
  color: #111111;
  margin: 0 0 4px 0;
  letter-spacing: -0.3px;
}

.menu-section-title-block p {
  color: #7d7d7d;
  font-size: 15px;
  margin: 0;
}

/* ==========================================
   PREMIUM PLATFORM FOOD CARDS
========================================== */
.food-display-card {
  background: #ffffff;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid #ededed;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.food-display-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.06);
}

.food-img-frame {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f2f2f2;
}

.food-display-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.food-price-badge {
  position: absolute;
  bottom: 14px;
  right: 14px;
  background: #ffffff;
  color: #111111;
  padding: 6px 14px;
  border-radius: 50px;
  font-weight: 900;
  font-size: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.food-display-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.food-display-title {
  font-size: 18px;
  font-weight: 800;
  color: #111111;
  margin: 0 0 8px 0;
}

.food-display-desc {
  color: #7d7d7d;
  font-size: 13.5px;
  line-height: 1.5;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 40px;
}

.border-top-divider {
  border-top: 1px solid #f5f5f5;
}

.stock-indicator-text {
  font-size: 13px;
  font-weight: 700;
}

.stock-indicator-text.in-stock {
  color: #00a86b;
}

.stock-indicator-text.out-of-stock {
  color: #ef4444;
}

/* ACTION BUTTON DESIGN INTERCHANGE */
.food-action-add-btn {
  background: #ffc244;
  color: #333333;
  border: none;
  font-weight: 800;
  font-size: 14px;
  padding: 8px 18px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: background-color 0.15s ease, transform 0.15s ease;
}

.food-action-add-btn:hover {
  background: #eebb37;
}

.food-action-add-btn:active {
  transform: scale(0.95);
}

.food-action-add-btn:disabled {
  background: #e2e8f0;
  color: #94a3b8;
  cursor: not-allowed;
}

.food-action-disabled-btn {
  background: #f5f5f5;
  color: #b5b5b5;
  border: 1px solid #e6e6e6;
  font-weight: 700;
  font-size: 13px;
  padding: 8px 16px;
  border-radius: 50px;
  cursor: not-allowed;
}

/* ==========================================
   CUSTOMER REVIEWS CARDS
========================================== */
.reviews-section-wrapper {
  margin-top: 40px;
  padding-bottom: 60px;
}

.review-card {
  background: #ffffff;
  border: 1px solid #ededed;
  border-radius: 20px;
  padding: 20px;
  height: 100%;
}

.review-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f1f5f9;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 15px;
}

.review-username {
  font-size: 15px;
  font-weight: 700;
  color: #111111;
  margin: 0;
}

.review-stars {
  font-size: 12px;
  color: #e2e8f0;
}

.star.filled {
  color: #ffc244;
}

.review-date {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
}

.review-comment {
  margin: 12px 0 0 0;
  font-size: 14px;
  color: #4b5563;
  line-height: 1.5;
}

.empty-reviews-box {
  background: #ffffff;
  border: 1px dashed #cbd5e1;
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  color: #64748b;
  font-size: 14px;
}

/* ==========================================
   APP APP LOADING & BLANK ERROR STATES
========================================== */
.loading-section,
.empty-state-card {
  text-align: center;
  padding: 80px 20px;
  background: #ffffff;
  border-radius: 24px;
  margin: 40px auto;
  max-width: 500px;
  border: 1px solid #ededed;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
}

.empty-state-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state-card h3 {
  font-size: 20px;
  font-weight: 900;
  margin-bottom: 8px;
}

.empty-state-card p {
  color: #7d7d7d;
  font-size: 14px;
  margin-bottom: 24px;
}

.fallback-home-btn {
  display: inline-block;
  background: #00a86b;
  color: #ffffff;
  text-decoration: none;
  font-weight: 700;
  padding: 12px 28px;
  border-radius: 50px;
  transition: background-color 0.2s ease;
}

.fallback-home-btn:hover {
  background: #00935f;
  color: #ffffff;
}

/* ==========================================
   MOBILE DISPLACEMENT OVERRIDES
========================================== */
@media (max-width: 768px) {
  .hero-banner {
    height: 200px;
  }

  .restaurant-header-container {
    margin-top: -60px;
  }

  .restaurant-profile-card {
    padding: 20px;
  }

  .restaurant-main-title {
    font-size: 26px;
  }

  .rating-display-box {
    flex-direction: row;
    gap: 8px;
    width: 100%;
    justify-content: flex-start;
    padding: 8px 14px;
    border-radius: 12px;
  }

  .stat-meta-box {
    padding: 12px;
    gap: 10px;
  }

  .stat-meta-info strong {
    font-size: 13px;
  }

  .stat-meta-info p {
    font-size: 11px;
  }
}
</style>