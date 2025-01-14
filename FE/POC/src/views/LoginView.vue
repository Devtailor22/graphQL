<script setup lang="ts">
import { reactive, watch } from "vue";
import { useRouter } from "vue-router";
import { useMutation } from "@vue/apollo-composable";
import { SIGN_IN_API } from "@/service/authApis";
import { useUserStore } from "@/stores/user";
import { authRouteName } from "@/router";

const formData = reactive({
  email: "",
  password: "",
});
const { updateUserData } = useUserStore();
const router = useRouter();
const signResponse = reactive({ error: "" });

const { mutate: handleLogin, loading } = useMutation(SIGN_IN_API, () => ({
  variables: {
    email: formData.email,
    password: formData.password,
  },
}));

// type LoginResponse = {
//   data: {
//     signIn: {
//       accessToken: String;
//       refreashToken: String;
//     };
//   };
// };

async function handleSubmit() {
  try {
    const { data }: any = await handleLogin();
    if (data.signIn) {
      localStorage.setItem("accessToken", data.signIn.accessToken);
      localStorage.setItem("refreshToken", data.signIn.refreshToken);
      localStorage.setItem("userId", data.signIn.data.id);
      router.push({ name: "home" });
      updateUserData({
        name: data.signIn.data.name,
        id: data.signIn.data.id,
        email: data.signIn.data.email,
      });
    }
  } catch (error) {
    signResponse.error = "Invalid username or password";
  }
}
</script>

<template>
  <div class="login-container">
    <h2>Login</h2>
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
        type="password"
        class="input-field"
        name="password"
        placeholder="Password"
        v-model="formData.password"
        required
      />
      <div class="error-message">{{ signResponse.error }}</div>
      <button type="submit" class="login-button" :disabled="loading">
        Login
      </button>
    </form>
    <div class="create-account-link">
      Don't have Account?.
      <a @click.prevent="() => router.push({ name: authRouteName.register })"
        >sign up now</a
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
  height: 300px;
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
.create-account-link > a {
  border-bottom: 1px solid blue;
  color: blue;
  cursor: pointer;
}
</style>
