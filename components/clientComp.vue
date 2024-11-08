<script setup>
import { ref, computed } from "vue";
import { useFetch } from "#app";

const searchQuery = ref("");

const {
  data: clientData,
  error,
  isFetching,
} = useFetch("https://paradigmapi.pythonanywhere.com/api/clients");

const filteredClients = computed(() => {
  if (!clientData.value) return []; // No clients available
  if (!searchQuery.value) return []; // No search query entered, show nothing
  return clientData.value?.items.filter((client) =>
    client.company_name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
</script>

<template>
  <div>
    <UContainer>
      <h2>Client Summary Section</h2>

      <!-- Search Bar -->
      <UInput v-model="searchQuery" />

      <!-- If no search query is entered, show the search message -->
      <div v-if="!searchQuery && !isFetching">
        <p>Search for clients</p>
      </div>

      <!-- Display filtered client cards -->
      <div v-if="!isFetching && filteredClients.length > 0">
        <UTable :rows="filteredClients" />
      </div>

      <!-- Display error message if there's an error -->
      <div v-else-if="error">
        <p>Something went wrong: {{ error.message }}</p>
      </div>

      <!-- Loading state -->
      <div v-else>
        <p>Loading...</p>
      </div>
    </UContainer>
  </div>
</template>
