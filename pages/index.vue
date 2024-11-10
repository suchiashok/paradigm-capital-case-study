<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goToClients = () => {
  router.push("/clients");
};

const goToTrades = () => {
  router.push("/trades");
};
</script>

<template>
  <UContainer class="home-container">
    <UCard bordered shadow="xl" class="home-card">
      <div class="card-content">
        <div class="card-title-section">
          <h2 class="card-title">Paradigm Capital Case Study</h2>
        </div>
        <div class="card-buttons-section">
          <UButton
            icon="i-lucide-arrow-right"
            size="xl"
            variant="outline"
            @click="goToClients"
          >
            Clients
          </UButton>
          <UButton
            icon="i-lucide-arrow-right"
            size="xl"
            variant="solid"
            @click="goToTrades"
          >
            Trades
          </UButton>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>

<style lang="sass" scoped>
.home-container
    display: flex
    justify-content: center
    align-items: center
    min-height: 100vh
    background-color: #121212

.home-card
    display: flex
    justify-content: center
    align-items: center
    width: 100%
    max-width: 1000px
    min-height: 31.25rem
    background-color: #1e1e1e
    color: #ffffff
    padding: 40px
    border-radius: 16px
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.4)

.card-content
    display: flex
    flex-direction: row
    width: 100%

.card-title-section
    flex: 1
    display: flex
    align-items: center
    justify-content: center
    border-right: 1px solid #333

.card-title
    font-size: 1.8em
    font-weight: bold

.card-buttons-section
    flex: 1
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    gap: 20px
    padding-left: 20px
</style>
