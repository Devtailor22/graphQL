<script setup lang="ts">
import { authRouteName } from "@/router";
import { SIGN_UP_API } from "@/service/authApis";
import { useMutation } from "@vue/apollo-composable";
import { reactive } from "vue";
import { useRouter } from "vue-router";

const formData = reactive({
  email: "",
  name: "",
  password: "",
  mathPassword: "",
});
const router = useRouter();
const signUpResponse = reactive({ error: "" });

const { mutate: handleRagister, loading } = useMutation(SIGN_UP_API, () => ({
  variables: {
    email: formData.email,
    name: formData.name,
    password: formData.password,
  },
}));

async function handleSubmit() {
  if (formData.password !== formData.mathPassword) {
    signUpResponse.error = "confirm password invalid";
    return;
  }
  try {
    const { data }: any = await handleRagister();
    if (data.addUser) {
      alert("sign up successdully done");
      router.push({ name: authRouteName.login });
    }
  } catch (error) {
    signUpResponse.error = "user already exists";
  }
}
</script>

<template>
  <div class="login-container">
    <h2>Sign Up</h2>
    <form @submit.prevent="handleSubmit">
      <input
        type="email"
        class="input-field"
        name="email"
        placeholder="email"
        v-model="formData.email"
        required
      />
      <input
        type="text"
        class="input-field"
        name="name"
        placeholder="username"
        v-model="formData.name"
        required
      />
      <input
        type="password"
        class="input-field"
        name="password"
        placeholder="Password"
        v-model="formData.password"
        required
      />
      <input
        type="password"
        class="input-field"
        name="cpassword"
        placeholder="confirm Password"
        v-model="formData.mathPassword"
        required
      />
      <div class="error-message">{{ signUpResponse.error }}</div>
      <button type="submit" class="login-button" :disabled="loading">
        Signup
      </button>
    </form>
    <div class="login-link">
      Alrady have Account?.
      <a @click.prevent="() => router.push({ name: authRouteName.login })"
        >sign In here</a
      >
    </div>
  </div>
</template>

<style>
body {
  box-sizing: border-box;
  font-family: Arial, sans-serif;
  background-color: #f4f7fc;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

.error-message {
  color: red;
  font-size: 12px;
}

.login-container {
  padding: 40px;
  background: #ffffff;
  border-radius: 8px;
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 400px;
  height: 400px;
  text-align: center;
}
h2 {
  margin-bottom: 20px;
  color: #333;
  font-size: 24px;
}
.input-field {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;
}
.input-field:focus {
  border-color: #3498db;
}
.login-button {
  width: 100%;
  padding: 10px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.login-button:hover {
  background-color: #2980b9;
}
.forgot-password {
  font-size: 14px;
  color: #777;
  margin-top: 10px;
}
.forgot-password a {
  color: #3498db;
  text-decoration: none;
}
.forgot-password a:hover {
  text-decoration: underline;
}
.login-link > a {
  border-bottom: 1px solid blue;
  color: blue;
  cursor: pointer;
}
</style>
