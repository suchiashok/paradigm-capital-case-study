<script setup>
import { ref, computed } from "vue";
import { useFetch, useRouter } from "#app";

const searchQuery = ref("");
const quantityFilter = ref({ min: 0, max: Infinity });
const priceFilter = ref({ min: 0, max: Infinity });
const commissionFilter = ref({ min: 0, max: Infinity });
const quantityRanges = [
  { label: "<1000", min: 0, max: 999 },
  { label: "1000-1999", min: 1000, max: 1999 },
  { label: "2000-2999", min: 2000, max: 2999 },
  { label: "3000-3999", min: 3000, max: 3999 },
  { label: ">4000", min: 4000, max: Infinity },
];
const priceRanges = [
  { label: "<50", min: 0, max: 49 },
  { label: "50-99", min: 50, max: 99 },
  { label: ">100", min: 100, max: Infinity },
];
const commissionRanges = [
  { label: "<50", min: 0, max: 49 },
  { label: "50-349", min: 50, max: 349 },
  { label: ">350", min: 350, max: Infinity },
];
const selectedQuantityRange = ref("");
const selectedPriceRange = ref("");
const selectedCommissionRange = ref("");

const router = useRouter();
const navigateHome = () => {
  router.push("/");
};

const {
  data: tradeData,
  error,
  isFetching,
} = await useFetch("/api/trades/list");

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
  {
    key: "date",
    label: "Date of Transaction",
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
    const minPrice = priceFilter.value?.min ?? 0;
    const maxPrice = priceFilter.value?.max ?? Infinity;
    const minCommission = commissionFilter.value?.min ?? 0;
    const maxCommission = commissionFilter.value?.max ?? Infinity;
    const matchesQuantity =
      trade.quantity >= minQuantity && trade.quantity <= maxQuantity;
    const matchesPrice = trade.price >= minPrice && trade.price <= maxPrice;
    const matchesCommission =
      trade.commission >= minCommission && trade.commission <= maxCommission;
    return matchesQuery && matchesQuantity && matchesPrice && matchesCommission;
  });
});

const rows = computed(() =>
  filteredTrades.value.slice(
    (page.value - 1) * pageCount,
    page.value * pageCount
  )
);

const resetFilters = () => {
  searchQuery.value = "";
  selectedQuantityRange.value = "";
  selectedPriceRange.value = "";
  selectedCommissionRange.value = "";
  quantityFilter.value = { min: 0, max: Infinity };
  priceFilter.value = { min: 0, max: Infinity };
  commissionFilter.value = { min: 0, max: Infinity };
};

function updateQuantityFilter(label) {
  const range = quantityRanges.find((r) => r.label === label);
  quantityFilter.value = range || { min: 0, max: Infinity };
}

function updatePriceFilter(label) {
  const range = priceRanges.find((r) => r.label === label);
  priceFilter.value = range || { min: 0, max: Infinity };
}

function updateCommissionFilter(label) {
  const range = commissionRanges.find((r) => r.label === label);
  commissionFilter.value = range || { min: 0, max: Infinity };
}
</script>

<template>
  <div class="dashboard">
    <UContainer :style="{ margin: 0 }" class="dashboard__main">
      <h2 class="dashboard__header">Trades Dashboard</h2>
      <div class="dashboard__homeButton">
        <UButton
          @click="navigateHome"
          icon="oi:home"
          color="green"
          variant="outline"
        />
      </div>
      <!-- Filters -->
      <UCard class="dashboard__tableCard">
        <div class="dashboard__filters">
          <UInput
            v-model="searchQuery"
            class="dashboard__filter"
            placeholder="Search for ticker"
          />

          <USelect
            v-model="selectedPriceRange"
            placeholder="Filter by price"
            :options="priceRanges.map((range) => range.label)"
            class="dashboard__filter"
            @change="updatePriceFilter"
          />

          <USelect
            v-model="selectedQuantityRange"
            placeholder="Filter by quantity"
            :options="quantityRanges.map((range) => range.label)"
            class="dashboard__filter"
            @change="updateQuantityFilter"
          />

          <USelect
            v-model="selectedCommissionRange"
            placeholder="Filter by total commission"
            :options="commissionRanges.map((range) => range.label)"
            class="dashboard__filter"
            @change="updateCommissionFilter"
          />
        </div>

        <div class="dashboard__button">
          <UButton @click="resetFilters" color="green" variant="outline">
            Reset Filters
          </UButton>
        </div>
      </UCard>

      <!-- Display filtered client cards -->
      <div
        class="dashboard__mainTable"
        v-if="!isFetching && filteredTrades.length > 0"
      >
        <UTable :columns="displayedColumns" :rows="rows" class="w-full" />
      </div>

      <!-- Display error message if there's an error -->
      <div v-else-if="error">
        <p>Something went wrong</p>
      </div>

      <!-- Loading state -->
      <div v-else>
        <p>No Data</p>
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
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0
  border: 1px solid #00DC82
  border-radius: 12px
  padding: 20px
  margin: 0
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  overflow-y: auto
  box-sizing: border-box

.dashboard__main
  flex: 1
  padding-top: 3rem

.dashboard__mainTable
  margin-top: 1rem
  margin-bottom: 1rem

.dashboard__homeButton
  position: absolute
  top: 20px
  right: 20px
  z-index: 10

.dashboard__header
  font: 2em sans-serif
  padding-bottom: 1rem
  text-align: center
  margin-top: 0

.dashboard__filter
  width: 20%
  display: flex

.dashboard__tableCard
  display: flex
  flex-direction: column
  justify-content: space-between

.dashboard__filters
  display: flex
  gap: 1rem

.dashboard__filter
  width: 40%
  margin-top: 1rem

.dashboard__button
  display: flex
  padding-top: 1em
  justify-content: flex-end
</style>
