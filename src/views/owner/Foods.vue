<template>
  <div class="food-page">

    <!-- ==========================
         TOASTS
    =========================== -->
    <div class="toast-container position-fixed top-0 end-0 p-3">

      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast show text-white border-0 mb-2"
        :class="toast.type === 'success' ? 'bg-success' : 'bg-danger'"
      >
        <div class="d-flex align-items-center">

          <div class="toast-body">
            {{ toast.message }}
          </div>

          <button
            class="btn-close btn-close-white me-2"
            @click="removeToast(toast.id)"
          ></button>

        </div>

      </div>

    </div>

    <!-- ==========================
         PAGE HEADER
    =========================== -->

    <div class="page-header">

      <div>

        <h2>
          Food Management
        </h2>

        <p>
          Manage all foods available in your restaurant.
        </p>

      </div>

      <button
        class="btn btn-primary"
        @click="showForm = !showForm"
      >
        <i class="bi bi-plus-lg"></i>

        {{ showForm ? "Close Form" : "Add Food" }}

      </button>

    </div>

    <!-- ==========================
         FORM
    =========================== -->

    <transition name="fade">

      <div
        v-if="showForm"
        class="card custom-card mb-4"
      >

        <div class="card-body">

          <div class="d-flex justify-content-between align-items-center mb-4">

            <h4>
              {{
                editingFood
                  ? "Edit Food"
                  : "Add New Food"
              }}
            </h4>

            <button
              v-if="editingFood"
              class="btn btn-outline-secondary"
              @click="resetForm"
            >
              Cancel
            </button>

          </div>

          <form
            @submit.prevent="
              editingFood
                ? updateFood()
                : addFood()
            "
          >

            <div class="row">

              <div class="col-md-6 mb-3">

                <label class="form-label">
                  Food Name
                </label>

                <input
                  v-model="form.name"
                  class="form-control"
                  placeholder="Burger Deluxe"
                >

              </div>

              <div class="col-md-6 mb-3">

                <label class="form-label">
                  Price
                </label>

                <input
                  v-model="form.price"
                  type="number"
                  class="form-control"
                  placeholder="2500"
                >

              </div>

              <div class="col-md-6 mb-3">

                <label class="form-label">
                  Category
                </label>

                <select
                  v-model="form.category_id"
                  class="form-select"
                >

                  <option value="">
                    Select Category
                  </option>

                  <option
                    v-for="category in categories"
                    :key="category.id"
                    :value="category.id"
                  >
                    {{ category.name }}
                  </option>

                </select>

              </div>

              <div class="col-md-6 mb-3">

                <label class="form-label">
                  Food Image
                </label>

                <input
                  type="file"
                  class="form-control"
                  @change="handleImageChange"
                >

              </div>

              <div class="col-12 mb-3">

                <label class="form-label">
                  Description
                </label>

                <textarea
                  v-model="form.description"
                  rows="4"
                  class="form-control"
                  placeholder="Write something about this food..."
                ></textarea>

              </div>

            </div>

            <button
              class="btn btn-success"
              :disabled="saving"
            >

              {{
                saving
                  ? "Saving..."
                  : editingFood
                    ? "Update Food"
                    : "Create Food"
              }}

            </button>

          </form>

        </div>

      </div>

    </transition>

    <!-- ==========================
         SEARCH
    =========================== -->

    <div class="card custom-card mb-4">

      <div class="card-body">

        <div class="row">

          <div class="col-md-8">

            <input
              v-model="search"
              class="form-control"
              placeholder="Search foods..."
            >

          </div>

          <div class="col-md-4 text-md-end mt-3 mt-md-0">

            <span class="food-count">

              {{ filteredFoods.length }}

              Foods

            </span>

          </div>

        </div>

      </div>

    </div>

    <!-- ==========================
         LOADER
    =========================== -->

    <div
      v-if="loading"
      class="row"
    >

      <div
        class="col-lg-4 mb-4"
        v-for="i in 6"
        :key="i"
      >

        <div class="card custom-card">

          <div class="placeholder-image shimmer"></div>

          <div class="card-body">

            <div class="placeholder-line shimmer"></div>

            <div class="placeholder-line short shimmer"></div>

          </div>

        </div>

      </div>

    </div>

    <!-- ==========================
         EMPTY STATE
    =========================== -->

    <div
      v-else-if="filteredFoods.length === 0"
      class="empty-state"
    >

      <i class="bi bi-basket2"></i>

      <h3>No Foods Found</h3>

      <p>
        Start by creating your first menu item.
      </p>

    </div>

    <!-- ==========================
         FOOD GRID
    =========================== -->

    <div
      v-else
      class="row"
    >

      <div
        class="col-xl-4 col-lg-6 mb-4"
        v-for="food in filteredFoods"
        :key="food.id"
      >

        <div class="card food-card">

          <img
            :src="food.image || 'https://via.placeholder.com/500x300'"
            class="food-image"
          >

          <div class="card-body">

            <div class="d-flex justify-content-between align-items-start">

              <div>

                <h5>

                  {{ food.name }}

                </h5>

                <span class="badge bg-primary">

                  {{ food.category?.name }}

                </span>

              </div>

              <h5 class="price">

                ₦{{ food.price }}

              </h5>

            </div>

            <p class="description">

              {{ food.description }}

            </p>

            <div class="d-flex justify-content-between align-items-center">

              <span
                class="badge"
                :class="
                  food.is_available
                    ? 'bg-success'
                    : 'bg-danger'
                "
              >

                {{
                  food.is_available
                    ? 'Available'
                    : 'Out of Stock'
                }}

              </span>

              <div class="actions">

                <button
                  class="btn btn-light"
                  @click="startEdit(food)"
                >
                  Edit
                </button>

                <button
                  class="btn btn-outline-warning"
                  @click="toggleAvailability(food)"
                >

                  {{
                    food.is_available
                      ? "Disable"
                      : "Enable"
                  }}

                </button>

                <button
                  class="btn btn-outline-danger"
                  @click="confirmDelete(food)"
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

    <!-- ==========================
         DELETE MODAL
    =========================== -->

    <div
      v-if="showDeleteModal"
      class="modal-backdrop-custom"
    >

      <div class="delete-modal">

        <h4>
          Delete Food
        </h4>

        <p>

          Are you sure you want to delete

          <strong>
            {{ selectedFood?.name }}
          </strong>

          ?

        </p>

        <div class="d-flex justify-content-end gap-2">

          <button
            class="btn btn-secondary"
            @click="showDeleteModal = false"
          >
            Cancel
          </button>

          <button
            class="btn btn-danger"
            @click="deleteFood(selectedFood.id)"
          >
            Delete
          </button>

        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../../services/api";

