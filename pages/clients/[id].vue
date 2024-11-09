<script setup>
const route = useRoute();

const clientId = parseInt(route.params.id);

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
    label: "Full Ticker"
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
    sortable: true,
  },
  {
    key: "commission_amount",
    label: "Commission Amt",
    sortable: true,
  },
]

const page = ref(1);
const pageCount = 5;

const rows = computed(() =>
  clientTradeData.value.slice(
    (page.value - 1) * pageCount,
    page.value * pageCount
  )
);

</script>

<template>
  <UContainer style="margin-top: 2rem">
    <UCard>
      <h1>Trades of Client with ID - {{ clientTradeData[0].client }}</h1>
      <!-- Display filtered client cards -->
      <div
        class="dashboard__mainTable"
        v-if="!isFetching && clientTradeData.length > 0"
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
        :total="clientTradeData.length"
      />
    </UCard>
  </UContainer>
</template>
