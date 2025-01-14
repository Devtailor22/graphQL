import { createApp, provide, h } from "vue";
import { createPinia } from "pinia";
import { DefaultApolloClient } from "@vue/apollo-composable";
import App from "./App.vue";
import router from "./router";
import client from "./apolloClient";

const app = createApp({
  setup() {
    provide(DefaultApolloClient, client);
  },

  render: () => h(App),
});
app.use(createPinia());
app.use(router);

app.mount("#app");
