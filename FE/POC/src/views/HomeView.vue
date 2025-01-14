<script setup lang="ts">
import Pagination from "@/components/PaginationAndFilterAndSorting.vue";
import { protactedRouteName } from "@/router";
import {
  DELETE_PROJECT_API,
  GET_PROJECTS_API,
  UPDATE_PROJECT_API,
} from "@/service/projectApi";
import { useFilterAndPagination } from "@/stores/filterAndPagination";
import { useUserStore } from "@/stores/user";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const paginationData = useFilterAndPagination();
const { loading, error, result, refetch } = useQuery(
  GET_PROJECTS_API,
  {
    page: paginationData.filterAndPagination.page,
    offset: paginationData.filterAndPagination.offset,
    sort: paginationData.filterAndPagination.sort,
    search: paginationData.filterAndPagination.search,
    tagSearch: paginationData.filterAndPagination.tagSearch,
    complated: route.name !== "home",
  },
  { fetchPolicy: "no-cache" }
);

const { mutate: deleteProject, loading: deleteLoader } = useMutation(
  DELETE_PROJECT_API,
  {
    variables: {
      deleteProjectId: "",
    },
  }
);
const { mutate: updateProject, loading: updateLoader } = useMutation(
  UPDATE_PROJECT_API,
  {
    variables: {
      updateProjectId: "",
      status: "CLOSED",
    },
  }
);

watch(
  () => {
    return paginationData.filterAndPagination;
  },
  () => {
    refetch({
      page: paginationData.filterAndPagination.page,
      offset: paginationData.filterAndPagination.offset,
      sort: paginationData.filterAndPagination.sort,
      search: paginationData.filterAndPagination.search,
      tagSearch: paginationData.filterAndPagination.tagSearch,
      complated: route.name !== "home",
    });
  },
  { deep: true }
);

watch(
  () => {
    return route.name;
  },
  () => {
    refetch({
      page: paginationData.filterAndPagination.page,
      offset: paginationData.filterAndPagination.offset,
      sort: paginationData.filterAndPagination.sort,
      search: paginationData.filterAndPagination.search,
      tagSearch: paginationData.filterAndPagination.tagSearch,
      complated: route.name !== "home",
    });
  },
  { deep: true }
);

console.log("route.name", route.name);

const router = useRouter();
const data = computed(() => result.value?.getProjects);
const { userId } = useUserStore();

const handleClick = () => {
  router.push({ name: protactedRouteName.addProject });
};

const handleEdit = (id: string) => {
  router.push({
    name: protactedRouteName.updateProject,
    params: { id: id },
  });
};

const handleDelete = async (id: string) => {
  const a = confirm(`Broo whyyy :(  are you sure ?  `);

  if (a) {
    await deleteProject({
      deleteProjectId: id,
    });
    refetch({
      page: paginationData.filterAndPagination.page,
      offset: paginationData.filterAndPagination.offset,
      sort: paginationData.filterAndPagination.sort,
      search: paginationData.filterAndPagination.search,
      tagSearch: paginationData.filterAndPagination.tagSearch,
      complated: route.name !== "home",
    });
  }
};

const handleComplate = async (id: string) => {
  try {
    await updateProject({
      updateProjectId: id,
      status: "CLOSED",
    });

    refetch({
      page: paginationData.filterAndPagination.page,
      offset: paginationData.filterAndPagination.offset,
      sort: paginationData.filterAndPagination.sort,
      search: paginationData.filterAndPagination.search,
      tagSearch: paginationData.filterAndPagination.tagSearch,
      complated: route.name !== "home",
    });
  } catch (error) {
    alert("error updating the user");
  }
};
</script>

<template>
  <Pagination
    :totalCount="result?.getProjects?.pagination?.totalCount ?? 10"
    searchLabel="Search by title...."
    page="home"
  >
    <template #button>
      <button @click="handleClick" class="pagination-button">
        + Add Project
      </button>
    </template>
    <template #content>
      <main>
        <div v-if="loading && !error">Loading.........</div>
        <div v-if="error">unable to load the data</div>
        <div v-if="result && !error">
          <div class="table-container">
            <table class="styled-table">
              <thead>
                <tr>
                  <th>Created At</th>
                  <th>Due At</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Tags</th>
                  <th>Priority</th>
                  <th>Client Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="data in result?.getProjects.projects" :key="data.id">
                  <td>
                    {{ new Date(Number(data.createdAt)).toLocaleDateString() }}
                  </td>
                  <td>
                    {{
                      data.dueDate
                        ? new Date(Number(data.dueDate)).toLocaleDateString()
                        : ""
                    }}
                  </td>
                  <td>{{ data.title }}</td>
                  <td>{{ data.description }}</td>
                  <td>{{ data.status }}</td>
                  <td>
                    <ul class="tags-list">
                      <li v-for="tag in data.tags" :key="tag" class="tag-item">
                        {{ tag }}
                      </li>
                    </ul>
                  </td>
                  <td>{{ data.priority }}</td>
                  <td>{{ data.clientId.name }}</td>
                  <td class="actions">
                    <button
                      v-if="route.name === 'home'"
                      class="btn edit-btn"
                      :disabled="updateLoader"
                      @click="() => handleComplate(data.id)"
                    >
                      Complate
                    </button>
                    <button
                      class="btn edit-btn"
                      @click="() => handleEdit(data.id)"
                    >
                      Edit
                    </button>
                    <button
                      class="btn delete-btn"
                      :disabled="deleteLoader"
                      @click="() => handleDelete(data.id)"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </template>
  </Pagination>
</template>

<style scoped>
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.table-container {
  /* margin: 20px auto; */
  max-width: 100%;
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.styled-table {
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
  font-size: 14px;
  background-color: #ffffff;
}

.styled-table thead tr {
  background-color: #000000;
  color: #ffffff;
  text-align: left;
}

.styled-table th,
.styled-table td {
  padding: 12px 15px;
  border: 1px solid #ddd;
}

.styled-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.styled-table tbody tr:hover {
  background-color: #eaeaea;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 5px 10px;
  border: 1px solid #000000;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  background-color: transparent;
  color: #000000;
}

.btn:hover {
  background-color: #000000;
  color: #ffffff;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.tag-item {
  padding: 3px 8px;
  background-color: #f2f2f2;
  border-radius: 3px;
  font-size: 12px;
}

.priority-high {
  color: #000000;
  font-weight: bold;
}

.priority-medium {
  color: #666666;
}

.priority-low {
  color: #999999;
}

.status-active {
  font-weight: bold;
  color: #000000;
}

.status-inactive {
  color: #666666;
}
.pagination-button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}
</style>
