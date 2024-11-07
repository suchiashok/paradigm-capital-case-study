<script setup>
import { useFetch } from "#app";

const { data: clientData, error } = useFetch(
  () => `https://paradigmapi.pythonanywhere.com/api/clients/8`
);

console.log(clientData);
</script>

<template>
  <div>
    <h2>Client Data</h2>
    <div v-if="clientData">
      <p>Company Name: {{ clientData.company_name }}</p>
      <p>Company Type: {{ clientData.company_type }}</p>
      <p>Location: {{ clientData.location }}</p>
    </div>

    <div v-else-if="error">
      <p>Something went wrong: {{ error.message }}</p>
    </div>
    <div v-else>
      <p>Loading</p>
    </div>
  </div>
  </template>
