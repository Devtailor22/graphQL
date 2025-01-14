<script setup lang="ts">
import { useFilterAndPagination } from "@/stores/filterAndPagination";
import { debounce } from "@/utils";
import { onUnmounted, watch } from "vue";
// import { debounce } from "@/utils";
const props = defineProps(["totalCount", "searchLabel", "page"]);
const filterAndPagination = useFilterAndPagination();

console.log("props", props);

const searchHandleChange = (e: any) => {
  const value = e.target.value;
  debounce(500, () => {
    filterAndPagination.updateSearch(value);
  });
};

const searchTagHandleChange = (e: any) => {
  const value = e.target.value;
  debounce(500, () => {
    filterAndPagination.updateTagSearch(value);
  });
};

watch(
  () => props.totalCount,
  () => {
    filterAndPagination.updateTotalCount(props.totalCount);
  }
);

onUnmounted(() => {
  filterAndPagination.reset();
});
</script>

<template>
  <div class="filter-pagination">
    <!-- Filter Section -->
    <div class="filter-section">
      <div class="search-container">
        <input
          type="search"
          :placeholder="props.searchLabel"
          @input="searchHandleChange"
          class="search-input"
        />
        <input
          v-if="props.page === 'home'"
          type="search"
          placeholder="search by tag"
          @input="searchTagHandleChange"
          class="search-input"
        />
      </div>
      <div class="sort-container">
        <label for="sort" class="sort-label">Sort:</label>
        <select
          id="sort"
          class="sort-select"
          @change="(e: any) => filterAndPagination.updateSorting(e.target.value)"
          :value="filterAndPagination.filterAndPagination.sort"
        >
          <option value="ASC" selected>Ascending</option>
          <option value="DESC">Descending</option>
        </select>
      </div>
    </div>

    <!-- Content Slot -->
    <div class="content-slot">
      <slot name="content"></slot>
    </div>

    <!-- Pagination Section -->
    <div class="pagination-section">
      <div>
        <slot name="button"></slot>
      </div>
      <div class="pagination-content">
        <button
          class="pagination-button"
          @click="() => filterAndPagination.decrementPage()"
          :disabled="filterAndPagination.filterAndPagination.page <= 1"
        >
          Previous
        </button>
        <div>
          {{ filterAndPagination.filterAndPagination.page }}
        </div>
        <button
          class="pagination-button"
          @click="() => filterAndPagination.incrementPage()"
          :disabled="
            filterAndPagination.filterAndPagination.page >= props.totalCount
          "
        >
          Next
        </button>
        <label for="items-per-page" class="pagination-label"
          >Items per page:</label
        >
        <select
          id="items-per-page"
          class="pagination-select"
          @change="(e: any) => filterAndPagination.updateOffset(e.target.value)"
          :value="filterAndPagination.filterAndPagination.offset"
        >
          <option value="10" selected>10</option>
          <option value="20">20</option>
          <option value="30">30</option>
        </select>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter-pagination {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  max-width: 100%;
  margin: 0 auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.search-container {
  flex: 1;
  display: flex;
  gap: 8px;
}

.search-input {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.sort-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-label {
  font-weight: 600;
}

.sort-select {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.content-slot {
  max-height: calc(100vh - 246px);
  overflow: auto;
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 4px;
}

.pagination-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.pagination-label {
  font-weight: 600;
}

.pagination-select {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
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

.pagination-button:hover {
  background-color: #0056b3;
}
.pagination-content {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
</style>
