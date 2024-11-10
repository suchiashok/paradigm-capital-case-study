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
  <UContainer class="home__container">
    <UCard bordered shadow="xl" class="home__card">
      <div class="card__inner">
        <div class="card__content">
          <div class="card__title-section">
            <h2 class="card__title">Paradigm Capital Case Study</h2>
          </div>
          <div class="card__buttons-section">
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
        <div class="card__footer">
          <p class="footer__text">
            Developed by Suchita Ashok |
            <a href="mailto:suchiashok.97@gmail.com">suchiashok.97@gmail.com</a>
          </p>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>

<style lang="sass" scoped>
.home__container
    display: flex
    justify-content: center
    align-items: center
    min-height: 100vh
    background-color: #121212

.home__card
    display: flex
    justify-content: center
    align-items: center
    width: 100%
    max-width: 1000px
    min-height: 31.25rem
    background-color: #1e1e1e
    color: #ffffff
    border-radius: 16px
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.4)

.card__inner
    display: flex
    flex-direction: column
    align-items: center
    width: 100%
    padding: 20px
    height: 100%

.card__content
    display: flex
    flex-direction: row
    width: 100%

.card__title-section
    flex: 1
    display: flex
    align-items: center
    justify-content: center
    border-right: 1px solid #333

.card__title
    font-size: 1.8em
    font-weight: bold

.card__buttons-section
    flex: 1
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    gap: 20px
    padding-left: 20px

.card__footer
    position: absolute
    bottom: 0
    width: 100%
    text-align: center
    font-size: 0.9em
    color: #555
    padding: 30px 0

.footer__text a
    color: inherit
    text-decoration: none
    font-weight: bold
</style>
