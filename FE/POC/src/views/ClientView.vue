<script setup lang="ts">
import PaginationAndFilterAndSorting from "@/components/PaginationAndFilterAndSorting.vue";
import { protactedRouteName } from "@/router";
import { DELETE_CLIENT_API, GET_CLIENTS_API } from "@/service/clientApi";
import { useFilterAndPagination } from "@/stores/filterAndPagination";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { watch } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const paginationData = useFilterAndPagination();
const { loading, error, result, refetch } = useQuery(
  GET_CLIENTS_API,
  {
    page: paginationData.filterAndPagination.page,
    offset: paginationData.filterAndPagination.offset,
    sort: paginationData.filterAndPagination.sort,
    search: paginationData.filterAndPagination.search,
  },
  {
    fetchPolicy: "no-cache",
  }
);
const { mutate: deleteClient } = useMutation(DELETE_CLIENT_API, {
  variables: {
    deleteClientId: "",
  },
});
const handleClick = () => {
  router.push({ name: protactedRouteName.addClient });
};

const handleEdit = (id: string) => {
  router.push({
    name: protactedRouteName.updateClinet,
    params: { id: id },
  });
};

const handleDelete = async (id: string) => {
  const a = confirm(`Broo whyyy :(  are you sure ?  `);

  if (a) {
    await deleteClient({
      deleteClientId: id,
    });
    refetch({
      page: paginationData.filterAndPagination.page,
      offset: paginationData.filterAndPagination.offset,
      sort: paginationData.filterAndPagination.sort,
      search: paginationData.filterAndPagination.search,
    });
  }
};

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
    });
  },
  { deep: true }
);
</script>

<template>
  <PaginationAndFilterAndSorting
    :totalCount="result?.getClients?.pagination?.totalCount ?? 10"
    searchLabel="Search by name...."
    page="client"
  >
    <template #button>
      <button @click="handleClick" class="pagination-button">
        + Add Client
      </button>
    </template>
    <template #content>
      <main>
        <div v-if="loading && !error">Loading.........</div>
        <div v-if="result && !error">
          <div class="table-container">
            <table class="styled-table">
              <thead>
                <tr>
                  <th>Created At</th>
                  <th>Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="data in result?.getClients?.clients" :key="data.id">
                  <td>
                    {{ new Date(Number(data.createdAt)).toLocaleDateString() }}
                  </td>
                  <td>{{ data.name }}</td>
                  <td class="actions">
                    <button
                      class="btn edit-btn"
                      @click="() => handleEdit(data.id)"
                    >
                      Edit
                    </button>
                    <button
                      class="btn delete-btn"
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
  </PaginationAndFilterAndSorting>
</template>

<style scoped>
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.table-container {
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