/* ==========================================
   STATE
========================================== */

const foods = ref([]);
const categories = ref([]);

const loading = ref(true);
const saving = ref(false);

const search = ref("");

const showForm = ref(false);

const editingFood = ref(null);

const selectedFood = ref(null);
const showDeleteModal = ref(false);

const toasts = ref([]);

const form = ref({
  name: "",
  description: "",
  price: "",
  category_id: "",
  image: null,
});

/* ==========================================
   CLOUDINARY
========================================== */

const CLOUDINARY_URL =
  "https://api.cloudinary.com/v1_1/dkcod39ah/image/upload";

const UPLOAD_PRESET = "Food_delivery";

/* ==========================================
   COMPUTED
========================================== */

const filteredFoods = computed(() => {
  if (!search.value) return foods.value;

  return foods.value.filter((food) =>
    food.name
      .toLowerCase()
      .includes(search.value.toLowerCase())
  );
});

/* ==========================================
   TOAST
========================================== */

const showToast = (
  message,
  type = "success"
) => {
  const id = Date.now();

  toasts.value.push({
    id,
    message,
    type,
  });

  setTimeout(() => {
    removeToast(id);
  }, 3000);
};

const removeToast = (id) => {
  toasts.value = toasts.value.filter(
    (t) => t.id !== id
  );
};

/* ==========================================
   IMAGE
========================================== */

const handleImageChange = (e) => {
  form.value.image = e.target.files[0];
};

const uploadToCloudinary = async (
  file
) => {
  const data = new FormData();

  data.append("file", file);

  data.append(
    "upload_preset",
    UPLOAD_PRESET
  );

  const res = await fetch(
    CLOUDINARY_URL,
    {
      method: "POST",
      body: data,
    }
  );

  const result = await res.json();

  return result.secure_url;
};

/* ==========================================
   LOAD DATA
========================================== */

const loadCategories = async () => {
  try {
    const res = await api.get(
      "/owner/categories"
    );

    categories.value = res.data;
  } catch {
    showToast(
      "Unable to load categories",
      "error"
    );
  }
};

const fetchFoods = async () => {
  loading.value = true;

  try {
    const res = await api.get(
      "/owner/foods"
    );

    foods.value = res.data;
  } catch {
    showToast(
      "Unable to load foods",
      "error"
    );
  } finally {
    loading.value = false;
  }
};

/* ==========================================
   RESET
========================================== */

const resetForm = () => {
  editingFood.value = null;

  form.value = {
    name: "",
    description: "",
    price: "",
    category_id: "",
    image: null,
  };

  showForm.value = false;
};

