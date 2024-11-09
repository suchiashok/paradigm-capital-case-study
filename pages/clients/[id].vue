<script setup>
const route = useRoute();

const clientId = parseInt(route.params.id);
const searchQuery = ref("");
const sideFilter = ref("");
const commTypeFilter = ref("");

const {
  data: clientTradeData,
  error,
  isFetching,
} = useFetch(
  `https://paradigmapi.pythonanywhere.com/api/clients/${clientId}/trades`
);

const displayedColumns = [
  {
    key: "id",
    label: "Transaction ID",
    sortable: true,
  },
  {
    key: "full_ticker",
    label: "Full Ticker",
  },
  {
    key: "side",
    label: "Side",
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
    key: "commission_type",
    label: "Commission Type",
  },
  {
    key: "commission_amount",
    label: "Commission Amt",
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

const filteredClientTrades = computed(() => {
  return (clientTradeData.value || []).filter((trade) => {
    const matchesQuery = trade.ticker
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    const matchesSide = sideFilter.value
      ? trade.side.toLowerCase() === 
        sideFilter.value.toLowerCase()
      : true;
    const matchesComm = commTypeFilter.value
      ? trade.commission_type.toLowerCase() === 
        commTypeFilter.value.toLowerCase()
      : true;
    return matchesQuery && matchesSide && matchesComm;
  });
});


const rows = computed(() =>
  filteredClientTrades.value.slice(
    (page.value - 1) * pageCount,
    page.value * pageCount
  )
);

const resetFilters = () => {
  searchQuery.value = "";
  sideFilter.value = "";
  commTypeFilter.value = "";
};
</script>

<template>
  <UContainer style="margin-top: 2rem">
    <UCard>
      <h2 class="dashboard__header">Trades of Client with ID - {{ clientTradeData[0].client }}</h2>
      <!-- Filters -->
      <UCard class="dashboard__tableCard">
        <div class="dashboard__filters">
          <UInput
            v-model="searchQuery"
            class="dashboard__filter"
            placeholder="Search for ticker"
          />

          <USelect
            v-model="sideFilter"
            placeholder="Filter by side"
            :options="['BUY', 'SELL']"
            class="dashboard__filter"
          />

          <USelect
            v-model="commTypeFilter"
            placeholder="Filter by Commission Type"
            :options="['BP', 'PER']"
            class="dashboard__filter"
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
        v-if="!isFetching && filteredClientTrades.length > 0"
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
        :total="filteredClientTrades.length"
      />
    </UCard>
  </UContainer>
</template>

<style lang="sass" scoped>
.dashboard
  border: 2px solid #00DC82
  padding: 20px
  width: 66%

.dashboard__mainTable
  margin-top: 1rem
  margin-bottom: 1rem

.dashboard__header
  font: 2em sans-serif
  padding-bottom: 1rem
  text-align: center

.dashboard__filter
  width: 20%
  display: flex

.dashboard__tableCard
  display: flex
  flex-direction: column
  justify-content: space-between
  border: 2px solid green
  margin-top: 1em

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
