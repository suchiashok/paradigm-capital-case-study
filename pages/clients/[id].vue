<script setup>
const route = useRoute();

const clientId = parseInt(route.params.id);

const { data: trades } = useFetch(
  `https://paradigmapi.pythonanywhere.com/api/clients/${clientId}/trades`
);
</script>

<template>
  <UContainer style="margin-top: 2rem">
    <UCard>
      <h1>Trades</h1>
      <UTable v-if="trades" :rows="trades" />
    </UCard>
  </UContainer>
</template>
