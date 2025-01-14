import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { useUserStore } from "@/stores/user";
import client, { logout } from "@/apolloClient";
import { useQuery } from "@vue/apollo-composable";
import { GET_USER } from "@/service/userApi";

export const route = {
  home: "/",
  archive: "/archive",
  notFound: "/:pathMatch(.*)*",
  login: "/login",
  register: "/register",
  clients: "/clients",
  addClient: "/addClinet",
  updateClinet: "/updateClient/:id",
  addProject: "/addProject",
  updateProject: "/updateProject/:id",
};

export const protactedRouteName = {
  home: "home",
  archive: "archive",
  notFound: ":pathMatch(.*)*",
  clients: "clients",
  addClient: "addClinet",
  updateClinet: "updateClient",
  addProject: "addProject",
  updateProject: "updateProject",
};

export const authRouteName = {
  login: "login",
  register: "register",
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // add all the protected route here
    {
      path: route.home,
      name: protactedRouteName.home,
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: route.archive,
      name: protactedRouteName.archive,
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: route.clients,
      name: protactedRouteName.clients,
      component: () => import("../views/ClientView.vue"),
    },
    {
      path: route.notFound,
      name: protactedRouteName.notFound,
      component: () => import("@/views/NotFoundPage.vue"),
    },
    {
      path: route.addClient,
      name: protactedRouteName.addClient,
      component: () => import("@/components/ClientForm.vue"),
    },
    {
      path: route.updateClinet,
      name: protactedRouteName.updateClinet,
      component: () => import("@/components/ClientForm.vue"),
    },
    {
      path: route.addProject,
      name: protactedRouteName.addProject,
      component: () => import("@/components/ProjectForm.vue"),
    },
    {
      path: route.updateProject,
      name: protactedRouteName.updateProject,
      component: () => import("@/components/ProjectForm.vue"),
    },

    // add the unAuth route below
    {
      path: route.login,
      name: authRouteName.login,
      component: () => import("@/views/LoginView.vue"),
    },
    {
      path: route.register,
      name: authRouteName.register,
      component: () => import("@/views/RegisterView.vue"),
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem("accessToken");
  if (
    to.name &&
    typeof to.name === "string" &&
    Object.values(authRouteName).includes(to.name) &&
    token
  ) {
    next(from.fullPath ?? "/");
  }
  if (
    to.name &&
    typeof to.name === "string" &&
    Object.values(protactedRouteName).includes(to.name) &&
    !token
  ) {
    next(route.login);
  }

  const { userId, updateUserData } = useUserStore();
  if (
    to.name &&
    typeof to.name === "string" &&
    Object.values(protactedRouteName).includes(to.name) &&
    !userId
  ) {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) logout();
      const { data } = await client.query({
        query: GET_USER,
        variables: {
          getUserId: userId,
        },
      });
      updateUserData({
        id: data.getUser.id,
        name: data.getUser.name,
        email: data.getUser.email,
      });
      next();
    } catch (error) {
      logout();
    }
  } else {
    next();
  }
});

export default router;
