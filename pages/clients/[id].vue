<script setup>
import { useRouter } from "#app";
const route = useRoute();

const id = parseInt(route.params.id);
const searchQuery = ref("");
const sideFilter = ref("");
const commTypeFilter = ref("");

const router = useRouter();
const navigateHome = () => {
  router.push("/");
};

const {
  data: clientTradeData,
  error,
  isFetching,
} = await useFetch(`/api/clients/${id}`);

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
      ? trade.side.toLowerCase() === sideFilter.value.toLowerCase()
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

const totalCommission = computed(() => {
  const sum = filteredClientTrades.value.reduce((sum, trade) => {
    const commission = parseFloat(trade.commission_amount);
    return sum + (isNaN(commission) ? 0 : commission);
  }, 0);
  return Math.round((sum + Number.EPSILON) * 100) / 100;
});
</script>

<template>
  <UContainer style="margin-top: 2rem" class="dashboard">
    <div class="dashboard__homeButton">
      <UButton
        @click="navigateHome"
        icon="oi:home"
        color="green"
        variant="outline"
      />
    </div>
    <UCard class="dashboard__mainCard">
      <h2 class="dashboard__header">
        Trades of Client with ID - {{ clientTradeData[0].client }}
      </h2>
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
    <div class="dashboard__total">
      <UCard class="dashboard__totalCard">
        <p>Total Commission: {{ totalCommission }}</p>
      </UCard>
    </div>
  </UContainer>
</template>

<style lang="sass" scoped>
.dashboard
  width: 100vw

.dashboard__mainCard
  margin-top: 8rem

.dashboard__mainTable
  margin-top: 1rem
  margin-bottom: 1rem

.dashboard__header
  font: 2em sans-serif
  padding-bottom: 1rem
  text-align: center

.dashboard__homeButton
  position: absolute
  top: 20px
  right: 20px
  z-index: 10

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

.dashboard__totalCard
  padding: 1rem
  margin-top: 2rem
  margin-bottom: 5rem
  border: 2px solid green
  text-align: center
  font-size: 1.3rem
</style>
