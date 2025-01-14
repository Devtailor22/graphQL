import { defineStore } from "pinia";
import { computed, reactive } from "vue";

export const useUserStore = defineStore("userData", () => {
  const data = reactive({
    id: "",
    name: "",
    email: "",
  });
  const userId = computed(() => data.id);
  function updateUserData(values: { id: string; name: string; email: string }) {
    data.id = values.id;
    data.name = values.name;
    data.email = values.email;
  }

  return { userId, data, updateUserData };
});
