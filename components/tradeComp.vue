<script setup>
import { useFetch } from "#app";

const { data: tradeData, error } = useFetch(
  () => `https://paradigmapi.pythonanywhere.com/api/trade/8`
);
</script>

<template>
  <div>
    <h2>Trade Data</h2>
    <div v-if="tradeData">
      <p>Ticker: {{ tradeData.ticker }}</p>
      <p>Full Ticker: {{ tradeData.full_ticker }}</p>
      <p>Quantity: {{ tradeData.quantity }}</p>
    </div>

    <div v-else-if="error">
      <p>Something went wrong: {{ error.message }}</p>
    </div>
    <div v-else>
      <p>Loading</p>
    </div>
  </div>
</template>