/* ==========================================
   EDIT
========================================== */

const startEdit = (food) => {
  editingFood.value = food;

  showForm.value = true;

  form.value = {
    name: food.name,
    description: food.description,
    price: food.price,
    category_id: food.category_id,
    image: null,
  };

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

/* ==========================================
   CREATE
========================================== */

const addFood = async () => {
  if (
    !form.value.name ||
    !form.value.description ||
    !form.value.price
  ) {
    return showToast(
      "Please complete all fields",
      "error"
    );
  }

  saving.value = true;

  try {
    let imageUrl = "";

    if (form.value.image) {
      imageUrl =
        await uploadToCloudinary(
          form.value.image
        );
    }

    const res = await api.post(
      "/owner/foods",
      {
        name: form.value.name,
        description:
          form.value.description,
        price: form.value.price,
        category_id:
          form.value.category_id,
        image: imageUrl,
      }
    );

    foods.value.unshift(res.data);

    showToast(
      "Food created successfully"
    );

    resetForm();
  } catch (err) {
    showToast(
      err.response?.data?.message ||
        "Unable to create food",
      "error"
    );
  } finally {
    saving.value = false;
  }
};

/* ==========================================
   UPDATE
========================================== */

const updateFood = async () => {
  if (!editingFood.value) return;

  saving.value = true;

  try {
    let imageUrl =
      editingFood.value.image;

    if (form.value.image) {
      imageUrl =
        await uploadToCloudinary(
          form.value.image
        );
    }

    await api.put(
      `/owner/foods/${editingFood.value.id}`,
      {
        name: form.value.name,
        description:
          form.value.description,
        price: form.value.price,
        category_id:
          form.value.category_id,
        image: imageUrl,
      }
    );

    await fetchFoods();

    showToast(
      "Food updated successfully"
    );

    resetForm();
  } catch {
    showToast(
      "Unable to update food",
      "error"
    );
  } finally {
    saving.value = false;
  }
};

/* ==========================================
   DELETE
========================================== */

const confirmDelete = (food) => {
  selectedFood.value = food;

  showDeleteModal.value = true;
};

const deleteFood = async (id) => {
  try {
    await api.delete(
      `/owner/foods/${id}`
    );

    foods.value =
      foods.value.filter(
        (food) => food.id !== id
      );

    showDeleteModal.value = false;

    showToast(
      "Food deleted successfully"
    );
  } catch {
    showToast(
      "Unable to delete food",
      "error"
    );
  }
};

/* ==========================================
   AVAILABILITY
========================================== */

const toggleAvailability = async (
  food
) => {
  try {
    const res = await api.put(
      `/owner/foods/${food.id}/availability`
    );

    food.is_available =
      res.data.food.is_available;

    showToast(
      food.is_available
        ? "Food is now available"
        : "Food marked out of stock"
    );
  } catch {
    showToast(
      "Unable to update availability",
      "error"
    );
  }
};

/* ==========================================
   INIT
========================================== */

onMounted(() => {
  fetchFoods();

  loadCategories();
});
</script>

<style scoped>
/* =====================================
   PAGE
===================================== */

.food-page{
    animation:fadeIn .35s ease;
}

/* =====================================
   HEADER
===================================== */

.page-header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:28px;
    gap:20px;
}

.page-header h2{
    font-size:30px;
    font-weight:700;
    margin:0;
    color:#1e293b;
}

.page-header p{
    margin:6px 0 0;
    color:#64748b;
}

/* =====================================
   CARDS
===================================== */

.custom-card{
    border:none;
    border-radius:20px;
    box-shadow:0 10px 35px rgba(15,23,42,.06);
    overflow:hidden;
    background:#fff;
}

.food-card{
    border:none;
    border-radius:20px;
    overflow:hidden;
    transition:.3s;
    background:#fff;
    box-shadow:0 10px 35px rgba(15,23,42,.05);
}

.food-card:hover{
    transform:translateY(-6px);
    box-shadow:0 20px 45px rgba(15,23,42,.12);
}

/* =====================================
   FOOD IMAGE
===================================== */

.food-image{
    width:100%;
    height:220px;
    object-fit:cover;
}

/* =====================================
   TYPOGRAPHY
===================================== */

.price{
    color:#10b981;
    font-weight:700;
}

.description{
    color:#64748b;
    min-height:48px;
    margin:18px 0;
    line-height:1.6;
}

.food-count{
    font-weight:600;
    color:#64748b;
    font-size:15px;
}

/* =====================================
   ACTION BUTTONS
===================================== */

.actions{
    display:flex;
    gap:8px;
    flex-wrap:wrap;
}

.actions .btn{
    border-radius:10px;
    font-size:13px;
}

