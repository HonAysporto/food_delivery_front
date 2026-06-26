<script setup>
import { ref } from 'vue';



const name = ref('');
const email = ref('')
const password = ref('')
const isDev = ref('')


const register = () => {
  
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const userDetails = {
    name: name.value, email: email.value, password: password.value
  }
  users.push(userDetails)
  localStorage.setItem('users', JSON.stringify(users))
  
  console.log(isDev.value);
  

}

</script>

<template>

    <div class="card mx-auto shadow-sm px-2py-1">
      <form action="" @submit.prevent="register">
      <div class="form-group mb-2">
        <input type="text" class="form-control" v-model="name">
        <label for="" class="form-floating"> Name</label>
      </div>

       <div class="form-group mb-2">
        <input type="email" class="form-control" v-model="email">
        <label for="" class="form-floating"> E-mail Address</label>
      </div>

       <div class="form-group mb-2">
        <input type="password" class="form-control" v-model="password">
        <label for="" class="form-floating">Password </label>
      </div>

      <div class="form-group mb-3">
        <select name="" id="" class="form-control" v-model="isDev">
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>

        <label for="">Are you a developer</label>
      </div>

      <div class="form-group mb-2">
        <button class="btn btn-md bg-dark text-light px-2" >Register</button>
      </div>
      </form>
    </div>

</template>

<style scoped>

</style>
