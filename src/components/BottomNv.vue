<template>
  <nav class="bottom-nav">

    <RouterLink to="/" class="nav-item">
      <span>🏠</span>
      <small>Home</small>
    </RouterLink>

    <RouterLink to="/cart" class="nav-item">
      <span>🛒</span>
      <small>Cart</small>
    </RouterLink>

    <RouterLink to="/orders" class="nav-item">
      <span>📦</span>
      <small>Orders</small>
    </RouterLink>

  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  background: white;
  border-top: 1px solid #eee;

  display: flex;
  justify-content: space-around;

  padding: 12px 0;

  z-index: 1000;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;

  text-decoration: none;
  color: #555;
}

.router-link-active {
  color: #00a082;
  font-weight: bold;
}
</style>