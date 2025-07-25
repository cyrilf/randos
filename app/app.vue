<script setup lang="ts">
useSeoMeta({
  title: "Randos - tes randonnées uniques",
  ogTitle: "Randos - tes randonnées uniques",
  description: "Met en valeur tes randonnées",
  ogDescription: "Met en valeur tes randonnées",
});
</script>

<template>
  <UApp :toaster="{ position: 'top-center' }">
    <AppHeader />
    <NuxtPage />
  </UApp>
</template>
