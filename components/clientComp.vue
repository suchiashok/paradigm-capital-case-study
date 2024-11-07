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
    <h2>Client Summary Section</h2>

    <!-- Search Bar -->
    <input
      type="text"
      v-model="searchQuery"
      placeholder="Search by Company Name"
    />

    <!-- If no search query is entered, show the search message -->
    <div v-if="!searchQuery && !isFetching">
      <p>Search for clients</p>
    </div>

    <!-- Display filtered client cards -->
    <div v-if="!isFetching && filteredClients.length > 0">
      <div
        class="client-card"
        v-for="(client, index) in filteredClients"
        :key="index"
      >
        <h3>{{ client.company_name }}</h3>
        <p><strong>Type of the Company:</strong> {{ client.company_type }}</p>
        <p><strong>Location:</strong> {{ client.location }}</p>
        <p><strong>Total AUM:</strong> {{ client.total_aum }}</p>
        <p><strong>Risk Profile:</strong> {{ client.risk_profile }}</p>
        <h4>Contact Details</h4>
        <p>
          <strong>Name & Title:</strong> {{ client.contact_name }} -
          {{ client.title }}
        </p>
        <p><strong>Phone:</strong>{{ client.contact_phone }}</p>
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
