<script setup>
import { ref, onMounted } from "vue";
import api from "../../services/api";

/* =========================
   STATE
========================= */
const foods = ref([]);
const loading = ref(false);
const saving = ref(false);

const form = ref({
  name: "",
  description: "",
  price: "",
  category_id: "",
  image: null,
});

const categories = ref([]);

/* EDIT MODE */
const editingFood = ref(null);

/* TOAST SYSTEM */
const toasts = ref([]);

/* =========================
   TOAST FUNCTION
========================= */
const showToast = (message, type = "success") => {
  const id = Date.now();

  toasts.value.push({
    id,
    message,
    type,
  });

  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }, 3000);
};

/* =========================
   API: CATEGORIES
========================= */
const loadCategories = async () => {
  try {
    const res = await api.get("/owner/categories");
    categories.value = res.data;
  } catch (err) {
    showToast("Failed to load categories", "error");
  }
};

/* =========================
   CLOUDINARY
========================= */
const CLOUDINARY_URL =
  "https://api.cloudinary.com/v1_1/dkcod39ah/image/upload";
const UPLOAD_PRESET = "Food_delivery";

const handleImageChange = (e) => {
  form.value.image = e.target.files[0];
};

const uploadToCloudinary = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(CLOUDINARY_URL, {
    method: "POST",
    body: data,
  });

  const result = await res.json();
  return result.secure_url;
};

/* =========================
   FETCH FOODS
========================= */
const fetchFoods = async () => {
  loading.value = true;

  try {
    const res = await api.get("/owner/foods");
    foods.value = res.data;
  } catch (err) {
    showToast("Failed to load foods", "error");
  } finally {
    loading.value = false;
  }
};

/* =========================
   START EDIT
========================= */
const startEdit = (food) => {
  editingFood.value = food;

  form.value = {
    name: food.name,
    description: food.description,
    price: food.price,
    category_id: food.category_id,
    image: null,
  };

  showToast("Editing mode enabled", "success");
};

/* =========================
   RESET FORM
========================= */
const resetForm = () => {
  form.value = {
    name: "",
    description: "",
    price: "",
    category_id: "",
    image: null,
  };

  editingFood.value = null;
};

/* =========================
   ADD FOOD
========================= */
const addFood = async () => {
  if (!form.value.name || !form.value.description || !form.value.price) {
    showToast("All fields are required", "error");
    return;
  }

  saving.value = true;

  try {
    let imageUrl = "";

    if (form.value.image) {
      imageUrl = await uploadToCloudinary(form.value.image);
    }

    const res = await api.post("/owner/foods", {
      name: form.value.name,
      description: form.value.description,
      price: form.value.price,
      category_id: form.value.category_id,
      image: imageUrl,
    });

    foods.value.unshift(res.data);

    resetForm();
    showToast("Food added successfully", "success");
  } catch (err) {
    showToast(
      err.response?.data?.message || "Failed to add food",
      "error"
    );
  } finally {
    saving.value = false;
  }
};

/* =========================
   UPDATE FOOD
========================= */
const updateFood = async () => {
  if (!editingFood.value) return;

  saving.value = true;

  try {
    let imageUrl = editingFood.value.image;

    if (form.value.image) {
      imageUrl = await uploadToCloudinary(form.value.image);
    }

    await api.put(`/owner/foods/${editingFood.value.id}`, {
      name: form.value.name,
      description: form.value.description,
      price: form.value.price,
      category_id: form.value.category_id,
      image: imageUrl,
    });

    await fetchFoods();

    resetForm();
    showToast("Food updated successfully", "success");
  } catch (err) {
    showToast("Failed to update food", "error");
  } finally {
    saving.value = false;
  }
};

/* =========================
   DELETE FOOD
========================= */
const deleteFood = async (id) => {
  if (!confirm("Are you sure you want to delete this food?")) return;

  try {
    await api.delete(`/owner/foods/${id}`);
    foods.value = foods.value.filter((f) => f.id !== id);

    showToast("Food deleted", "success");
  } catch (err) {
    showToast("Failed to delete food", "error");
  }
};

