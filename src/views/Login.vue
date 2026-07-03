<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const form = ref({
  email: "",
  password: "",
});

const loading = ref(false);
const error = ref("");
const showPassword = ref(false);

const loginWithGoogle = () => {
  window.location.href =
    "http://127.0.0.1:8000/api/auth/google";
};

const handleLogin = async () => {
  error.value = "";

  if (!form.value.email || !form.value.password) {
    error.value = "Email and password are required";
    return;
  }

  loading.value = true;
  try {
    await authStore.login({
      email: form.value.email,
      password: form.value.password,
    });
    
    // Redirect based on user role
    const role = authStore.user?.role;
    if (role === "owner") {
      router.push("/owner/dashboard");
    } else if (role === "admin") {
      router.push("/admin/dashboard");
    } else if (role === "rider") {
      router.push("/rider/dashboard");
    } else {
      // Default for customer
      router.push("/");
    }
  } catch (err) {
    error.value = err.response?.data?.message || "Login failed";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div style="background: linear-gradient(135deg, #00d084 0%, #00a86b 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center;">
    <div class="container">
      <div style="max-width: 450px; margin: 0 auto;">
        <!-- HEADER SECTION -->
        <div style="text-align: center; margin-bottom: 2rem; color: white;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🚀</div>
          <h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">TAZVO</h1>
          <p style="font-size: 1rem; opacity: 0.9;">Order delicious food at your fingertips</p>
        </div>

        <!-- LOGIN CARD -->
        <div class="card" style="border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); border: none;">
          <div style="padding: 2.5rem;">
            <h2 style="text-align: center; margin-bottom: 0.5rem; font-size: 1.8rem; font-weight: 700;">Welcome Back</h2>
            <p style="text-align: center; color: #999; margin-bottom: 2rem; font-size: 0.95rem;">Sign in to your account</p>

            <!-- ERROR MESSAGE -->
            <div v-if="error" style="padding: 1rem; background: rgba(255, 71, 87, 0.1); border-left: 4px solid #ff4757; border-radius: 8px; margin-bottom: 1.5rem; color: #c92a2a;">
              <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
                <span style="font-size: 1.2rem; margin-top: -2px;">⚠️</span>
                <div>
                  <div style="font-weight: 600; margin-bottom: 0.25rem;">Error</div>
                  <div style="font-size: 0.9rem;">{{ error }}</div>
                </div>
              </div>
            </div>

            <!-- LOGIN FORM -->
            <form @submit.prevent="handleLogin">
              <!-- EMAIL FIELD -->
              <div style="margin-bottom: 1.5rem;">
                <label for="email" style="display: block; font-weight: 600; margin-bottom: 0.75rem; color: #1a1a1a; font-size: 0.95rem;">
                  📧 Email Address
                </label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  class="form-control"
                  placeholder="you@example.com"
                  required
                  style="border-radius: 10px; border: 2px solid #e8e8e8; padding: 0.9rem 1.1rem; font-size: 1rem; transition: all 0.3s ease;"
                  @focus="$event.target.style.borderColor = '#00d084'; $event.target.style.boxShadow = '0 0 0 3px rgba(0, 208, 132, 0.1)'"
                  @blur="$event.target.style.borderColor = '#e8e8e8'; $event.target.style.boxShadow = 'none'"
                />
              </div>

              <!-- PASSWORD FIELD -->
              <div style="margin-bottom: 1.5rem;">
                <label for="password" style="display: block; font-weight: 600; margin-bottom: 0.75rem; color: #1a1a1a; font-size: 0.95rem;">
                  🔐 Password
                </label>
              <div style="position: relative;">
  <input
    id="password"
    v-model="form.password"
    :type="showPassword ? 'text' : 'password'"
    class="form-control"
    placeholder="••••••••"
    required
    style="border-radius: 10px; border: 2px solid #e8e8e8; padding: 0.9rem 3rem 0.9rem 1.1rem; font-size: 1rem; transition: all 0.3s ease;"
    @focus="$event.target.style.borderColor = '#00d084'; $event.target.style.boxShadow = '0 0 0 3px rgba(0, 208, 132, 0.1)'"
    @blur="$event.target.style.borderColor = '#e8e8e8'; $event.target.style.boxShadow = 'none'"
  />

  <button
    type="button"
    @click="showPassword = !showPassword"
    style="
      position:absolute;
      right:12px;
      top:50%;
      transform:translateY(-50%);
      border:none;
      background:none;
      cursor:pointer;
      font-size:18px;
    "
  >
    {{ showPassword ? "🙈" : "👁️" }}
  </button>
</div>
              </div>

              <!-- REMEMBER ME & FORGOT PASSWORD -->
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; font-size: 0.9rem;">
                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: #666;">
                  <input type="checkbox" style="width: 18px; height: 18px; cursor: pointer;"/>
                  Remember me
                </label>
                <router-link
    to="/forgot-password"
    style="
      color:#00d084;
      text-decoration:none;
      font-weight:600;
    "
>
    Forgot Password?
</router-link>
              </div>

              <!-- SIGN IN BUTTON -->
              <button
                type="submit"
                :disabled="loading"
                class="btn btn-primary"
                style="width: 100%; padding: 1rem; border-radius: 10px; font-weight: 700; font-size: 1.05rem; background: linear-gradient(135deg, #00d084 0%, #00a86b 100%); border: none; color: white; transition: all 0.3s ease; cursor: pointer;"
                @hover="$event.target.style.boxShadow = '0 8px 20px rgba(0, 208, 132, 0.3)'"
              >
                <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {{ loading ? "Signing in..." : "Sign In" }}
              </button>
            </form>

            <!-- DIVIDER -->
            <div style="display: flex; align-items: center; margin: 2rem 0; gap: 1rem;">
              <div style="flex: 1; height: 1px; background: #e8e8e8;"></div>
              <span style="color: #999; font-size: 0.9rem;">or</span>
              <div style="flex: 1; height: 1px; background: #e8e8e8;"></div>
            </div>

            <!-- SOCIAL BUTTONS -->
            <div style="display: grid; grid-template-columns: 1fr ; gap: 1rem; margin-bottom: 1.5rem;">
            <button
  type="button"
  class="btn btn-light"
  style="
    border-radius:10px;
    border:2px solid #e8e8e8;
    padding:0.75rem;
    font-weight:600;
  "
   @click="loginWithGoogle"
>
  <span style="font-size:1.3rem;">G</span>
  Google
</button>
            </div>

            <!-- REGISTER LINK -->
            <p style="text-align: center; color: #666; font-size: 0.95rem;">
              Don't have an account?
              <router-link to="/register" style="color: #00d084; text-decoration: none; font-weight: 700;">Create one now</router-link>
            </p>
          </div>
        </div>

        <!-- FOOTER TEXT -->
        <p style="text-align: center; color: white; margin-top: 2rem; font-size: 0.85rem; opacity: 0.8;">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  transition: all 0.3s ease;
}

button[disabled] {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
