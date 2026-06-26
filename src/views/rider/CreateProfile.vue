<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../../services/api";

const router = useRouter();

const loading = ref(false);
const error = ref("");
const success = ref("");

const form = ref({
  phone: "",
  vehicle_type: "Motorcycle",
  license_number: "",
});

const createProfile = async () => {
  error.value = "";
  success.value = "";

  if (!form.value.phone) {
    error.value = "Phone number is required.";
    return;
  }

  loading.value = true;

  try {
    await api.post("/rider/profile", form.value);

    success.value = "Rider profile created successfully!";

    setTimeout(() => {
      router.push("/rider/dashboard");
    }, 1200);

  } catch (err) {
    console.log(err);

    error.value =
      err.response?.data?.message ||
      "Failed to create rider profile.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="container py-5">

    <div class="row justify-content-center">

      <div class="col-lg-6">

        <div class="card shadow border-0">

          <div class="card-body p-4">

            <h2 class="fw-bold mb-2">
              🚴 Rider Profile
            </h2>

            <p class="text-muted mb-4">
              Complete your rider profile to start receiving delivery requests.
            </p>

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

            <form @submit.prevent="createProfile">

              <!-- Phone -->

              <div class="mb-3">

                <label class="form-label fw-semibold">
                  Phone Number
                </label>

                <input
                  v-model="form.phone"
                  type="text"
                  class="form-control"
                  placeholder="08012345678"
                >

              </div>

              <!-- Vehicle -->

              <div class="mb-3">

                <label class="form-label fw-semibold">
                  Vehicle Type
                </label>

                <select
                  v-model="form.vehicle_type"
                  class="form-select"
                >

                  <option>
                    Motorcycle
                  </option>

                  <option>
                    Bicycle
                  </option>

                  <option>
                    Car
                  </option>

                  <option>
                    Scooter
                  </option>

                </select>

              </div>

              <!-- License -->

              <div class="mb-4">

                <label class="form-label fw-semibold">
                  License Number
                </label>

                <input
                  v-model="form.license_number"
                  type="text"
                  class="form-control"
                  placeholder="Optional"
                >

              </div>

              <button
                class="btn btn-success w-100"
                :disabled="loading"
              >

                <span
                  v-if="loading"
                  class="spinner-border spinner-border-sm me-2"
                ></span>

                {{
                  loading
                    ? "Creating Profile..."
                    : "Create Rider Profile"
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

.card{
    border-radius:18px;
}

.form-control,
.form-select{
    border-radius:10px;
    padding:12px;
}

.btn{
    padding:12px;
    border-radius:10px;
    font-weight:600;
}

@media(max-width:768px){

.card{
    margin:10px;
}

}

</style>