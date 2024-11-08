<script setup>
import { ref, computed } from "vue";
import { useFetch } from "#app";

const searchQuery = ref("");
const riskProfileFilter = ref("");
const companyTypeFilter = ref("");

const {
  data: clientData,
  error,
  isFetching,
} = useFetch("https://paradigmapi.pythonanywhere.com/api/clients");

const displayedColumns = [
  "company_name",
  "company_type",
  "location",
  "total_aum",
  "risk_profile",
];

const page = ref(1);
const pageCount = 5;

const filteredClients = computed(() => {
  return clientData.value?.items.filter((client) => {
    const matchesQuery = client.company_name
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    const matchesRiskProfile = riskProfileFilter.value
      ? client.risk_profile.toLowerCase() ===
        riskProfileFilter.value.toLowerCase()
      : true;
    const matchesCompanyType = companyTypeFilter.value
      ? client.company_type.toLowerCase() ===
        companyTypeFilter.value.toLowerCase()
      : true;
    return matchesQuery && matchesRiskProfile && matchesCompanyType;
  });
});

const clientsDataDisplay = computed(() =>
  filteredClients.value.map((client) =>
    displayedColumns.reduce((result, column) => {
      result[column] = client[column];
      return result;
    }, {})
  )
);

const rows = computed(() =>
  clientsDataDisplay.value.slice(
    (page.value - 1) * pageCount,
    page.value * pageCount
  )
);
</script>

<template>
  <div class="dashboard">
    <UContainer :style="{ margin: 0 }">
      <h2 class="dashboard_header">Client Dashboard</h2>

      <!-- Search Bar -->
      <UInput
        v-model="searchQuery"
        class="dashboard__input"
        placeholder="Search for clients"
      />

      <USelect
        v-model="riskProfileFilter"
        :options="['Filter by risk profile', 'Low', 'Moderate', 'High']"
        class="dashboard__filter"
      />

      <USelect
        v-model="companyTypeFilter"
        :options="[
          'Filter by company type',
          'Financial Institution',
          'Investment Advisor',
          'Hedge Fund',
        ]"
        class="dashboard__filter"
      />

      <!-- Display filtered client cards -->
      <div
        class="dashboard__mainTable"
        v-if="!isFetching && filteredClients.length > 0"
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
        :total="clientsDataDisplay.length"
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
  width:66%

.dashboard_header
  font: 2em sans-serif
  padding-bottom: 1rem
  text-align: center

.dashboard__filter
  width: 20%
  margin-top: 1rem
  display: flex
  flex-direction: right
</style>
