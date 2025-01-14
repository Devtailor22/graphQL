<script setup lang="ts">
import { protactedRouteName } from "@/router";
import { GET_ALL_CLIENTS_API, GET_CLIENTS_API } from "@/service/clientApi";
import {
  ADD_PROJECT_API,
  GET_PROJECT_API,
  UPDATE_PROJECT_API,
} from "@/service/projectApi";
import { useUserStore } from "@/stores/user";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { ref, watch, type Ref } from "@vue/reactivity";
import { computed, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

const inputRef = ref("") as Ref;
const params = useRoute();
const router = useRouter();
const { userId } = useUserStore();
const formData = reactive({
  title: "",
  clientId: "",
  userId: userId,
  description: "",
  status: "",
  tags: [] as string[],
  priority: "",
  dueDate: "",
});
const { mutate: addProject, loading: addProjectLoading } = useMutation(
  ADD_PROJECT_API,
  {
    variables: {
      title: "",
      clientId: "",
      userId: userId,
      description: "",
      status: "",
      tags: [] as string[],
      priority: "",
      dueDate: "",
    },
  }
);

const { result: clients } = useQuery(
  GET_ALL_CLIENTS_API,
  {},
  {
    fetchPolicy: "no-cache",
  }
);
const { mutate: updateProject, loading: updateProjectLoading } = useMutation(
  UPDATE_PROJECT_API,
  {
    variables: { ...formData, updateProjectId: "" },
  }
);

const { result: project }: any = useQuery(
  GET_PROJECT_API,
  {
    getSingleProjectId: params.params.id,
  },
  {
    fetchPolicy: "no-cache",
    enabled: !!params.params.id,
  }
);

watch(
  () => project.value,
  (data) => {
    if (Object.keys(data.getSingleProject).length) {
      formData.title = data.getSingleProject.title;
      formData.description = data.getSingleProject.description;
      formData.clientId = data.getSingleProject.clientId.id;
      formData.status = data.getSingleProject.status;
      formData.tags = data.getSingleProject.tags;
      formData.priority = data.getSingleProject.priority;
      formData.dueDate = new Date(Number(data.getSingleProject.dueDate))
        .toISOString()
        .substring(0, 10);
    }
  }
);

const handleUpdateProject = async () => {
  try {
    await updateProject({
      ...formData,
      updateProjectId: params.params.id as string,
    });
    router.push({ name: protactedRouteName.home });
  } catch (error) {
    alert("error in update project");
  }
};
const handleCreateProject = async () => {
  try {
    await addProject({ ...formData });
    router.push({ name: protactedRouteName.home });
  } catch (error) {
    alert("error in create project");
  }
};

const handleSubmit = () => {
  if (params.params?.id) {
    handleUpdateProject();
  } else {
    handleCreateProject();
  }
};

const handleAddTag = () => {
  if (inputRef.value) {
    formData.tags = [...formData.tags, inputRef.value];
    inputRef.value = "";
  } else {
    alert("please add the text for add the tag");
  }
};
const min = new Date().toISOString().split("T")[0];
</script>

<template>
  <div class="form-container">
    <form v-on:submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">Title</label>
        <input type="text" id="title" required v-model="formData.title" />
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea
          id="description"
          v-model="formData.description"
          rows="5"
          cols="50"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="client">Client</label>
        <select id="client" v-model="formData.clientId" required>
          <option
            v-for="client in clients.getAllClients"
            :key="client.id"
            :value="client.id"
          >
            {{ client.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="status">Status</label>
        <select id="status" v-model="formData.status">
          <option value="INPROGRESS" selected>In Progress</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      <div class="form-group">
        <label for="priority">Priority</label>
        <select id="priority" v-model="formData.priority">
          <option value="LOW" selected>Low</option>
          <option value="MID">Mid</option>
          <option value="HIGH">High</option>
        </select>
      </div>

      <div class="form-group">
        <label for="tags">Tags</label>
        <div class="tags-input">
          <input type="text" v-model="inputRef" />
          <button type="button" @click="handleAddTag">Add</button>
        </div>
        <div class="tags-list">
          <span v-for="tag in formData.tags" :key="tag" class="tag">
            {{ tag }}
          </span>
        </div>
      </div>
      <div class="form-group">
        <input
          type="date"
          v-model="formData.dueDate"
          required
          :min="min"
          :value="formData.dueDate"
        />
      </div>

      <div class="form-group">
        <button :disabled="addProjectLoading || updateProjectLoading">
          {{ params.params.id ? "Update Project" : "Add Project" }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input[type="text"],
textarea,
select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  padding: 10px 15px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.tags-input {
  display: flex;
  gap: 10px;
  align-items: center;
}

.tags-list {
  margin-top: 10px;
}

.tag {
  display: inline-block;
  background-color: #007bff;
  color: white;
  padding: 5px 10px;
  margin-right: 5px;
  border-radius: 3px;
}
</style>
