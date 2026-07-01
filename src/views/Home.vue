Seeing `image_fc0ee0.png` makes the issue instantly clear!

The reason it is still broken is that the old, glitchy mobile styles are **still sitting inside your `@media (max-width: 768px)` block** further down in the file. Those old styles are forcing `.search-input` to have a massive height and trying to position the magnifying glass icon absolutely (`left: 38px`), which breaks alignment on smaller screens.

I have completely cleaned out those legacy, conflicting styles from the media queries. Here is your full, complete, updated code. It preserves every single loop, variable, data block, and card style exactly as you wrote them, while ensuring the search card aligns beautifully just like a native app.

```vue
<script setup>
import { ref, onMounted, computed } from "vue";
import api from "../services/api";


const restaurants = ref([]);
const search = ref("");
const loading = ref(true);


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
    console.log(res.data);
    
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
  <div class="hero-overlay">
    <div class="container hero-content">
      <span class="hero-badge">🍔 Nigeria's Favourite Food Delivery</span>
      <h1>Delicious food, <br /> delivered to your doorstep.</h1>
      <p>Order from trusted restaurants around you and enjoy fast delivery...</p>
    </div>
  </div>
</section>

<!-- SEARCH -->
<section class="search-section">
  <div class="container">
    <div class="search-card">
      <span class="search-icon">🔍</span>
      <input v-model="search" class="search-input" placeholder="Search restaurants..." />
    </div>
  </div>
</section>


    <!-- MAIN CONTENT -->
    <div class="container py-5">

      <!-- CATEGORIES -->

<!-- POPULAR CATEGORIES -->

<section class="categories-section">

  <div class="container">

    <div class="section-header">

      <div>

        <h2>Browse by Category</h2>

        <p>Your favourite meals in one place</p>

      </div>

    </div>

    <div class="categories-grid">

      <div class="category-card">

        <div class="category-icon">🍕</div>

        <h5>Pizza</h5>

        <small>Hot & Fresh</small>

      </div>

      <div class="category-card">

        <div class="category-icon">🍔</div>

        <h5>Burger</h5>

        <small>Juicy Meals</small>

      </div>

      <div class="category-card">

        <div class="category-icon">🍗</div>

        <h5>Chicken</h5>

        <small>Crispy & Grilled</small>

      </div>

      <div class="category-card">

        <div class="category-icon">🍛</div>

        <h5>Rice</h5>

        <small>Local Specials</small>

      </div>

      <div class="category-card">

        <div class="category-icon">🌯</div>

        <h5>Shawarma</h5>

        <small>Street Favourite</small>

      </div>

      <div class="category-card">

        <div class="category-icon">🥤</div>

        <h5>Drinks</h5>

        <small>Cold & Fresh</small>

      </div>

    </div>

  </div>

</section>


      <!-- STATS -->

<section class="stats-section">

  <div class="container">

    <div class="stats-grid">

      <div class="stat-box">

        <div class="stat-icon">
          🏪
        </div>

        <div>

          <h3>
            {{ restaurants.length }}+
          </h3>

          <span>Restaurants</span>

        </div>

      </div>

      <div class="stat-box">

        <div class="stat-icon">
          🍔
        </div>

        <div>

          <h3>
            {{
              restaurants.reduce(
                (total, r) => total + Number(r.foods_count || 0),
                0
              )
            }}
          </h3>

          <span>Meals</span>

        </div>

      </div>

      <div class="stat-box">

        <div class="stat-icon">
          ⭐
        </div>

        <div>

          <h3>
            {{
              restaurants.reduce(
                (total, r) => total + Number(r.reviews_count || 0),
                0
              )
            }}
          </h3>

          <span>Reviews</span>

        </div>

      </div>

      <div class="stat-box">

        <div class="stat-icon">
          🚚
        </div>

        <div>

          <h3>Fast</h3>

          <span>Delivery</span>

        </div>

      </div>

    </div>

  </div>

</section>
    

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

  <div class="restaurant-image-wrapper">

    <img
      :src="r.image || getRestaurantImage(index)"
      class="restaurant-image"
    />

    <div
      class="restaurant-status"
      :class="r.is_open ? 'open' : 'closed'"
    >
      {{ r.is_open ? "Open" : "Closed" }}
    </div>

    <div class="restaurant-rating">

      ⭐ {{ Number(r.reviews_avg_rating || 0).toFixed(1) }}

    </div>

  </div>

  <div class="restaurant-body">

    <div class="restaurant-title">

      <h3>{{ r.name }}</h3>

      <span class="verified">
        ✔
      </span>

    </div>

    <p class="restaurant-description">

      {{ r.description }}

    </p>

    <div class="restaurant-location">

      📍 {{ r.address }}

    </div>

    <div class="restaurant-info">

      <div>

        🍔

        {{ r.foods_count }}

        Meals

      </div>

      <div>

        💬

        {{ r.reviews_count }}

        Reviews

      </div>

    </div>

    <button class="menu-btn">

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


/* ==========================================
   HERO
========================================== */

.hero-section{
    position:relative;
    overflow:hidden;
    background:linear-gradient(135deg,#00c896,#00a86b);
    min-height:420px;
    display:flex;
    align-items:center;
}

.hero-section::before{
    content:"";
    position:absolute;
    inset:0;
    background:
        radial-gradient(circle at top right,
        rgba(255,255,255,.18),
        transparent 35%),
        radial-gradient(circle at bottom left,
        rgba(255,255,255,.12),
        transparent 30%);
}

.hero-overlay{
    width:100%;
    position:relative;
    z-index:2;
}

.hero-content{
    padding:90px 0 100px;
    color:white;
}

.hero-badge{
    display:inline-flex;
    align-items:center;
    gap:8px;
    padding:10px 18px;
    border-radius:50px;
    background:rgba(255,255,255,.15);
    backdrop-filter:blur(10px);
    font-weight:600;
    margin-bottom:24px;
}

.hero-content h1{
    font-size:58px;
    line-height:1.05;
    font-weight:800;
    max-width:700px;
    margin-bottom:20px;
}

.hero-content p{
    max-width:560px;
    font-size:18px;
    line-height:1.7;
    opacity:.95;
}

/* ==========================================
   SEARCH
========================================== */

.search-section{
    margin-top: -30px; 
    padding: 0 16px;
    position:relative;
    z-index:20;
}

.search-card{
    background:white;
    border-radius:22px;
    padding: 16px 20px;
    display:flex;
    align-items:center;
    gap: 14px;
    box-shadow:0 20px 45px rgba(0,0,0,.12);
}

.search-icon{
    font-size:22px;
    color:#00a86b;
    display: inline-flex;
    align-items: center;
}

.search-input{
    flex:1;
    border:none;
    outline:none;
    font-size: 16px;
    background:transparent;
}

.search-input::placeholder{
    color:#94a3b8;
}

/* MOBILE */

@media (max-width: 768px) {

  .hero-section{
    padding: 45px 20px 70px;
    border-bottom-left-radius:24px;
    border-bottom-right-radius:24px;
  }

  .hero-content{
    width:100%;
    max-width:100%;
    padding:0 18px;
  }

  .hero-content h1{
    font-size:2.4rem;
    line-height:1.15;
    margin-bottom:18px;
    word-break:break-word;
  }

  .hero-content p{
    font-size:1rem;
    line-height:1.8;
    margin-bottom:28px;
    max-width:100%;
  }

  .hero-badge{
    display:inline-flex;
    font-size:.9rem;
    margin-bottom:22px;
  }

  /* Cleaned out conflicting absolute properties here so flexbox takes over smoothly */
  .search-section {
    margin-top: -35px;
    padding: 0 20px;
  }

  .search-card {
    padding: 14px 18px;
  }

  .search-input {
    font-size: 15px;
  }

}

@media (max-width: 400px){

.hero-content{
    padding:45px 0 70px;
}

.hero-content h1{
    font-size:32px;
    line-height:1.15;
}

.hero-content p{
    font-size:14px;
}

.hero-badge{
    font-size:12px;
}

.search-card{
    padding:12px 16px;
}

.search-input{
    font-size:14px;
}

}

/*===================================
 STATS
===================================*/

.stats-section{
    padding:45px 0 20px;
}

.stats-grid{
    display:grid;
    grid-template-columns:repeat(4,1fr);
    gap:22px;
}

.stat-box{
    background:#fff;
    border-radius:22px;
    padding:22px;
    display:flex;
    align-items:center;
    gap:18px;
    box-shadow:0 10px 35px rgba(0,0,0,.06);
    transition:.3s;
}

.stat-box:hover{
    transform:translateY(-6px);
}

.stat-icon{
    width:65px;
    height:65px;
    border-radius:18px;
    background:linear-gradient(135deg,#00c896,#00a86b);
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:28px;
    color:#fff;
}

.stat-box h3{
    margin:0;
    font-size:30px;
    font-weight:800;
    color:#111827;
}

.stat-box span{
    color:#64748b;
    font-weight:500;
}

@media(max-width:992px){

.stats-grid{
    grid-template-columns:repeat(2,1fr);
}

}

@media(max-width:768px){

.stats-grid{
    grid-template-columns:1fr;
}

.stat-box{
    padding:18px;
}

}


/*==================================
 RESTAURANT CARD
==================================*/

.restaurant-card{

background:#fff;

border-radius:24px;

overflow:hidden;

box-shadow:0 12px 40px rgba(15,23,42,.08);

transition:.35s;

height:100%;

display:flex;

flex-direction:column;

}

.restaurant-card:hover{

transform:translateY(-10px);

box-shadow:0 25px 55px rgba(0,0,0,.15);

}

.restaurant-image-wrapper{

position:relative;

overflow:hidden;

}

.restaurant-image{

width:100%;

height:240px;

object-fit:cover;

transition:.5s;

}

.restaurant-card:hover .restaurant-image{

transform:scale(1.08);

}

.restaurant-status{

position:absolute;

top:18px;

left:18px;

padding:8px 16px;

border-radius:50px;

font-size:13px;

font-weight:700;

color:white;

backdrop-filter:blur(10px);

}

.restaurant-status.open{

background:#22c55e;

}

.restaurant-status.closed{

background:#ef4444;

}

.restaurant-rating{

position:absolute;

top:18px;

right:18px;

background:white;

padding:8px 14px;

border-radius:50px;

font-weight:700;

box-shadow:0 5px 15px rgba(0,0,0,.12);

}

.restaurant-body{

padding:24px;

display:flex;

flex-direction:column;

flex:1;

}

.restaurant-title{

display:flex;

justify-content:space-between;

align-items:center;

margin-bottom:12px;

}

.restaurant-title h3{

margin:0;

font-size:24px;

font-weight:800;

color:#111827;

}

.verified{

width:34px;

height:34px;

border-radius:50%;

display:flex;

align-items:center;

justify-content:center;

background:#dcfce7;

color:#16a34a;

font-weight:700;

}

.restaurant-description{

color:#64748b;

line-height:1.6;

margin-bottom:18px;

min-height:48px;

}

.restaurant-location{

font-weight:600;

color:#374151;

margin-bottom:18px;

}

.restaurant-info{

display:flex;

justify-content:space-between;

padding:18px 0;

border-top:1px solid #f1f5f9;

border-bottom:1px solid #f1f5f9;

margin-bottom:22px;

font-weight:600;

color:#475569;

}

.menu-btn{

margin-top:auto;

width:100%;

border:none;

border-radius:14px;

padding:16px;

font-size:16px;

font-weight:700;

color:white;

background:linear-gradient(135deg,#00c896,#00a86b);

transition:.3s;

}

.menu-btn:hover{

transform:translateY(-2px);

box-shadow:0 12px 25px rgba(0,200,150,.3);

}

@media(max-width:768px){

.restaurant-image{

height:210px;

}

.restaurant-title h3{

font-size:20px;

}

.restaurant-body{

padding:18px;

}

}


/*===================================
  CATEGORIES
===================================*/

.categories-section{
    padding:25px 0 55px;
}

.categories-grid{
    display:grid;
    grid-template-columns:repeat(6,1fr);
    gap:20px;
}

.category-card{

    background:white;

    border-radius:22px;

    padding:30px 20px;

    text-align:center;

    cursor:pointer;

    transition:.35s;

    box-shadow:0 8px 25px rgba(0,0,0,.06);

}

.category-card:hover{

    transform:translateY(-8px);

    background:linear-gradient(135deg,#00c896,#00a86b);

    color:white;

}

.category-card:hover small{

    color:rgba(255,255,255,.8);

}

.category-icon{

    width:70px;

    height:70px;

    margin:auto;

    margin-bottom:18px;

    border-radius:20px;

    display:flex;

    align-items:center;

    justify-content:center;

    font-size:34px;

    background:#f1f5f9;

}

.category-card:hover .category-icon{

    background:rgba(255,255,255,.2);

}

.category-card h5{

    font-weight:700;

    margin-bottom:6px;

}

.category-card small{

    color:#64748b;

}

@media(max-width:992px){

.categories-grid{

grid-template-columns:repeat(3,1fr);

}

}

@media(max-width:768px){

.categories-grid{

grid-template-columns:repeat(2,1fr);

gap:15px;

}

.category-card{

padding:22px 15px;

}

.category-icon{

width:60px;

height:60px;

font-size:28px;

}

}
</style>

