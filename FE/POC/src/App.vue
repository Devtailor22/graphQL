<script setup lang="ts">
import { RouterView } from "vue-router";
import Navbar from "./components/Navbar.vue";
</script>
<template>
  <Navbar />
  <div class="main-container">
    <RouterView />
  </div>
</template>

<style scoped>
.main-container {
  padding: 20px 0px 0px 0px;
  align-items: center;
  display: flex;
  justify-content: center;
}
</style>
