<script setup>
import { ref, computed } from "vue";
import { useFetch, useRouter } from "#app";
import { Doughnut } from "vue-chartjs";

const searchQuery = ref("");
const riskProfileFilter = ref("");
const companyTypeFilter = ref("");

const router = useRouter();
const navigateToClient = (clientId) => {
  router.push(`/clients/${clientId}`);
};

const {
  data: clientData,
  error,
  isFetching,
} = await useFetch("/api/clients/list");

const clientChartdata = clientData?.value?.items || [];

function getClientCountByRiskProfile(profile) {
  return clientChartdata.filter((client) => client.risk_profile === profile)
    .length;
}

function getClientCountByTier(profile) {
  return clientChartdata.filter((client) => client.tier === profile).length;
}

const riskChartData = {
  labels: ["Low", "Moderate", "High"],
  datasets: [
    {
      backgroundColor: ["#00C58E", "#2C3E50", "#88E4C4"],
      data: [
        getClientCountByRiskProfile("Low"),
        getClientCountByRiskProfile("Moderate"),
        getClientCountByRiskProfile("High"),
      ],
    },
  ],
};

const tierChartData = {
  labels: ["1", "2", "3", "4", "5"],
  datasets: [
    {
      backgroundColor: ["#007A6E", "#38A169", "#1A202C", "#81E6D9", "#4A5568"],
      data: [
        getClientCountByTier(1),
        getClientCountByTier(2),
        getClientCountByTier(3),
        getClientCountByTier(4),
        getClientCountByTier(5),
      ],
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
};

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
    sortable: true,
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

const rows = computed(() =>
  filteredClients.value.slice(
    (page.value - 1) * pageCount,
    page.value * pageCount
  )
);

const resetFilters = () => {
  searchQuery.value = "";
  riskProfileFilter.value = "";
  companyTypeFilter.value = "";
};
</script>

<template>
  <div class="dashboard">
    <UContainer :style="{ margin: 0 }">
      <h2 class="dashboard__header">Client Dashboard</h2>

      <div class="dashboard__content">
        <div class="dashboard__tableSection">
          <!-- Filters -->
          <UCard class="dashboard__tableCard">
            <div class="dashboard__filters">
              <UInput
                v-model="searchQuery"
                class="dashboard__filter"
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
                :options="[
                  'Financial Institution',
                  'Investment Advisor',
                  'Hedge Fund',
                ]"
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
            v-if="!isFetching && filteredClients.length > 0"
          >
            <UTable :columns="displayedColumns" :rows="rows" class="w-full">
              <template #actions-data="{ row }">
                <UButton
                  @click="navigateToClient(row.id)"
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
            <p>No Data</p>
          </div>

          <!-- Pagination-->
          <UPagination
            v-model="page"
            :page-count="pageCount"
            :total="filteredClients.length"
          />
        </div>

        <div class="dashboard__visualizationSection">
          <div class="dashboard__visualization">
            <h3>Risk Profile Distribution</h3>
            <UContainer :style="{ margin: 0 }">
              <Doughnut :data="riskChartData" :options="options" />
            </UContainer>
          </div>
          <div class="dashboard__visualization">
            <h3>Client Tier Analysis</h3>
            <UContainer :style="{ margin: 0 }">
              <Doughnut :data="tierChartData" :options="options" />
            </UContainer>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<style lang="sass" scoped>
.dashboard
  border: 1px solid #00DC82
  border-radius: 12px
  padding: 20px
  height: 100vh
  width: 100vw
  overflow-y: auto
  box-sizing: border-box

.dashboard__content
  display: flex
  gap: 2rem
  align-items: flex-start

.dashboard__tableSection
  flex: 3
  margin-right: 2rem

.dashboard__visualizationSection
  flex: 2
  display: flex
  gap: 2rem
  flex-direction: column

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

.dashboard__visualization
  text-align: center
  width: 100%
</style>
