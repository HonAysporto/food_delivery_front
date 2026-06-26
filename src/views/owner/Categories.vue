<script setup>
import { ref, onMounted } from "vue";
import api from "../../services/api";

const categories = ref([]);
const categoryName = ref("");
const loading = ref(false);
const saving = ref(false);

const error = ref("");
const success = ref("");

const editingId = ref(null);
const editName = ref("");

const loadCategories = async () => {
  loading.value = true;

  try {
    const res = await api.get("/owner/categories");
    categories.value = res.data;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const createCategory = async () => {
  error.value = "";
  success.value = "";

  if (!categoryName.value.trim()) {
    error.value = "Category name is required";
    return;
  }

  saving.value = true;

  try {
    const res = await api.post("/owner/categories", {
      name: categoryName.value,
    });

    categories.value.unshift(res.data.category);

    categoryName.value = "";

    success.value = "Category created successfully";
  } catch (err) {
    console.log(err);

    error.value =
      err.response?.data?.message ||
      "Failed to create category";
  } finally {
    saving.value = false;
  }
};

const startEdit = (category) => {
  editingId.value = category.id;
  editName.value = category.name;
};

const cancelEdit = () => {
  editingId.value = null;
  editName.value = "";
};

const updateCategory = async (id) => {
  try {
    const res = await api.put(
      `/owner/categories/${id}`,
      {
        name: editName.value,
      }
    );

    const index = categories.value.findIndex(
      (c) => c.id === id
    );

    if (index !== -1) {
      categories.value[index] =
        res.data.category;
    }

    success.value = "Category updated";

    cancelEdit();
  } catch (err) {
    console.log(err);
  }
};

const deleteCategory = async (id) => {
  if (
    !confirm(
      "Are you sure you want to delete this category?"
    )
  ) {
    return;
  }

  try {
    await api.delete(
      `/owner/categories/${id}`
    );

    categories.value =
      categories.value.filter(
        (c) => c.id !== id
      );

    success.value = "Category deleted";
  } catch (err) {
    console.log(err);
  }
};

onMounted(loadCategories);
</script>

<template>
  <div class="container py-4">

    <h2 class="fw-bold mb-4">
      🍽️ Categories
    </h2>

    <!-- Alerts -->

    <div
      v-if="error"
      class="alert alert-danger"
    >
      {{ error }}
    </div>

    <div
      v-if="success"
      class="alert alert-success"
    >
      {{ success }}
    </div>

    <!-- Add Category -->

    <div class="card shadow-sm border-0 mb-4">
      <div class="card-body">

        <h5 class="mb-3">
          Add Category
        </h5>

        <div class="input-group">

          <input
            v-model="categoryName"
            class="form-control"
            placeholder="e.g Pizza"
          />

          <button
            class="btn btn-success"
            @click="createCategory"
            :disabled="saving"
          >
            {{
              saving
                ? "Adding..."
                : "Add"
            }}
          </button>

        </div>

      </div>
    </div>

    <!-- Categories List -->

    <div class="card shadow-sm border-0">

      <div class="card-body">

        <h5 class="mb-3">
          My Categories
        </h5>

        <div
          v-if="loading"
          class="text-center py-3"
        >
          Loading...
        </div>

        <div
          v-else-if="categories.length === 0"
          class="text-muted text-center py-4"
        >
          No categories created yet
        </div>

        <div
          v-for="category in categories"
          :key="category.id"
          class="border rounded p-3 mb-3"
        >
          <!-- EDIT MODE -->

          <div
            v-if="editingId === category.id"
            class="d-flex gap-2"
          >
            <input
              v-model="editName"
              class="form-control"
            />

            <button
              class="btn btn-success"
              @click="
                updateCategory(category.id)
              "
            >
              Save
            </button>

            <button
              class="btn btn-secondary"
              @click="cancelEdit"
            >
              Cancel
            </button>
          </div>

          <!-- VIEW MODE -->

          <div
            v-else
            class="d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>
                {{ category.name }}
              </strong>
            </div>

            <div>

              <button
                class="btn btn-warning btn-sm me-2"
                @click="
                  startEdit(category)
                "
              >
                Edit
              </button>

              <button
                class="btn btn-danger btn-sm"
                @click="
                  deleteCategory(category.id)
                "
              >
                Delete
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

.btn {
  border-radius: 10px;
}

.form-control {
  border-radius: 10px;
}
</style>