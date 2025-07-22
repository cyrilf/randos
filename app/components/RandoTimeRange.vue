<script lang="ts" setup>
const { dateStart = undefined, dateEnd = undefined } = defineProps<{
  dateStart?: string;
  dateEnd?: string;
}>();

const getLocaleDate = (date: string | undefined, withTime: boolean = false) => {
  if (!date) return "";
  return new Date(date).toLocaleString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: withTime ? "2-digit" : undefined,
    minute: withTime ? "2-digit" : undefined,
  });
};
const getLocaleTime = (date: string | undefined) => {
  if (!date) return "";
  return new Date(date).toLocaleString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const isDateEndDifferent = computed(
  () => new Date(dateStart || 0).toDateString() !== new Date(dateEnd || 0).toDateString(),
);
const dateStartFormatted = getLocaleDate(dateStart);
const timeStart = getLocaleTime(dateStart);
const dateEndFormatted = isDateEndDifferent.value
  ? getLocaleDate(dateEnd, isDateEndDifferent.value)
  : getLocaleTime(dateEnd);
</script>
<template>
  <span class="text-muted text-sm">
    <template v-if="dateStart">
      {{ isDateEndDifferent ? "Du" : "Le" }}
      <time :datetime="dateStart">
        {{ dateStartFormatted }} {{ isDateEndDifferent ? "à" : "de" }}
        {{ timeStart }}
      </time>
      <template v-if="dateEnd">
        <span>
          {{ isDateEndDifferent ? " au " : " à " }}
        </span>
        <time :datetime="dateEnd">
          {{ dateEndFormatted }}
        </time>
      </template>
    </template>
  </span>
</template>
