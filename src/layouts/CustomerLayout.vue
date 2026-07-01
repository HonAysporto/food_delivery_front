<script setup>
import { computed } from "vue";
import { RouterView, RouterLink, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useCartStore } from "../stores/cart";

const authStore = useAuthStore();
const cartStore = useCartStore();
const router = useRouter();

const isLoggedIn = computed(() => !!authStore.token);

const logout = () => {
  authStore.logout();
  router.push("/login");
};
</script>

<template>
  <div class="customer-layout">

    <!-- HEADER -->
    <header class="topbar">
      <div class="container d-flex justify-content-between align-items-center header-wrapper">

        <!-- LOGO & DESKTOP NAV GROUP -->
        <div class="d-flex align-items-center gap-4">
          <RouterLink to="/" class="logo text-decoration-none">
            <span class="logo-icon">🍔</span> TAZVO
          </RouterLink>

          <!-- DESKTOP INTEGRATED NAVIGATION -->
          <nav class="desktop-nav d-none d-md-flex align-items-center gap-2">
           
            
            <RouterLink v-if="isLoggedIn" to="/orders" class="nav-link-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              Orders
            </RouterLink>

            <RouterLink v-if="isLoggedIn" to="/dashboard" class="nav-link-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Profile
            </RouterLink>
          </nav>
        </div>

        <!-- RIGHT SIDE ACTIONS -->
        <div class="d-flex align-items-center gap-3">
          
          <div v-if="isLoggedIn" class="welcome-badge d-none d-sm-flex align-items-center gap-2">
            <div class="avatar-circle">
              {{ authStore.user?.firstname?.charAt(0).toUpperCase() || 'U' }}
            </div>
            <div class="welcome-text">
              <span class="greeting">Welcome back,</span>
              <span class="username">{{ authStore.user?.firstname }}</span>
            </div>
          </div>

          <!-- CART ACTION BUTTON -->
          <RouterLink to="/cart" class="cart-action-btn" aria-label="View Cart">
            <div class="cart-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              <span v-if="cartStore.totalItems" class="cart-pill-count">
                {{ cartStore.totalItems }}
              </span>
            </div>
          </RouterLink>

          <!-- LOGOUT BUTTON -->
          <button v-if="isLoggedIn" class="logout-action-btn d-none d-md-block" @click="logout">
            Logout
          </button>
        </div>

      </div>
    </header>

    <!-- MAIN COMPONENT DISPLAY VIEW -->
    <main class="page-container">
      <RouterView />
    </main>

    <!-- FOOTER -->

<footer class="footer">

  <div class="container">

    <div class="row gy-4">

      <div class="col-lg-4">

        <h3 class="footer-logo">
          🍔 Foodly
        </h3>

        <p class="footer-text">
          Order delicious meals from your favourite restaurants and get them delivered fast to your doorstep.
        </p>

      </div>

      <div class="col-lg-2">

        <h5>Explore</h5>

        <RouterLink to="/">
          Home
        </RouterLink>

        <RouterLink to="/orders">
          Orders
        </RouterLink>

        <RouterLink to="/dashboard">
          Profile
        </RouterLink>

      </div>

      <div class="col-lg-3">

        <h5>Support</h5>

        <a href="#">Help Center</a>

        <a href="#">Privacy Policy</a>

        <a href="#">Terms & Conditions</a>

      </div>

      <div class="col-lg-3">

        <h5>Contact</h5>

        <p>📍 Lagos, Nigeria</p>

        <p>📧 support@foodly.com</p>

        <p>☎ +234 800 000 0000</p>

      </div>

    </div>

    <hr>

    <div class="footer-bottom">

      <p>
        © {{ new Date().getFullYear() }} Foodly. All rights reserved.
      </p>

      <div class="socials">

        <a href="#">
          🌐
        </a>

        <a href="#">
          📘
        </a>

        <a href="#">
          📷
        </a>

        <a href="#">
          🐦
        </a>

      </div>

    </div>

  </div>

</footer>

    <!-- MOBILE BOTTOM APP NAV -->
    <div v-if="isLoggedIn" class="bottom-app-nav d-flex d-md-none">
      <RouterLink to="/" class="bottom-nav-tab">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <span>Home</span>
      </RouterLink>

      <RouterLink to="/orders" class="bottom-nav-tab">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
        <span>Orders</span>
      </RouterLink>

      <RouterLink to="/dashboard" class="bottom-nav-tab">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span>Profile</span>
      </RouterLink>
    </div>

  </div>
</template>

<style scoped>
.customer-layout {
  min-height: 100vh;
  background: #f9f9f9;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #333333;
}

/* ==========================================
   HEADER TOPBAR
========================================== */
.topbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: #ffffff;
  padding: 14px 0;
  border-bottom: 1px solid #f2f2f2;
}

.header-wrapper {
  padding: 0 16px;
}

.logo {
  font-size: 25px;
  font-weight: 900;
  color: #00a86b; /* Glovo Amber Signature Accent */
  display: flex;
  align-items: center;
  gap: 6px;
  letter-spacing: -0.5px;
}

