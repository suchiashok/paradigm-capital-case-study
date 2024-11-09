<script setup>
import { ref, computed } from "vue";
import { useFetch } from "#app";

const searchQuery = ref("");
const quantityFilter = ref("");

const {
  data: tradeData,
  error,
  isFetching,
} = useFetch("https://paradigmapi.pythonanywhere.com/api/trades");

const displayedColumns = [
  "ticker",
  "date",
  "quantity",
  "price",
  "side",
  "commission",
];

const page = ref(1);
const pageCount = 5;

const filteredTrades = computed(() => {
  return tradeData?.value?.items.filter((trade) => {
    const matchesQuery = trade.ticker
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    // const matchesQuantity = quantityFilter.value
    //   ? trade.quantity.toLowerCase() === quantityFilter.value.toLowerCase()
    //   : true;
    return matchesQuery 
  });
});

const tradesDataDisplay = computed(() =>
  filteredTrades.value.map((trade) =>
    displayedColumns.reduce((result, column) => {
      result[column] = trade[column];
      return result;
    }, {})
  )
);

const rows = computed(() =>
  tradesDataDisplay.value.slice(
    (page.value - 1) * pageCount,
    page.value * pageCount
  )
);
</script>

<template>
  <div class="dashboard">
    <UContainer :style="{ margin: 0 }">
      <h2 class="dashboard__header">Trades Dashboard</h2>

      <!-- Search Bar -->
      <UInput
        v-model="searchQuery"
        class="dashboard__input"
        placeholder="Search for ticker"
      />

      <!-- Display filtered client cards -->
      <div
        class="dashboard__mainTable"
        v-if="!isFetching && filteredTrades.length > 0"
      >
        <UTable :rows="rows" class="dashboard__table" />
      </div>

      <!-- Display error message if there's an error -->
      <div v-else-if="error">
        <p>Something went wrong</p>
      </div>

      <!-- Loading state -->
      <div v-else>
        <p>Loading...</p>
      </div>

      <!-- Pagination-->
      <UPagination
        v-model="page"
        :page-count="pageCount"
        :total="tradesDataDisplay.length"
      />
    </UContainer>
  </div>
</template>

<style lang="sass" scoped>
.dashboard
  border: 2px solid white
  padding: 20px

.dashboard__table
  width: 66%
  height: 300px

.dashboard__mainTable
  margin-top: 1rem
  margin-bottom: 1rem

.dashboard__input
  width: 30%

.dashboard__header
  font: 2em sans-serif
  padding-bottom: 1rem
  text-align: center

.dashboard__filter
  width: 20%
  margin-top: 1rem
  display: flex
  flex-direction: right
</style>
