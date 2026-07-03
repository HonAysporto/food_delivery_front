<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const form = ref({
  firstname: "",
  lastname: "",
  email: "",
  role: "customer",
  password: "",
  confirmPassword: "",
});

const loading = ref(false);
const error = ref("");
const success = ref("");

const handleRegister = async () => {
  // Validation
  error.value = "";
  success.value = "";

  if (!form.value.firstname || !form.value.lastname || !form.value.email || !form.value.role || !form.value.password) {
    error.value = "All fields are required";
    return;
  }

  if (form.value.password !== form.value.confirmPassword) {
    error.value = "Passwords do not match";
    return;
  }

  if (form.value.password.length < 6) {
    error.value = "Password must be at least 6 characters";
    return;
  }

  loading.value = true;
  try {
    await authStore.register({
      firstname: form.value.firstname,
      lastname: form.value.lastname,
      email: form.value.email,
      password: form.value.password,
      role: form.value.role,
    });
    success.value = "Registration successful! Redirecting...";
    setTimeout(() => {
      // Redirect based on user role
      const role = authStore.user?.role;
      if (role === "owner") {
        router.push("/owner/dashboard");
      } else if (role === "admin") {
        router.push("/admin/dashboard");
      } else if (role === "rider") {
        router.push("/rider/create-profile");
      } else {
        // Default for customer
        router.push("/");
      }
    }, 2000);
  } catch (err) {
    error.value = err.response?.data?.message || "Registration failed";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div style="background: linear-gradient(135deg, #00d084 0%, #00a86b 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center;">
    <div class="container">
      <div style="max-width: 500px; margin: 0 auto;">
        <!-- HEADER SECTION -->
        <div style="text-align: center; margin-bottom: 2rem; color: white;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🚀</div>
          <h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">TAZVO</h1>
          <p style="font-size: 1rem; opacity: 0.9;">Join thousands of hungry customers</p>
        </div>

        <!-- REGISTER CARD -->
        <div class="card" style="border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); border: none;">
          <div style="padding: 2.5rem;">
            <h2 style="text-align: center; margin-bottom: 0.5rem; font-size: 1.8rem; font-weight: 700;">Create Account</h2>
            <p style="text-align: center; color: #999; margin-bottom: 2rem; font-size: 0.95rem;">Sign up to start ordering</p>

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

            <!-- SUCCESS MESSAGE -->
            <div v-if="success" style="padding: 1rem; background: rgba(40, 167, 69, 0.1); border-left: 4px solid #28a745; border-radius: 8px; margin-bottom: 1.5rem; color: #155724;">
              <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
                <span style="font-size: 1.2rem; margin-top: -2px;">✓</span>
                <div>
                  <div style="font-weight: 600; margin-bottom: 0.25rem;">Success</div>
                  <div style="font-size: 0.9rem;">{{ success }}</div>
                </div>
              </div>
            </div>

            <!-- REGISTRATION FORM -->
            <form @submit.prevent="handleRegister">
              <!-- NAME FIELDS -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                <div>
                  <label for="firstName" style="display: block; font-weight: 600; margin-bottom: 0.75rem; color: #1a1a1a; font-size: 0.95rem;">👤 First Name</label>
                  <input
                    id="firstName"
                    v-model="form.firstname"
                    type="text"
                    class="form-control"
                    placeholder="John"
                    required
                    style="border-radius: 10px; border: 2px solid #e8e8e8; padding: 0.9rem 1.1rem; font-size: 1rem; transition: all 0.3s ease;"
                    @focus="$event.target.style.borderColor = '#00d084'; $event.target.style.boxShadow = '0 0 0 3px rgba(0, 208, 132, 0.1)'"
                    @blur="$event.target.style.borderColor = '#e8e8e8'; $event.target.style.boxShadow = 'none'"
                  />
                </div>
                <div>
                  <label for="lastName" style="display: block; font-weight: 600; margin-bottom: 0.75rem; color: #1a1a1a; font-size: 0.95rem;">👤 Last Name</label>
                  <input
                    id="lastName"
                    v-model="form.lastname"
                    type="text"
                    class="form-control"
                    placeholder="Doe"
                    required
                    style="border-radius: 10px; border: 2px solid #e8e8e8; padding: 0.9rem 1.1rem; font-size: 1rem; transition: all 0.3s ease;"
                    @focus="$event.target.style.borderColor = '#00d084'; $event.target.style.boxShadow = '0 0 0 3px rgba(0, 208, 132, 0.1)'"
                    @blur="$event.target.style.borderColor = '#e8e8e8'; $event.target.style.boxShadow = 'none'"
                  />
                </div>
              </div>

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

              <!-- ACCOUNT TYPE FIELD -->
              <div style="margin-bottom: 1.5rem;">
                <label style="display: block; font-weight: 600; margin-bottom: 0.75rem; color: #1a1a1a; font-size: 0.95rem;">
                  👥 Account Type
                </label>
                <div style="display: flex; gap: 2rem;">
                  <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.95rem;">
                    <input
                      v-model="form.role"
                      type="radio"
                      value="customer"
                      style="width: 18px; height: 18px; cursor: pointer;"
                    />
                    Customer
                  </label>
                  <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.95rem;">
                    <input
                      v-model="form.role"
                      type="radio"
                      value="owner"
                      style="width: 18px; height: 18px; cursor: pointer;"
                    />
                    Restaurant Owner
                  </label>
                      <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.95rem;">
                    <input
                      v-model="form.role"
                      type="radio"
                      value="rider"
                      style="width: 18px; height: 18px; cursor: pointer;"
                    />
                    Rider
                  </label>
                </div>
              </div>

              <!-- PASSWORD FIELD -->
              <div style="margin-bottom: 1.5rem;">
                <label for="password" style="display: block; font-weight: 600; margin-bottom: 0.75rem; color: #1a1a1a; font-size: 0.95rem;">
                  🔐 Password
                </label>
                <input
                  id="password"
                  v-model="form.password"
                  type="password"
                  class="form-control"
                  placeholder="••••••••"
                  required
                  style="border-radius: 10px; border: 2px solid #e8e8e8; padding: 0.9rem 1.1rem; font-size: 1rem; transition: all 0.3s ease;"
                  @focus="$event.target.style.borderColor = '#00d084'; $event.target.style.boxShadow = '0 0 0 3px rgba(0, 208, 132, 0.1)'"
                  @blur="$event.target.style.borderColor = '#e8e8e8'; $event.target.style.boxShadow = 'none'"
                />
                <small style="display: block; margin-top: 0.5rem; color: #999;">Minimum 6 characters</small>
              </div>

              <!-- CONFIRM PASSWORD FIELD -->
              <div style="margin-bottom: 1.5rem;">
                <label for="confirmPassword" style="display: block; font-weight: 600; margin-bottom: 0.75rem; color: #1a1a1a; font-size: 0.95rem;">
                  🔐 Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  type="password"
                  class="form-control"
                  placeholder="••••••••"
                  required
                  style="border-radius: 10px; border: 2px solid #e8e8e8; padding: 0.9rem 1.1rem; font-size: 1rem; transition: all 0.3s ease;"
                  @focus="$event.target.style.borderColor = '#00d084'; $event.target.style.boxShadow = '0 0 0 3px rgba(0, 208, 132, 0.1)'"
                  @blur="$event.target.style.borderColor = '#e8e8e8'; $event.target.style.boxShadow = 'none'"
                />
              </div>

              <!-- TERMS & CONDITIONS -->
              <label style="display: flex; align-items: flex-start; gap: 0.75rem; margin-bottom: 1.5rem; font-size: 0.9rem; color: #666; cursor: pointer;">
                <input type="checkbox" required style="margin-top: 0.25rem; width: 18px; height: 18px; cursor: pointer;"/>
                <span>I agree to the <strong>Terms of Service</strong> and <strong>Privacy Policy</strong></span>
              </label>

              <!-- REGISTER BUTTON -->
              <button
                type="submit"
                :disabled="loading"
                class="btn btn-primary"
                style="width: 100%; padding: 1rem; border-radius: 10px; font-weight: 700; font-size: 1.05rem; background: linear-gradient(135deg, #00d084 0%, #00a86b 100%); border: none; color: white; transition: all 0.3s ease; cursor: pointer;"
              >
                <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {{ loading ? "Creating Account..." : "Create Account" }}
              </button>
            </form>

            <!-- DIVIDER -->
            <div style="display: flex; align-items: center; margin: 2rem 0; gap: 1rem;">
              <div style="flex: 1; height: 1px; background: #e8e8e8;"></div>
              <span style="color: #999; font-size: 0.9rem;">or</span>
              <div style="flex: 1; height: 1px; background: #e8e8e8;"></div>
            </div>

            <!-- LOGIN LINK -->
            <p style="text-align: center; color: #666; font-size: 0.95rem;">
              Already have an account?
              <router-link to="/login" style="color: #00d084; text-decoration: none; font-weight: 700;">Sign in here</router-link>
            </p>
          </div>
        </div>

        <!-- FOOTER TEXT -->
        <p style="text-align: center; color: white; margin-top: 2rem; font-size: 0.85rem; opacity: 0.8;">
          Your account is safe and secure with us
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border: none;
  border-radius: 0.5rem;
}

.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

button[disabled] {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
