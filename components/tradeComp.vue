<script setup>
import { ref, computed } from "vue";
import { useFetch } from "#app";

const searchQuery = ref("");

const {
  data: tradeData,
  error,
  isFetching,
} = useFetch("https://paradigmapi.pythonanywhere.com/api/trades");

const filteredTrades = computed(() => {
  if (!tradeData.value) return []; // No clients available
  if (!searchQuery.value) return []; // No search query entered, show nothing
  return tradeData.value?.items.filter((trade) =>
    trade.ticker.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
</script>

<template>
  <div>
    <h2>Trade Summary Section</h2>

    <!-- Search Bar -->
    <input
      type="text"
      v-model="searchQuery"
      placeholder="Search by ticker"
    />

    <!-- If no search query is entered, show the search message -->
    <div v-if="!searchQuery && !isFetching">
      <p>Search for trades</p>
    </div>

    <!-- Display filtered client cards -->
    <div v-if="!isFetching && filteredTrades.length > 0">
      <div
        class="trade-card"
        v-for="(trade, index) in filteredTrades"
        :key="index"
      >
        <h3>{{ trade.ticker }}</h3>
        <p><strong>Full Ticker:</strong> {{ trade.full_ticker }}</p>
        <p><strong>Quantity</strong> {{ trade.quantity }}</p>
        <p><strong>Price</strong> {{ trade.price }}</p>
        <p><strong>Date</strong> {{ trade.date }}</p>
      </div>
    </div>

    <!-- Display error message if there's an error -->
    <div v-else-if="error">
      <p>Something went wrong: {{ error.message }}</p>
    </div>

    <!-- Loading state -->
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>
