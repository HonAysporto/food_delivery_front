<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../services/api";
import { useCartStore } from "@/stores/cart";

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();

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

    // reviews API (only if backend exists)
    try {
      const res = await api.get(`/restaurants/${id}/reviews`);

      reviews.value = res.data.reviews || [];
      averageRating.value = res.data.average_rating || 0;
      totalReviews.value = res.data.total_reviews || 0;
    } catch (e) {
      console.log("Reviews not available yet");
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

onMounted(loadRestaurant);

const goBack = () => {
  router.back();
};
</script>


  <template>
  <div class="restaurant-page">

    <!-- TOP BAR -->
    <div class="top-bar">

      <button
        @click="goBack"
        class="back-btn"
      >
        ←
      </button>

      <router-link
        to="/cart"
        class="cart-btn"
      >
        🛒
        <span class="cart-count">
          {{ cartStore.totalItems }}
        </span>
      </router-link>

    </div>

    <!-- LOADING -->
    <div
      v-if="loading"
      class="loading-section"
    >
      <div class="spinner-border text-success"></div>

      <p class="mt-3">
        Loading restaurant...
      </p>
    </div>

    <!-- CONTENT -->
    <div
      v-else-if="restaurant"
    >

      <!-- HERO -->
      <section class="hero-banner">

        <img
          :src="restaurant.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591'"
          class="hero-image"
        />

        <div class="hero-overlay">

          <div class="restaurant-badge">
         ⭐ {{ averageRating }}
({{ totalReviews }} reviews)
          </div>

          <h1>
            {{ restaurant.name }}
          </h1>

<span
  class="badge rounded-pill fs-5 px-3 py-2 hero-status"
  :class="
    restaurant.is_open
      ? 'bg-success'
      : 'bg-danger'
  "
>
  {{
    restaurant.is_open
      ? '🟢 Open'
      : '🔴 Closed'
  }}
</span>

          <p>
            📍 {{ restaurant.address || "Lagos" }}
          </p>

        </div>

      </section>

      <div class="container py-4">

        <!-- STATS -->
        <div class="row g-3 mb-5">

          <div class="col-md-4">
            <div class="stat-card">
              <div class="stat-icon">
                ⭐
              </div>

              <h3>
                {{ restaurant.rating || "4.5" }}
              </h3>

              <p>Customer Rating</p>
            </div>
          </div>

          <div class="col-md-4">
            <div class="stat-card">
              <div class="stat-icon">
                🍽️
              </div>

              <h3>
                {{ foods.length }}
              </h3>

              <p>Menu Items</p>
            </div>
          </div>

          <div class="col-md-4">
            <div class="stat-card">
              <div class="stat-icon">
                🚚
              </div>

              <h3>
                Free
              </h3>

              <p>Delivery</p>
            </div>
          </div>

        </div>

        <!-- MENU HEADER -->

        <div class="menu-header">

          <h2>
            🍽️ Popular Menu
          </h2>

          <p>
            Choose your favorite meal
          </p>

        </div>

        <!-- FOOD GRID -->

        <div
          v-if="foods.length"
          class="row g-4"
        >

          <div
            v-for="food in foods"
            :key="food.id"
            class="col-md-6 col-lg-4"
          >

            <div class="food-card">

              <div class="food-image-wrapper">

                <img
                  :src="food.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4'"
                  class="food-image"
                />

                <div class="price-tag">
                  ₦{{ food.price }}
                </div>

              </div>

              <div class="food-content">

                <h4>
                  {{ food.name }}
                </h4>

                <p>
                  {{
                    food.description ||
                    "Freshly prepared and delicious."
                  }}
                </p>

                <div class="mb-2">

  <span
    v-if="food.is_available"
    class="badge bg-success"
  >
    Available
  </span>

  <span
    v-else
    class="badge bg-danger"
  >
    Out Of Stock
  </span>

</div>

              <button
                :disabled="!restaurant.is_open"
  v-if="food.is_available"
  class="btn btn-primary"
  @click="addToCart(food)"
>
  Add To Cart
</button>

<button
  v-else
  class="btn btn-secondary"
  disabled
>
  Out Of Stock
</button>

              </div>

            </div>

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
            No Food Available
          </h3>

          <p>
            This restaurant has not uploaded menu items yet.
          </p>
        </div>

      </div>

    </div>

    <!-- ERROR -->

    <div
      v-else
      class="empty-state"
    >
      <div class="empty-icon">
        😕
      </div>

      <h3>
        Restaurant Not Found
      </h3>

      <router-link
        to="/"
        class="btn btn-success mt-3"
      >
        Back Home
      </router-link>
    </div>

  </div>
</template>



<style scoped>

.restaurant-page{
  background:#f8fafc;
  min-height:100vh;
}

/* TOP BAR */

.top-bar{
  position:fixed;
  top:20px;
  left:20px;
  right:20px;
  z-index:1000;

  display:flex;
  justify-content:space-between;
}

.back-btn,
.cart-btn{
  width:55px;
  height:55px;

  border:none;

  background:rgba(255,255,255,.9);

  backdrop-filter:blur(10px);

  border-radius:50%;

  display:flex;
  align-items:center;
  justify-content:center;

  text-decoration:none;

  box-shadow:0 8px 25px rgba(0,0,0,.15);
}

.cart-btn{
  position:relative;
}

.cart-count{
  position:absolute;
  top:-5px;
  right:-5px;

  width:22px;
  height:22px;

  background:#ff4757;
  color:white;

  border-radius:50%;

  font-size:.75rem;
  font-weight:bold;

  display:flex;
  align-items:center;
  justify-content:center;
}

/* HERO */

.hero-banner{
  position:relative;
  height:420px;
}

.hero-image{
  width:100%;
  height:100%;
  object-fit:cover;
}

.hero-overlay{
  position:absolute;
  inset:0;

  background:linear-gradient(
    to top,
    rgba(0,0,0,.75),
    rgba(0,0,0,.1)
  );

  display:flex;
  flex-direction:column;
  justify-content:flex-end;

  padding:40px;

  color:white;
}

.hero-overlay h1{
  font-size:3rem;
  font-weight:800;
}

.restaurant-badge{
  width:max-content;

  padding:8px 14px;

  background:white;
  color:black;

  border-radius:25px;

  font-weight:700;

  margin-bottom:15px;
}

/* STATS */

.stat-card{
  background:white;

  border-radius:20px;

  text-align:center;

  padding:25px;

  box-shadow:0 10px 25px rgba(0,0,0,.06);
}

.stat-icon{
  font-size:2rem;
  margin-bottom:10px;
}

.stat-card h3{
  font-weight:800;
}

.stat-card p{
  color:#6b7280;
}

/* MENU */

.menu-header{
  margin-bottom:30px;
}

.menu-header h2{
  font-weight:800;
}

.menu-header p{
  color:#6b7280;
}

/* FOOD CARD */

.food-card{
  background:white;

  border-radius:24px;

  overflow:hidden;

  box-shadow:0 10px 30px rgba(0,0,0,.08);

  transition:.3s;
}

.food-card:hover{
  transform:translateY(-8px);
}

.food-image-wrapper{
  position:relative;
}

.food-image{
  width:100%;
  height:220px;
  object-fit:cover;
}

.price-tag{
  position:absolute;
  top:15px;
  right:15px;

  background:white;

  padding:8px 14px;

  border-radius:20px;

  font-weight:800;
}

.food-content{
  padding:20px;
}

.food-content h4{
  font-weight:700;
}

.food-content p{
  color:#6b7280;
  min-height:45px;
}

.add-btn{
  width:100%;

  border:none;

  border-radius:14px;

  padding:14px;

  font-weight:700;

  color:white;

  background:linear-gradient(
    135deg,
    #00c896,
    #00a86b
  );
}

/* STATES */

.loading-section,
.empty-state{
  text-align:center;
  padding:120px 20px;
}

.empty-icon{
  font-size:4rem;
  margin-bottom:20px;
}

@media(max-width:768px){

  .hero-banner{
    height:320px;
  }

  .hero-overlay{
    padding:25px;
  }

  .hero-overlay h1{
    font-size:2rem;
  }

}

.hero-status{
  display:inline-flex;
  align-items:center;
  width:auto;
  align-self:flex-start;
}

</style>
