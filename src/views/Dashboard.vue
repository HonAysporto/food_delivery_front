<script setup>
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

const logout = () => {
  auth.logout();
  router.push("/login");
};
</script>

<template>
  <div style="background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%); min-height: 100vh;">
    <!-- HEADER PROFILE SECTION -->
    <div style="background: linear-gradient(135deg, #00d084 0%, #00a86b 100%); color: white; padding: 3rem 0;">
      <div class="container">
        <div style="display: flex; align-items: center; gap: 2rem;">
          <!-- AVATAR -->
          <div style="width: 100px; height: 100px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 3rem; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);">
            👤
          </div>

          <!-- PROFILE INFO -->
          <div>
            <h1 style="margin: 0 0 0.5rem 0; font-size: 2rem; font-weight: 700;">
              {{ auth.user?.firstname }} {{ auth.user?.lastname }}
            </h1>
            <p style="margin: 0; font-size: 1rem; opacity: 0.9;">{{ auth.user?.email }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- MAIN CONTENT -->
    <div class="container" style="padding: 2rem 1rem;">
      <!-- QUICK STATS -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 3rem;">
        <div class="card" style="padding: 2rem; border-radius: 16px; text-align: center;">
          <div style="font-size: 2.5rem; margin-bottom: 1rem;">🛒</div>
          <h3 style="margin: 0 0 0.5rem 0; font-size: 2rem; font-weight: 700; color: #00d084;">12</h3>
          <p style="margin: 0; color: #999; font-size: 0.9rem;">Total Orders</p>
        </div>

        <div class="card" style="padding: 2rem; border-radius: 16px; text-align: center;">
          <div style="font-size: 2.5rem; margin-bottom: 1rem;">⭐</div>
          <h3 style="margin: 0 0 0.5rem 0; font-size: 2rem; font-weight: 700; color: #00d084;">4.8</h3>
          <p style="margin: 0; color: #999; font-size: 0.9rem;">Avg Rating</p>
        </div>

        <div class="card" style="padding: 2rem; border-radius: 16px; text-align: center;">
          <div style="font-size: 2.5rem; margin-bottom: 1rem;">💳</div>
          <h3 style="margin: 0 0 0.5rem 0; font-size: 2rem; font-weight: 700; color: #00d084;">₦5,200</h3>
          <p style="margin: 0; color: #999; font-size: 0.9rem;">Total Spent</p>
        </div>
      </div>

      <!-- ACCOUNT SECTIONS -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
        <!-- LEFT COLUMN -->
        <div>
          <h2 style="margin-bottom: 1.5rem; font-size: 1.5rem; font-weight: 700;">⚙️ Account Settings</h2>

          <!-- PROFILE SECTION -->
          <div class="card" style="padding: 1.5rem; border-radius: 16px; margin-bottom: 1.5rem;">
            <h3 style="margin: 0 0 1rem 0; font-size: 1.1rem; font-weight: 700;">👤 Profile Information</h3>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              <div>
                <label style="display: block; font-size: 0.85rem; color: #999; margin-bottom: 0.5rem; font-weight: 600;">First Name</label>
                <input type="text" :value="auth.user?.firstname" class="form-control" readonly style="border-radius: 8px; background: #f9f9f9;"/>
              </div>
              <div>
                <label style="display: block; font-size: 0.85rem; color: #999; margin-bottom: 0.5rem; font-weight: 600;">Last Name</label>
                <input type="text" :value="auth.user?.lastname" class="form-control" readonly style="border-radius: 8px; background: #f9f9f9;"/>
              </div>
              <div>
                <label style="display: block; font-size: 0.85rem; color: #999; margin-bottom: 0.5rem; font-weight: 600;">Email</label>
                <input type="email" :value="auth.user?.email" class="form-control" readonly style="border-radius: 8px; background: #f9f9f9;"/>
              </div>
            </div>
            <button class="btn btn-light" style="width: 100%; margin-top: 1rem; border-radius: 8px; font-weight: 600;">✏️ Edit Profile</button>
          </div>

          <!-- SECURITY SECTION -->
          <div class="card" style="padding: 1.5rem; border-radius: 16px;">
            <h3 style="margin: 0 0 1rem 0; font-size: 1.1rem; font-weight: 700;">🔐 Security</h3>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <button class="btn btn-light" style="width: 100%; border-radius: 8px; font-weight: 600; padding: 0.75rem;">🔑 Change Password</button>
              <button class="btn btn-light" style="width: 100%; border-radius: 8px; font-weight: 600; padding: 0.75rem;">📱 Two-Factor Authentication</button>
              <button class="btn btn-light" style="width: 100%; border-radius: 8px; font-weight: 600; padding: 0.75rem;">🔒 Active Sessions</button>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN -->
        <div>
          <h2 style="margin-bottom: 1.5rem; font-size: 1.5rem; font-weight: 700;">📋 Preferences</h2>

          <!-- ADDRESS SECTION -->
          <div class="card" style="padding: 1.5rem; border-radius: 16px; margin-bottom: 1.5rem;">
            <h3 style="margin: 0 0 1rem 0; font-size: 1.1rem; font-weight: 700;">📍 Addresses</h3>
            <div style="padding: 1rem; background: #f9f9f9; border-radius: 8px; margin-bottom: 1rem;">
              <p style="margin: 0 0 0.5rem 0; font-weight: 600;">Home (Default)</p>
              <p style="margin: 0; font-size: 0.9rem; color: #666;">123 Main Street, Apt 4B</p>
            </div>
            <button class="btn btn-light" style="width: 100%; border-radius: 8px; font-weight: 600;">➕ Add Address</button>
          </div>

          <!-- PREFERENCES SECTION -->
          <div class="card" style="padding: 1.5rem; border-radius: 16px;">
            <h3 style="margin: 0 0 1rem 0; font-size: 1.1rem; font-weight: 700;">🎯 Preferences</h3>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer;">
                <input type="checkbox" checked style="width: 20px; height: 20px; cursor: pointer;"/>
                <span>Email notifications</span>
              </label>
              <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer;">
                <input type="checkbox" checked style="width: 20px; height: 20px; cursor: pointer;"/>
                <span>SMS alerts</span>
              </label>
              <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer;">
                <input type="checkbox" style="width: 20px; height: 20px; cursor: pointer;"/>
                <span>Promotional offers</span>
              </label>
              <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer;">
                <input type="checkbox" checked style="width: 20px; height: 20px; cursor: pointer;"/>
                <span>Dark mode</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- HELP & LOGOUT SECTION -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 2rem;">
        <div class="card" style="padding: 1.5rem; border-radius: 16px;">
          <h3 style="margin: 0 0 1rem 0; font-size: 1.1rem; font-weight: 700;">❓ Help & Support</h3>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <button class="btn btn-light" style="width: 100%; border-radius: 8px; font-weight: 600; padding: 0.75rem;">📖 FAQ</button>
            <button class="btn btn-light" style="width: 100%; border-radius: 8px; font-weight: 600; padding: 0.75rem;">💬 Contact Support</button>
            <button class="btn btn-light" style="width: 100%; border-radius: 8px; font-weight: 600; padding: 0.75rem;">📋 Terms & Privacy</button>
          </div>
        </div>

        <div class="card" style="padding: 1.5rem; border-radius: 16px; background: linear-gradient(135deg, rgba(255, 71, 87, 0.1) 0%, rgba(255, 109, 109, 0.1) 100%);">
          <h3 style="margin: 0 0 1rem 0; font-size: 1.1rem; font-weight: 700;">🚪 Session</h3>
          <p style="margin: 0 0 1rem 0; color: #666; font-size: 0.9rem;">Ready to leave? Sign out of your account securely.</p>
          <button
            @click="logout"
            class="btn btn-light"
            style="width: 100%; border-radius: 8px; font-weight: 700; padding: 0.75rem; color: #ff4757; border: 2px solid #ff4757; background: white;"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      <!-- FOOTER -->
      <div style="text-align: center; margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #e8e8e8;">
        <p style="color: #999; font-size: 0.85rem;">
          Version 1.0 • Last updated: {{ new Date().toLocaleDateString() }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 8px 20px rgba(0, 208, 132, 0.1);
}

button:hover {
  transform: translateY(-2px);
}
</style>