/* =========================
   INIT
========================= */
onMounted(() => {
  fetchFoods();
  loadCategories();
});


const toggleAvailability = async (food) => {

  try {

    const res = await api.put(
      `/owner/foods/${food.id}/availability`
    );

    food.is_available =
      res.data.food.is_available;

  } catch (err) {

    console.log(err);

  }

};
</script>

<template>
  <div class="container py-4">

    <!-- TOASTS -->
    <div class="toast-container position-fixed top-0 end-0 p-3">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast show align-items-center text-white mb-2"
        :class="toast.type === 'success' ? 'bg-success' : 'bg-danger'"
      >
        <div class="d-flex">
          <div class="toast-body">
            {{ toast.message }}
          </div>
        </div>
      </div>
    </div>

    <h2 class="fw-bold mb-4">
      🍔 Food Management
    </h2>

    <!-- FORM -->
    <div class="card shadow-sm border-0 mb-4">
      <div class="card-body">

        <h4 class="mb-3">
          {{ editingFood ? "Edit Food" : "Add Food" }}
        </h4>

        <form @submit.prevent="editingFood ? updateFood() : addFood()">

          <input v-model="form.name" class="form-control mb-2" placeholder="Food name" />

          <textarea v-model="form.description" class="form-control mb-2" rows="3" placeholder="Description"></textarea>

          <select v-model="form.category_id" class="form-select mb-2">
            <option value="">Select Category</option>
            <option
              v-for="c in categories"
              :key="c.id"
              :value="c.id"
            >
              {{ c.name }}
            </option>
          </select>

          <input v-model="form.price" type="number" class="form-control mb-2" placeholder="Price" />

          <input type="file" class="form-control mb-3" @change="handleImageChange" />

          <button class="btn btn-success w-100" :disabled="saving">
            {{ saving ? "Saving..." : editingFood ? "Update Food" : "Add Food" }}
          </button>

          <button
            v-if="editingFood"
            type="button"
            class="btn btn-secondary w-100 mt-2"
            @click="resetForm"
          >
            Cancel Edit
          </button>

        </form>
      </div>
    </div>

    <!-- FOOD LIST -->
    <div class="card shadow-sm border-0">
      <div class="card-body">

        <h4 class="mb-3">My Foods</h4>

        <div v-if="loading" class="text-center py-3">
          Loading...
        </div>

        <div v-else-if="foods.length === 0" class="text-center text-muted py-3">
          No foods yet
        </div>

        <div
          v-for="food in foods"
          :key="food.id"
          class="border rounded p-3 mb-3"
        >
          <div class="row align-items-center">

            <div class="col-md-2">
              <img
                :src="food.image || 'https://via.placeholder.com/100'"
                class="img-fluid rounded"
              />
            </div>

            <div class="mb-2">

  <span
    v-if="food.is_available"
    class="badge bg-success"
  >
    In Stock
  </span>

  <span
    v-else
    class="badge bg-danger"
  >
    Out Of Stock
  </span>

</div>

            <div class="col-md-7">
              <h5>{{ food.name }}</h5>
              <p class="badge bg-primary">
                {{ food.category?.name }}
              </p>
              <p >{{ food.description }}</p>
              <strong>₦{{ food.price }}</strong>
            </div>

            <div class="col-md-3 text-end">
              <button class="btn btn-warning btn-sm me-2" @click="startEdit(food)">
                Edit
              </button>

              <button class="btn btn-danger btn-sm me-2" @click="deleteFood(food.id)">
                Delete
              </button>

              <button 
  class="btn btn-warning btn-sm"
  @click="toggleAvailability(food)"
>

  {{
    food.is_available
      ? 'Mark Out Of Stock'
      : 'Mark In Stock'
  }}

</button>
            </div>

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

.toast {
  border-radius: 10px;
  padding: 10px;
}
</style>