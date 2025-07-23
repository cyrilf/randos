<script lang="ts" setup>
const { data } = await useFetch("/api/randos", {
  key: "randos",
});

const rando = data.value?.randos.find((r) => r.id === useRoute().params.randoId);

if (!rando) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page Non Trouvée",
  });
}

useSeoMeta({
  title: `${rando?.title} - Randos`,
  ogTitle: `${rando?.title} - Randos`,
  // description: rando?.description || "Découvrez cette randonnée unique",
  // ogDescription: rando?.description || "Découvrez cette randonnée unique",
  description: "Découvrez cette randonnée unique",
  ogDescription: "Découvrez cette randonnée unique",
});

const mapsIframeSrc = computed(() => {
  if (!rando?.maps) return "";

  const coordMatch = rando?.maps.match(/@([^,]+),([^,]+)/);
  if (!coordMatch) {
    console.error("Coordinates not found in the URL.");
  }
  const latitude = coordMatch?.[1];
  const longitude = coordMatch?.[2];

  const placeIdMatch = rando?.maps.match(/!1s([^!]+)/);
  if (!placeIdMatch) {
    console.error("Place ID not found in the URL.");
  }
  const placeId = placeIdMatch?.[1];

  // Construct the embed URL
  if (latitude === undefined || longitude === undefined || placeId === undefined) {
    return "";
  }

  return `https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d187547.6331733288!2d${longitude}!3d${latitude}!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s${placeId}!2sEtang%20De%20Fontargentes!5e0!3m2!1sen!2sfr!4v1753205700748!5m2!1sen!2sfr`;
});

const activeShowMore = ref("");
</script>

<template>
  <div class="my-16">
    <u-container>
      <h1 class="title text-6xl font-bold">{{ rando?.title }}</h1>
      <div class="mt-2">
        <RandoTimeRange class="time" :date-start="rando?.dateStart" :date-end="rando?.dateEnd" />
      </div>
      <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <nuxt-img :src="rando?.cover" class="rando-img w-full rounded-2xl sm:col-span-2" />
        <div
          class="grid grid-cols-1 gap-4 sm:col-span-2 sm:row-start-1 sm:grid-cols-2 md:grid-cols-3 lg:col-span-1 lg:col-start-3 lg:grid-cols-1"
        >
          <UCard variant="subtle" class="rounded-2xl">
            <h2 class="mb-4 text-2xl font-semibold">Informations</h2>
            <div class="flex flex-col gap-1">
              <p class="flex items-center gap-1">
                <span class="inline-flex items-center gap-1"
                  ><UIcon name="i-lucide-clipboard-type" /><strong>Type :</strong></span
                >
                <u-badge :label="rando?.type" variant="subtle" color="neutral" />
              </p>
              <p class="flex items-center gap-1">
                <span class="inline-flex items-center gap-1"
                  ><UIcon name="i-lucide-flag" /><strong> Difficulté :</strong></span
                >
                <u-badge :label="rando?.difficulty" variant="subtle" :color="getDifficultyColor(rando?.difficulty)" />
              </p>
              <p class="flex items-center gap-1">
                <span class="inline-flex items-center gap-1"
                  ><UIcon name="i-lucide-map" /><strong>Distance :</strong></span
                >
                {{ rando?.distance }}
              </p>
              <p class="flex items-center gap-1">
                <span class="inline-flex items-center gap-1"
                  ><UIcon name="i-lucide-clock" /><strong> Durée moyenne :</strong></span
                >
                {{ rando?.duration }}
              </p>
              <p class="flex items-center gap-1">
                <span class="inline-flex items-center gap-1"
                  ><UIcon name="i-lucide-trending-up" /><strong>Dénivelé positif :</strong></span
                >
                {{ rando?.elevationUp }}
              </p>
            </div>
            <UAccordion
              v-model="activeShowMore"
              :items="[{ label: activeShowMore === '0' ? 'Voir moins' : 'Voir plus' }]"
              :ui="{
                trailingIcon: 'ms-0',
                body: 'text-base',
              }"
            >
              <template #body>
                <div class="flex flex-col gap-1">
                  <p class="flex items-center gap-1">
                    <span class="inline-flex items-center gap-1"
                      ><UIcon name="i-lucide-trending-down" /><strong>Dénivelé négatif :</strong></span
                    >
                    {{ rando?.elevationDown }}
                  </p>
                  <p class="flex items-center gap-1">
                    <span class="inline-flex items-center gap-1"
                      ><UIcon name="i-lucide-chevrons-up" /><strong>Point haut :</strong></span
                    >
                    {{ rando?.highPoint }}
                  </p>
                  <p class="flex items-center gap-1">
                    <span class="inline-flex items-center gap-1"
                      ><UIcon name="i-lucide-chevrons-down" /><strong>Point bas :</strong></span
                    >
                    {{ rando?.lowPoint }}
                  </p>
                  <p class="flex flex-wrap items-center gap-1">
                    <span class="inline-flex items-center gap-1"
                      ><UIcon name="i-lucide-map-pin" /><strong>Départ / Arrivée :</strong></span
                    >
                    {{ rando?.coordinates }}
                  </p>
                </div>
              </template>
            </UAccordion>
          </UCard>
          <UCard variant="subtle" class="rounded-2xl">
            <h2 class="mb-4 text-2xl font-semibold">Actions</h2>
            <div class="flex w-fit flex-col gap-4">
              <div>
                <u-button
                  color="primary"
                  variant="soft"
                  block
                  :to="rando?.photos"
                  target="_blank"
                  icon="i-lucide-camera"
                  class="justify-start"
                >
                  <span class="ml-2">Ouvrir Google Photos</span>
                </u-button>
              </div>
              <div>
                <u-button
                  color="primary"
                  variant="soft"
                  block
                  :to="rando?.maps"
                  target="_blank"
                  icon="i-lucide-map"
                  class="justify-start"
                >
                  <span class="ml-2">Ouvrir Google Maps</span>
                </u-button>
              </div>
              <div>
                <u-button
                  color="primary"
                  variant="soft"
                  block
                  :to="rando?.visorando"
                  target="_blank"
                  icon="i-lucide-file-text"
                  class="justify-start"
                >
                  <span class="ml-2">Ouvrir Viso Rando</span>
                </u-button>
              </div>
            </div>
          </UCard>
          <UCard v-if="mapsIframeSrc" variant="subtle" class="rounded-2xl">
            <iframe
              :src="mapsIframeSrc"
              width="350"
              height="300"
              class="mx-auto rounded-2xl"
              style="border: 0"
              allowFullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            />
          </UCard>
        </div>
      </div>
    </u-container>
  </div>
</template>

<style scoped>
.title {
  view-transition-name: title;
}
.time {
  view-transition-name: time;
}
.rando-img {
  view-transition-name: selected-rando;
}
</style>
