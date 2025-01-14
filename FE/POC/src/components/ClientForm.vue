<script setup lang="ts">
import { protactedRouteName } from "@/router";
import {
  ADD_CLIENT_API,
  GET_CLIENT_API,
  UPADTE_CLIENT_API,
} from "@/service/clientApi";
import { useUserStore } from "@/stores/user";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { watch } from "@vue/reactivity";
import { computed, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

const formData = reactive({
  name: "",
});
const params = useRoute();
const router = useRouter();
const { userId } = useUserStore();
const { mutate: addClient, loading: updateClientLoading } = useMutation(
  ADD_CLIENT_API,
  {
    variables: {
      name: "",
      userId,
    },
  }
);
const { mutate: updateClient, loading: addClientLoading } = useMutation(
  UPADTE_CLIENT_API,
  {
    variables: {
      name: "",
      updateClientId: "",
    },
  }
);

const { result }: any = useQuery(
  GET_CLIENT_API,
  {
    getSingleClientId: params.params.id,
  },
  {
    fetchPolicy: "no-cache",
    enabled: !!params.params.id,
  }
);

watch(
  () => result.value,
  (data) => {
    if (data.getSingleClient.name) {
      formData.name = data.getSingleClient.name;
    }
  }
);

console.log("params", params.params.id);

const handleUpdateClient = async () => {
  try {
    await updateClient({
      name: formData.name,
      updateClientId: params.params.id as string,
    });
    router.push({ name: protactedRouteName.clients });
  } catch (error) {
    alert("error in create client");
  }
};
const handleCreateClinet = async () => {
  try {
    await addClient({
      name: formData.name,
      userId,
    });
    router.push({ name: protactedRouteName.clients });
  } catch (error) {
    alert("error in create client");
  }
};

const handleSubmit = () => {
  if (params.params?.id) {
    handleUpdateClient();
  } else {
    handleCreateClinet();
  }
};
</script>

<template>
  <div class="form-container">
    <form @submit.prevent="handleSubmit" class="client-form">
      <label for="client-name" class="form-label">Client Name:</label>
      <input
        id="client-name"
        type="text"
        v-model="formData.name"
        required
        class="form-input"
        placeholder="Enter client name"
      />
      <button
        type="submit"
        :disabled="addClientLoading || updateClientLoading"
        :aria-busy="addClientLoading || updateClientLoading"
        class="form-button"
      >
        {{ params.params.id ? "Update Client" : "Add Client" }}
      </button>
    </form>
  </div>
</template>
<style scoped>
.form-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.client-form {
  display: flex;
  flex-direction: column;
}

.form-label {
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
}

.form-input {
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.form-button {
  padding: 10px;
  font-size: 16px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.form-button:disabled {
  background-color: #a6c8ff;
  cursor: not-allowed;
}
</style>
