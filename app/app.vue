<script setup lang="ts">
useSeoMeta({
  title: "Randos - des randonnées inspirantes",
  ogTitle: "Randos - des randonnées inspirantes",
  description: "Découvre des randonnées inspirantes",
  ogDescription: "Découvre des randonnées inspirantes",
});
</script>

<template>
  <UApp :toaster="{ position: 'top-center' }">
    <AppHeader />
    <NuxtPage />
  </UApp>
</template>
