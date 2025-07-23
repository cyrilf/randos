<script setup lang="ts">
import { UButton } from "#components";

const colorMode = useColorMode();

const isDark = computed(() => colorMode.value === "dark");

function toggleColorMode() {
  colorMode.preference = isDark.value ? "light" : "dark";
}
</script>

<template>
  <UButton
    type="button"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    color="neutral"
    variant="ghost"
    :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
    @click="toggleColorMode"
  />
</template>
