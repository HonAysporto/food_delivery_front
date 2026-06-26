<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../../services/api";

const router = useRouter();

const loading = ref(false);
const error = ref("");
const success = ref("");

const form = ref({
  name: "",
  address: "",
  description: "",
  phone: "",
  image: null,
});

// 🔥 Cloudinary config (REPLACE THESE)
const CLOUDINARY_URL =
  "https://api.cloudinary.com/v1_1/dkcod39ah/image/upload";
const UPLOAD_PRESET = "Food_delivery";

// handle file selection
const handleImageChange = (e) => {
  form.value.image = e.target.files[0];
};

// upload image to Cloudinary
const uploadToCloudinary = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(CLOUDINARY_URL, {
    method: "POST",
    body: data,
  });

  const result = await res.json();

  if (!result.secure_url) {
    throw new Error("Image upload failed");
  }

  return result.secure_url; // 👈 THIS is what we send to backend
};

const createRestaurant = async () => {
  error.value = "";
  success.value = "";

  if (
    !form.value.name ||
    !form.value.address ||
    !form.value.description ||
    !form.value.phone
  ) {
    error.value = "All fields are required";
    return;
  }

  loading.value = true;

  try {
    let imageUrl = null;

    // 1. upload image first (if selected)
    if (form.value.image) {
      imageUrl = await uploadToCloudinary(form.value.image);
    }

    // 2. send ONLY data + image URL to Laravel
    await api.post("/owner/restaurants", {
      name: form.value.name,
      address: form.value.address,
      description: form.value.description,
      phone: form.value.phone,
      image: imageUrl, // 👈 STRING ONLY
    });

    success.value = "Restaurant created successfully";

    setTimeout(() => {
      router.push("/owner/dashboard");
    }, 1500);
  } catch (err) {
    console.log(err);

    error.value =
      err.response?.data?.message || "Failed to create restaurant";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="card shadow border-0">
          <div class="card-body p-4">
            <h2 class="fw-bold mb-2">Create Restaurant</h2>

            <p class="text-muted mb-4">
              Set up your restaurant and start selling food.
            </p>

            <!-- Error -->
            <div v-if="error" class="alert alert-danger">
              {{ error }}
            </div>

            <!-- Success -->
            <div v-if="success" class="alert alert-success">
              {{ success }}
            </div>

            <form @submit.prevent="createRestaurant">
              <!-- Name -->
              <div class="mb-3">
                <label class="form-label">Restaurant Name</label>
                <input
                  v-model="form.name"
                  type="text"
                  class="form-control"
                  placeholder="e.g Domino's Pizza"
                />
              </div>

              <!-- Address -->
              <div class="mb-3">
                <label class="form-label">Address</label>
                <input
                  v-model="form.address"
                  type="text"
                  class="form-control"
                  placeholder="Restaurant address"
                />
              </div>

              <!-- Phone -->
              <div class="mb-3">
                <label class="form-label">Phone</label>
                <input
                  v-model="form.phone"
                  type="text"
                  class="form-control"
                  placeholder="Restaurant phone number"
                />
              </div>

              <!-- Description -->
              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea
                  v-model="form.description"
                  rows="4"
                  class="form-control"
                  placeholder="Tell customers about your restaurant"
                ></textarea>
              </div>

              <!-- Image -->
              <div class="mb-3">
                <label class="form-label">Restaurant Image</label>
                <input
                  type="file"
                  class="form-control"
                  @change="handleImageChange"
                />
              </div>

              <!-- Submit -->
              <button class="btn btn-success w-100" :disabled="loading">
                <span
                  v-if="loading"
                  class="spinner-border spinner-border-sm me-2"
                ></span>

                {{
                  loading
                    ? "Creating Restaurant..."
                    : "Create Restaurant"
                }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border-radius: 16px;
}

.form-control {
  border-radius: 10px;
}

.btn-success {
  border-radius: 10px;
  padding: 12px;
  font-weight: 600;
}
</style>