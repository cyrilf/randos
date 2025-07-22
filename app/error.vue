<script setup lang="ts">
import type { NuxtError } from "#app";

const { error } = defineProps({
  error: Object as () => NuxtError,
});
</script>

<template>
  <div>
    <app-header />
    <div class="my-16">
      <div class="max-w-520px text-center">
        <h1 class="mb-4 leading-none font-semibold tabular-nums sm:text-[110px]">
          {{ error?.statusCode }}
        </h1>
        <h2 class="mb-2 text-2xl font-semibold sm:text-3xl">{{ error?.statusMessage }}</h2>
        <p class="text-md mb-4 px-2 text-[#64748B]">{{ error?.message }}</p>
        <div class="flex w-full items-center justify-center">
          <a href="/" class="text-sm font-medium underline underline-offset-3 hover:text-[#00DC82]">
            Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