/* =====================================
   FORM
===================================== */

.form-control,
.form-select{
    border-radius:12px;
    border:1px solid #dbe4ee;
    padding:12px;
    transition:.25s;
}

.form-control:focus,
.form-select:focus{
    box-shadow:none;
    border-color:#2563eb;
}

textarea{
    resize:none;
}

.btn{
    border-radius:12px;
}

/* =====================================
   TOAST
===================================== */

.toast{
    border-radius:12px;
    overflow:hidden;
    min-width:280px;
    box-shadow:0 10px 30px rgba(0,0,0,.15);
}

/* =====================================
   EMPTY STATE
===================================== */

.empty-state{
    text-align:center;
    padding:100px 20px;
}

.empty-state i{
    font-size:70px;
    color:#94a3b8;
}

.empty-state h3{
    margin-top:18px;
    font-weight:700;
}

.empty-state p{
    color:#64748b;
}

/* =====================================
   DELETE MODAL
===================================== */

.modal-backdrop-custom{
    position:fixed;
    inset:0;
    background:rgba(15,23,42,.55);
    display:flex;
    justify-content:center;
    align-items:center;
    z-index:3000;
    animation:fadeIn .25s;
}

.delete-modal{
    width:420px;
    max-width:90%;
    background:#fff;
    border-radius:18px;
    padding:30px;
    animation:pop .25s;
}

.delete-modal h4{
    font-weight:700;
    margin-bottom:15px;
}

.delete-modal p{
    color:#64748b;
}

/* =====================================
   SKELETON
===================================== */

.placeholder-image{
    width:100%;
    height:220px;
    border-radius:18px 18px 0 0;
}

.placeholder-line{
    height:18px;
    width:100%;
    border-radius:20px;
    margin-bottom:15px;
}

.placeholder-line.short{
    width:55%;
}

.shimmer{
    background:linear-gradient(
        90deg,
        #edf2f7 25%,
        #f8fafc 50%,
        #edf2f7 75%
    );

    background-size:200% 100%;

    animation:shimmer 1.3s infinite;
}

/* =====================================
   BADGES
===================================== */

.badge{
    border-radius:30px;
    padding:8px 12px;
    font-weight:500;
}

/* =====================================
   SCROLLBAR
===================================== */

::-webkit-scrollbar{
    width:8px;
}

::-webkit-scrollbar-thumb{
    background:#cbd5e1;
    border-radius:20px;
}

/* =====================================
   ANIMATIONS
===================================== */

.fade-enter-active,
.fade-leave-active{
    transition:.25s;
}

.fade-enter-from,
.fade-leave-to{
    opacity:0;
    transform:translateY(-10px);
}

@keyframes shimmer{

    0%{
        background-position:-200% 0;
    }

    100%{
        background-position:200% 0;
    }

}

@keyframes fadeIn{

    from{
        opacity:0;
    }

    to{
        opacity:1;
    }

}

@keyframes pop{

    from{
        opacity:0;
        transform:scale(.92);
    }

    to{
        opacity:1;
        transform:scale(1);
    }

}

/* =====================================
   DARK MODE
===================================== */

:global(html[data-theme="dark"]) .custom-card,
:global(html[data-theme="dark"]) .food-card,
:global(html[data-theme="dark"]) .delete-modal{

    background:#1e293b;
    color:#fff;

}

:global(html[data-theme="dark"]) .page-header h2{
    color:#fff;
}

:global(html[data-theme="dark"]) .page-header p,
:global(html[data-theme="dark"]) .description,
:global(html[data-theme="dark"]) .food-count,
:global(html[data-theme="dark"]) .delete-modal p{
    color:#cbd5e1;
}

:global(html[data-theme="dark"]) .form-control,
:global(html[data-theme="dark"]) .form-select{

    background:#0f172a;
    color:white;
    border-color:#334155;

}

:global(html[data-theme="dark"]) .modal-backdrop-custom{

    background:rgba(0,0,0,.72);

}

/* =====================================
   RESPONSIVE
===================================== */

@media(max-width:992px){

    .page-header{
        flex-direction:column;
        align-items:flex-start;
    }

}

@media(max-width:768px){

    .food-image{
        height:180px;
    }

    .actions{
        margin-top:18px;
    }

    .actions .btn{
        flex:1;
    }

    .page-header h2{
        font-size:24px;
    }

}

@media(max-width:576px){

    .page-header{
        margin-bottom:20px;
    }

    .food-image{
        height:170px;
    }

    .custom-card{
        border-radius:16px;
    }

    .food-card{
        border-radius:16px;
    }

    .delete-modal{
        padding:20px;
    }

}
</style>