.logo-icon {
  font-size: 26px;
}

/* ==========================================
   DESKTOP NAVIGATION LINKS
========================================== */
.desktop-nav {
  margin-left: 20px;
}

.nav-link-item {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #7d7d7d;
  font-weight: 700;
  font-size: 15px;
  padding: 10px 16px;
  border-radius: 50px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-link-item hover {
  color: #00a86b;
  background-color: #f4fbf7;
}

.nav-link-item.router-link-active {
  color: #00a86b;
  background-color: #e6f6ee;
}

/* ==========================================
   USER BADGE AND PROFILE ELEMENTS
========================================== */
.welcome-badge {
  background: #fffdf6;
  border: 1px solid #fff1ce;
  padding: 6px 14px 6px 6px;
  border-radius: 50px;
}

.avatar-circle {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #ffc244;
  color: #333333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 14px;
  box-shadow: 0 2px 5px rgba(255, 194, 68, 0.3);
}

.welcome-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.greeting {
  font-size: 11px;
  color: #8c8c8c;
  font-weight: 500;
}

.username {
  font-size: 13px;
  font-weight: 700;
  color: #333333;
}

/* ==========================================
   CART SYSTEM BUTTON
========================================== */
.cart-action-btn {
  text-decoration: none;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.cart-action-btn active {
  transform: scale(0.95);
}

.cart-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #00a86b; /* Glovo Deep Primary Emerald */
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 168, 107, 0.25);
  transition: background-color 0.2s ease;
}

.cart-icon-wrapper hover {
  background: #00935f;
}

.cart-pill-count {
  position: absolute;
  top: -3px;
  right: -3px;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: 10px;
  background: #ffc244;
  color: #333333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 900;
  border: 2px solid #ffffff;
}

/* ==========================================
   LOGOUT INTERFACE BUTTON
========================================== */
.logout-action-btn {
  border: 1px solid #f2f2f2;
  background: #ffffff;
  color: #ef4444;
  font-weight: 700;
  font-size: 14px;
  border-radius: 50px;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-action-btn hover {
  background: #fff5f5;
  border-color: #fecaca;
}

/* ==========================================
   PAGE MOUNT ROOT WRAPPER
========================================== */
.page-container {
  min-height: calc(100vh - 77px);
}

/* ==========================================
   MOBILE ECOSYSTEM (BOTTOM BAR APP NAV)
========================================== */
.bottom-app-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  border-top: 1px solid #ededed;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.04);
  justify-content: space-around;
  padding: 8px 0 max(8px, env(safe-area-inset-bottom));
  z-index: 1000;
}

.bottom-nav-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-decoration: none;
  color: #9e9e9e;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 20px;
  border-radius: 20px;
  transition: all 0.2s ease;
}

.bottom-nav-tab svg {
  transition: transform 0.2s ease;
}

.bottom-nav-tab.router-link-active {
  color: #00a86b;
}

.bottom-nav-tab.router-link-active svg {
  transform: translateY(-1px);
  stroke: #00a86b;
}

/* ==========================================
   RESPONSIVE SCREEN OVERRIDES
========================================== */
@media (max-width: 768px) {
  .topbar {
    padding: 10px 0;
  }
  
  .logo {
    font-size: 22px;
  }

  .page-container {
    padding-bottom: calc(66px + max(8px, env(safe-area-inset-bottom)));
  }
}

/* ===========================
   FOOTER
=========================== */

.footer{
    background:#111827;
    color:#fff;
    margin-top:80px;
    padding:70px 0 25px;
}

.footer-logo{
    font-size:2rem;
    font-weight:800;
    margin-bottom:15px;
}

.footer-text{
    color:#cbd5e1;
    line-height:1.8;
    max-width:320px;
}

.footer h5{
    margin-bottom:20px;
    font-weight:700;
}

.footer a{
    display:block;
    color:#d1d5db;
    text-decoration:none;
    margin-bottom:12px;
    transition:.3s;
}

.footer a:hover{
    color:#00d084;
    transform:translateX(5px);
}

.footer p{
    color:#d1d5db;
    margin-bottom:10px;
}

.footer hr{
    border-color:#374151;
    margin:35px 0 20px;
}

.footer-bottom{
    display:flex;
    justify-content:space-between;
    align-items:center;
}

.socials{
    display:flex;
    gap:14px;
}

.socials a{
    width:42px;
    height:42px;
    border-radius:50%;
    background:#1f2937;
    display:flex;
    justify-content:center;
    align-items:center;
    font-size:18px;
    margin:0;
}

.socials a:hover{
    background:#00c896;
    color:white;
    transform:translateY(-3px);
}

@media(max-width:768px){

.footer{
    padding:50px 0 100px;
}

.footer-bottom{
    flex-direction:column;
    gap:20px;
    text-align:center;
}

.footer-logo{
    text-align:center;
}

.footer-text{
    max-width:none;
    text-align:center;
}

}
</style>