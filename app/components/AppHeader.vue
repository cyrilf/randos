<script lang="ts" setup>
import type { NavigationMenuItem } from "@nuxt/ui";

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: "Accueil",
    to: "/",
    icon: "i-lucide-home",
  },
  {
    label: "À propos",
    to: "/a-propos",
    icon: "i-lucide-info",
  },
]);
</script>

<template>
  <UHeader>
    <template #title> <AppLogo class="w-12" /></template>

    <UNavigationMenu :items="items" />

    <template #right>
      <UColorModeButton />
    </template>
  </UHeader>
</template>
