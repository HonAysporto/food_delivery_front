import { createRouter, createWebHistory } from "vue-router";

import Register from "../views/Register.vue";
import Login from "../views/Login.vue";
import Dashboard from "@/views/Dashboard.vue";
import Home from "@/views/Home.vue";
import CustomerLayout from "../layouts/CustomerLayout.vue";
import ForgotPassword from "../views/ForgotPassword.vue";
import ResetPassword from "../views/ResetPassword.vue";
const GoogleAuth = () => import("../views/GoogleAuth.vue");


// lazy-loaded pages
const Orders = () => import("../views/Orders.vue");
const Checkout = () => import("../views/Checkout.vue");
const Restaurant = () => import("../views/Restaurant.vue");
const Cart = () => import("../views/Cart.vue");

// OWNER
const OwnerDashboard = () => import("../views/owner/OwnerDashboard.vue");
const CreateRestaurant = () => import("../views/owner/CreateRestaurant.vue");
const Foods = () => import("../views/owner/Foods.vue");
const Categories = () => import("../views/owner/Categories.vue");
const OwnerOrders = () => import("../views/owner/OwnerOrders.vue");
const OwnerLayout = () => import("../views/owner/OwnerLayout.vue");

const routes = [
  // AUTH
 // AUTH
{ path: "/login", component: Login },
{ path: "/register", component: Register },
{
  path: "/forgot-password",
  component: ForgotPassword,
},
{
  path: "/reset-password",
  component: ResetPassword,
},

{
  path: "/google-auth",
  component: GoogleAuth,
},

// CUSTOMER
{
  path: "/",
  component: CustomerLayout,
  children: [
    {
      path: "",
      component: Home,
    },
    {
      path: "restaurant/:id",
      component: Restaurant,
    },
    {
      path: "cart",
      component: Cart,
      meta: {
        requiresAuth: true,
        role: "customer",
      },
    },
    {
      path: "checkout",
      component: Checkout,
      meta: {
        requiresAuth: true,
        role: "customer",
      },
    },
    {
      path: "orders",
      component: Orders,
      meta: {
        requiresAuth: true,
        role: "customer",
      },
    },
    {
      path: "dashboard",
      component: Dashboard,
      meta: {
        requiresAuth: true,
        role: "customer",
      },
    },
  ],


},






 {
  path: "/admin",
  component: () =>
    import("../views/admin/AdminLayout.vue"),
  meta: {
    requiresAuth: true,
    role: "admin",
  },
  children: [
    {
      path: "dashboard",
      component: () =>
        import("../views/admin/AdminDashboard.vue"),
    },

    {
      path: "users",
      component: () =>
        import("../views/admin/AdminUsers.vue"),
    },

    {
      path: "restaurants",
      component: () =>
        import("../views/admin/AdminRestaurant.vue"),
    },

    {
      path: "orders",
      component: () =>
        import("../views/admin/Orders.vue"),
    },
  ],
},

  // OWNER ROUTES
// OWNER ROUTES
{
  path: "/owner",
  component: OwnerLayout,
  meta: {
    requiresAuth: true,
    role: "owner",
  },
  children: [
    {
      path: "dashboard",
      component: OwnerDashboard,
    },
    {
      path: "create-restaurant",
      component: CreateRestaurant,
    },
    {
      path: "foods",
      component: Foods,
    },
    {
      path: "categories",
      component: Categories,
    },
    {
      path: "orders",
      component: OwnerOrders,
    },
    {
      path: "profile",
      component: () =>
        import("../views/owner/Profile.vue"),
    },
  ],
},


// Rider ROUTES

{
  path: "/rider/create-profile",
  component: () => import("../views/rider/CreateProfile.vue"),
  meta: {
    requiresAuth: true,
    role: "rider",
  },
},

{
  path: "/rider/dashboard",
  component: () =>
    import("../views/rider/RiderDashboard.vue"),
  meta: {
    requiresAuth: true,
    role: "rider",
  },
},
];




const router = createRouter({
  history: createWebHistory(),
  routes,
});

//
// 🔐 GLOBAL ROUTE GUARD (AUTH + ROLE CONTROL)
//
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // ==========================
  // Not logged in
  // ==========================
  if (to.meta.requiresAuth && !token) {
    return next("/login");
  }

  // ==========================
  // Already logged in
  // ==========================
if (
  ["/login", "/register", "/forgot-password"].includes(to.path) &&
  token
) {
  return next("/");
}

  // ==========================
  // Role Protection
  // ==========================
  if (to.meta.role) {
    if (!user || user.role !== to.meta.role) {
      return next("/");
    }
  }

  // ==========================
  // OWNER
  // Prevent creating another restaurant
  // ==========================
  if (
    user?.role === "owner" &&
    to.path === "/owner/create-restaurant" &&
    user.restaurant_exists
  ) {
    return next("/owner/dashboard");
  }

  // ==========================
  // RIDER
  // Prevent creating another profile
  // ==========================
  if (
    user?.role === "rider" &&
    to.path === "/rider/create-profile" &&
    user.rider_profile_exists
  ) {
    return next("/rider/dashboard");
  }

  next();
});

export default router;