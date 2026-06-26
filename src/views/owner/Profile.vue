<script setup>
import { ref, onMounted } from "vue";
import api from "../../services/api";
import { useAuthStore } from "../../stores/auth";

const authStore = useAuthStore();

const loading = ref(false);
const saving = ref(false);
const changingPassword = ref(false);

const form = ref({
  firstname: "",
  lastname: "",
  email: "",
});

const passwordForm = ref({
  current_password: "",
  new_password: "",
});

onMounted(() => {
  form.value.firstname = authStore.user.firstname;
  form.value.lastname = authStore.user.lastname;
  form.value.email = authStore.user.email;
});

// UPDATE PROFILE
const updateProfile = async () => {
  saving.value = true;

  try {
    const res = await api.put("/owner/profile", form.value);

    authStore.user = res.data.user;

    alert("Profile updated successfully");
  } catch (err) {
    console.log(err);
    alert("Update failed");
  } finally {
    saving.value = false;
  }
};

// CHANGE PASSWORD
const changePassword = async () => {
  changingPassword.value = true;

  try {
    await api.put("/owner/profile/password", passwordForm.value);

    passwordForm.value = {
      current_password: "",
      new_password: "",
    };

    alert("Password updated successfully");
  } catch (err) {
    console.log(err);
    alert(err.response?.data?.message || "Failed to update password");
  } finally {
    changingPassword.value = false;
  }
};
</script>

<template>
  <div class="container py-4">

    <h2 class="mb-4">👤 Owner Profile</h2>

    <!-- PROFILE CARD -->
    <div class="card p-4 mb-4 shadow-sm">
      <h5 class="mb-3">Edit Profile</h5>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label>Firstname</label>
          <input v-model="form.firstname" class="form-control" />
        </div>

        <div class="col-md-6 mb-3">
          <label>Lastname</label>
          <input v-model="form.lastname" class="form-control" />
        </div>

        

        <div class="col-12">
          <button
            class="btn btn-primary"
            @click="updateProfile"
            :disabled="saving"
          >
            {{ saving ? "Saving..." : "Save Changes" }}
          </button>
        </div>
      </div>
    </div>

    <!-- PASSWORD CARD -->
    <div class="card p-4 mb-4 shadow-sm">
      <h5 class="mb-3">Change Password</h5>

      <input
        v-model="passwordForm.current_password"
        type="password"
        class="form-control mb-2"
        placeholder="Current Password"
      />

      <input
        v-model="passwordForm.new_password"
        type="password"
        class="form-control mb-3"
        placeholder="New Password"
      />

      <button
        class="btn btn-warning"
        @click="changePassword"
        :disabled="changingPassword"
      >
        {{ changingPassword ? "Updating..." : "Change Password" }}
      </button>
    </div>

    <!-- INFO CARD -->
    <div class="card p-4 shadow-sm">
      <h5 class="mb-3">Account Overview</h5>

      <p><strong>Name:</strong> {{ authStore.user?.firstname }} {{ authStore.user?.lastname }}</p>
      <p><strong>Email:</strong> {{ authStore.user?.email }}</p>
      <p><strong>Role:</strong> {{ authStore.user?.role }}</p>

      <p>
        <strong>Restaurant:</strong>
        <span v-if="authStore.user?.restaurant_exists" class="text-success">
          Exists ✅
        </span>
        <span v-else class="text-danger">
          Not Created ❌
        </span>
      </p>
    </div>

  </div>
</template>