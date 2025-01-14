<script setup lang="ts">
import { logout } from "@/apolloClient";
import { protactedRouteName, route } from "@/router/index.ts";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
const currentRoute = useRoute();
let showSidebarProps = ref(false);

watch(
  () => currentRoute.name,
  (newRouteName) => {
    if (newRouteName && typeof newRouteName === "string") {
      showSidebarProps.value =
        Object.keys(protactedRouteName).includes(newRouteName);
    }
  },
  { immediate: true } // This makes sure the watch is triggered on mount as well
);
</script>

<template>
  <header v-if="showSidebarProps">
    <nav class="navbar">
      <div><img src="../assets/monkey.png" height="40px" width="40px" /></div>
      <div>
        <RouterLink
          v-bind:to="route.home"
          active-class="nav-link-active"
          class="nav-link"
          >Home</RouterLink
        >
        <RouterLink
          v-bind:to="route.clients"
          active-class="nav-link-active"
          class="nav-link"
          >Clients</RouterLink
        >
      </div>
      <div class="end">
        <RouterLink
          v-bind:to="route.archive"
          active-class="nav-link-active"
          class="nav-link"
          >Archive</RouterLink
        >
        <div class="logout" @click="logout">logout</div>
      </div>
    </nav>
  </header>
</template>

<style scoped>
/* Style the navigation container */
.navbar {
  height: 40px;
  display: flex;
  justify-content: space-between; /* Center the links horizontally */
  align-items: center;
  background-color: #333; /* Dark background color */
  padding: 10px 20px;
  border-radius: 5px; /* Rounded corners */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow for effect */
}

/* Style the individual links */
.nav-link {
  color: white;
  text-decoration: none;
  padding: 10px 15px;
  margin: 0 15px; /* Space between the links */
  border-radius: 3px; /* Rounded corners on each link */
  font-weight: bold;
  transition: background-color 0.3s, color 0.3s; /* Smooth transition for hover effect */
}

/* Change background color when hovered */
.nav-link:hover {
  background-color: #575757; /* Slightly lighter shade */
  color: #f1f1f1; /* Lighter text color */
}

.nav-link-active {
  background-color: #007bff; /* Blue background for active link */
  color: #ffffff; /* White text for active link */
  font-weight: bold; /* Keep the text bold */
}

/* Active link hover effect */
.nav-link-active:hover {
  background-color: #0056b3; /* Darker blue on hover */
  color: #ffffff;
}

.last-dropdown {
  color: white;
}
.logout {
  color: white;
  cursor: pointer;
  font-weight: 600;
}
.end {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
}
</style>
