import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useFilterAndPagination = defineStore("filterAndPagination", () => {
  const filterAndPagination = reactive({
    page: 1,
    offset: 10,
    search: "",
    sort: "ASC",
    tagSearch: "",
  });

  const totalCount = ref(0);

  const updateTotalCount = (value: number) => {
    totalCount.value = value;
  };

  const incrementPage = () => {
    const a = filterAndPagination.page;
    if (a <= totalCount.value / filterAndPagination.offset)
      filterAndPagination.page++;
  };
  const decrementPage = () => {
    if (filterAndPagination.page > 1) filterAndPagination.page--;
  };

  const updateSearch = (value: string) => {
    filterAndPagination.search = value;
  };

  const updateTagSearch = (value: string) => {
    filterAndPagination.tagSearch = value;
  };

  const updateSorting = (value: string) => {
    filterAndPagination.sort = value;
  };

  function updateOffset(value: number) {
    filterAndPagination.offset = Number(value);
  }
  function reset() {
    filterAndPagination.offset = 10;
    filterAndPagination.page = 1;
    filterAndPagination.search = "";
    filterAndPagination.sort = "ASC";
    filterAndPagination.tagSearch = "";
    totalCount.value = 0;
  }

  return {
    filterAndPagination,
    updateOffset,
    reset,
    incrementPage,
    decrementPage,
    updateTotalCount,
    updateSorting,
    updateSearch,
    updateTagSearch,
  };
});
