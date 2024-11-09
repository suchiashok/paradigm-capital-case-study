<script setup>
import { ref, computed } from "vue";
import { useFetch } from "#app";

const searchQuery = ref("");
const quantityFilter = ref({ min: 0, max: Infinity });
const quantityRanges = [
  { label: "<1000", min: 0, max: 1000 },
  { label: "1000-1999", min: 1000, max: 1999 },
  { label: "2000-2999", min: 2000, max: 2999 },
  { label: "3000-3999", min: 3000, max: 3999 },
  { label: ">=4000", min: 4000, max: Infinity },
];
const selectedQuantityRange = ref("");

const {
  data: tradeData,
  error,
  isFetching,
} = useFetch("https://paradigmapi.pythonanywhere.com/api/trades");

const displayedColumns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "ticker",
    label: "Ticker",
    sortable: true,
  },
  {
    key: "quantity",
    label: "Quantity",
    sortable: true,
  },
  {
    key: "price",
    label: "Price",
    sortable: true,
  },
  {
    key: "commission_amount",
    label: "Commission Amount (PER)",
    sortable: true,
  },
  {
    key: "commission",
    label: "Total Commission",
    sortable: true,
  },
];

const page = ref(1);
const pageCount = 5;

const filteredTrades = computed(() => {
  return tradeData?.value?.items.filter((trade) => {
    const matchesQuery = trade.ticker
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    const minQuantity = quantityFilter.value?.min ?? 0;
    const maxQuantity = quantityFilter.value?.max ?? Infinity;
    const matchesQuantity =
      trade.quantity >= minQuantity && trade.quantity <= maxQuantity;
    return matchesQuery && matchesQuantity;
  });
});

const rows = computed(() =>
  filteredTrades.value.slice(
    (page.value - 1) * pageCount,
    page.value * pageCount
  )
);

function updateQuantityFilter(label) {
  const range = quantityRanges.find((r) => r.label === label);
  quantityFilter.value = range || { min: 0, max: Infinity };
}
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

      <USelect
        v-model="selectedQuantityRange"
        placeholder="Filter by quantity"
        :options="quantityRanges.map((range) => range.label)"
        class="dashboard__filter"
        @change="updateQuantityFilter"
      />

      <!-- Display filtered client cards -->
      <div
        class="dashboard__mainTable"
        v-if="!isFetching && filteredTrades.length > 0"
      >
        <UTable
          :columns="displayedColumns"
          :rows="rows"
          class="dashboard__table"
        />
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
        :total="filteredTrades.length"
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
