<script lang="ts" setup>
const { data } = await useFetch("/api/randos", {
  key: "randos",
});

const rando = data.value?.randos.find((r) => r.id === useRoute().params.randoId);

useSeoMeta({
  title: `${rando?.title} - Randos`,
  ogTitle: `${rando?.title} - Randos`,
  // description: rando?.description || "Découvrez cette randonnée unique",
  // ogDescription: rando?.description || "Découvrez cette randonnée unique",
  description: "Découvrez cette randonnée unique",
  ogDescription: "Découvrez cette randonnée unique",
});

// Format a float duration (3.35) into a human readble format "3h 21min"
const formattedDuration = computed(() => {
  if (!rando?.duree) return "";
  const hours = Math.floor(rando.duree);
  const minutes = Math.round((rando.duree - hours) * 60);
  return `${hours}h${minutes > 0 ? ` ${minutes}min` : ""}`;
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
</script>

<template>
  <div class="my-16">
    <u-container>
      <h1 class="title text-6xl font-bold">{{ rando?.title }}</h1>
      <div class="mt-2">
        <RandoTimeRange class="time" :date-start="rando?.dateStart" :date-end="rando?.dateEnd" />
      </div>
      <div class="mt-8 grid grid-cols-12 gap-4">
        <nuxt-img :src="rando?.cover" class="rando-img col-span-8 rounded-2xl" />
        <div class="col-span-4 flex flex-col gap-4">
          <UCard variant="subtle" class="rounded-2xl">
            <h2 class="mb-4 text-2xl font-semibold">Informations</h2>
            <p>
              <strong>Type :</strong>
              <u-badge :label="rando?.type" class="ml-1" variant="subtle" color="neutral" />
            </p>
            <p><strong>Durée :</strong> {{ formattedDuration }}</p>
            <p><strong>Distance :</strong> {{ rando?.distance }} km</p>
            <p><strong>Dénivelé :</strong> {{ rando?.denivele }} m</p>
            <p>
              <strong>Difficulté :</strong>
              <u-badge
                :label="rando?.difficulte"
                variant="subtle"
                :color="getDifficultyColor(rando?.difficulte)"
                class="ml-1"
              />
            </p>
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
                  icon="i-heroicons-photo"
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
                  icon="i-heroicons-map"
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
                  :to="rando?.details"
                  target="_blank"
                  icon="i-heroicons-document-text"
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
              class="rounded-2xl"
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
