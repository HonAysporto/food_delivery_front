<script setup>
import { ref } from "vue";
import axios from "axios";

const email = ref("");
const loading = ref(false);
const success = ref("");
const error = ref("");

const sendResetLink = async () => {
    loading.value = true;
    success.value = "";
    error.value = "";

    try {
        const response = await axios.post(
            "http://127.0.0.1:8000/api/forgot-password",
            {
                email: email.value,
            }
        );

        success.value = response.data.message;
    } catch (err) {
        error.value =
            err.response?.data?.message ||
            "Unable to send reset link.";
    }

    loading.value = false;
};
</script>

<template>
    <div class="forgot-container">

        <div class="forgot-card">

            <h2>Forgot Password</h2>

            <p>
                Enter your email address and we'll send you
                a password reset link.
            </p>

            <input
                type="email"
                v-model="email"
                placeholder="Enter your email"
            />

            <button
                @click="sendResetLink"
                :disabled="loading"
            >
                {{ loading ? "Sending..." : "Send Reset Link" }}
            </button>

            <p
                v-if="success"
                class="success"
            >
                {{ success }}
            </p>

            <p
                v-if="error"
                class="error"
            >
                {{ error }}
            </p>

        </div>

    </div>
</template>

<style scoped>

.forgot-container{
    min-height:100vh;
    display:flex;
    justify-content:center;
    align-items:center;
    background:#f8f8f8;
}

.forgot-card{
    width:400px;
    background:white;
    padding:30px;
    border-radius:12px;
    box-shadow:0 5px 20px rgba(0,0,0,.08);
}

input{
    width:100%;
    padding:12px;
    margin:20px 0;
}

button{
    width:100%;
    padding:12px;
    border:none;
    background:#00d084;
    color:white;
    border-radius:8px;
    cursor:pointer;
}

.success{
    color:green;
    margin-top:15px;
}

.error{
    color:red;
    margin-top:15px;
}

</style>