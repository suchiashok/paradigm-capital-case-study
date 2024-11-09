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
  {
    key: "id",
    label: "ID",
  },
  {
    key: "company_name",
    label: "Company Name",
    sortable: true,
  },
  {
    key: "company_type",
    label: "Type",
    sortable: true,
  },
  {
    key: "location",
    label: "Location",
  },
  {
    key: "total_aum",
    label: "Total AUM",
  },
  {
    key: "risk_profile",
    label: "Risk Profile",
  },
  {
    key: "actions",
    label: "Actions",
    sortable: false,
  },
];

const actions = [
  [
    {
      key: "view",
      label: "Action",
      icon: "oi:account-login",
    },
  ],
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

// const clientsDataDisplay = computed(() =>
//   filteredClients.value.map((client) =>
//     displayedColumns
//       .map((e) => e.key)
//       .reduce((result, column) => {
//         result[column] = client[column];
//         return result;
//       }, {})
//   )
// );

const rows = computed(() =>
  filteredClients.value.slice(
    (page.value - 1) * pageCount,
    page.value * pageCount
  )
);
</script>

<template>
  <div class="dashboard">
    <UContainer :style="{ margin: 0 }">
      <h2 class="dashboard__header">Client Dashboard</h2>

      <!-- Search Bar -->
      <UInput
        v-model="searchQuery"
        class="dashboard__input"
        placeholder="Search for clients"
      />

      <USelect
        v-model="riskProfileFilter"
        placeholder="Filter by risk profile"
        :options="['Low', 'Moderate', 'High']"
        class="dashboard__filter"
      />

      <USelect
        v-model="companyTypeFilter"
        placeholder="Filter by company type"
        :options="['Financial Institution', 'Investment Advisor', 'Hedge Fund']"
        class="dashboard__filter"
      />

      <!-- Display filtered client cards -->
      <div
        class="dashboard__mainTable"
        v-if="!isFetching && filteredClients.length > 0"
      >
        <UTable :columns="displayedColumns" :rows="rows" class="w-full">
          <template #actions-data="{ row }">
            <UButton
              @click="() => $router.push(`/clients/${row.id}`)"
              v-if="true"
              icon="oi:account-login"
              color="emerald"
              variant="outline"
            />
          </template>
        </UTable>
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
        :total="filteredClients.length"
      />
    </UContainer>
  </div>
</template>

<style lang="sass" scoped>
.dashboard
  border: 2px solid white
  padding: 20px
  width: 66%

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
