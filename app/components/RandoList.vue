<script lang="ts" setup>
import { UBadge } from "#components";
import type { TableColumn, TableRow } from "@nuxt/ui";

type Rando = {
  id: string;
  title: string;
  dateStart?: string;
  dateEnd?: string;
  description?: string;
  difficulty?: string;
  distance?: string;
  duration?: string;
};

const props = defineProps<{
  randos: Rando[];
}>();

const currentView = ref("gallery");
function switchView(view: string) {
  currentView.value = view;
}

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const columns: TableColumn<Rando>[] = [
  {
    accessorKey: "title",
    header: "Title",
    meta: {
      class: {
        td: "max-w-[400px] overflow-auto whitespace-normal line-clamp-1",
      },
    },
  },
  {
    accessorKey: "dateStart",
    header: "Date",
    cell: ({ row }) => {
      const dateStart = dateFormatter.format(new Date(row.getValue("dateStart")));
      const dateEnd = props.randos?.[+row.id]?.dateEnd;
      const dateEndFormatted = dateEnd ? dateFormatter.format(new Date(dateEnd)) : null;
      const isSimilarDate = dateStart === dateEndFormatted;
      return `${dateStart}${!isSimilarDate && dateEndFormatted ? ` - ${dateEndFormatted}` : ""}`;
    },
  },
  {
    accessorKey: "distance",
    header: "Distance (km)",
  },
  {
    accessorKey: "duration",
    header: "Duration (h)",
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
    cell: ({ row }) => {
      const color =
        {
          Facile: "success" as const,
          Moyenne: "warning" as const,
          Difficile: "error" as const,
        }[row.getValue("difficulty") as string] || "neutral";
      return h(
        UBadge,
        {
          color,
          class: "capitalize",
          variant: "subtle",
        },
        () => row.getValue("difficulty"),
      );
    },
  },
  {
    accessorKey: "elevationUp",
    header: "Elevation up (m)",
  },
  {
    accessorKey: "elevationDown",
    header: "Elevation down (m)",
  },
  {
    accessorKey: "highPoint",
    header: "High point (m)",
  },
  {
    accessorKey: "lowPoint",
    header: "Low point (m)",
  },
];

// TODO: improve this to handle middle click and ctrl+click events
// also improve hover effect
function onSelect(row: TableRow<Rando>) {
  const router = useRouter();
  router.push(`/randos/${row.original.id}`);
}
</script>

<template>
  <div>
    <div class="flex gap-2">
      <UButton
        :color="currentView === 'gallery' ? 'neutral' : 'neutral'"
        :variant="currentView === 'gallery' ? 'subtle' : 'ghost'"
        icon="lucide:image"
        size="lg"
        aria-label="Gallery View"
        @click="switchView('gallery')"
        >Gallerie</UButton
      >
      <UButton
        :color="currentView === 'table' ? 'neutral' : 'neutral'"
        :variant="currentView === 'table' ? 'subtle' : 'ghost'"
        icon="lucide:table"
        size="lg"
        aria-label="Table View"
        @click="switchView('table')"
        >Table</UButton
      >
    </div>
    <div class="mt-4">
      <div
        v-if="currentView === 'gallery'"
        class="flex flex-col gap-8 sm:grid sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-16"
      >
        <RandoCard v-for="rando in randos" :key="rando.id" :rando />
      </div>
      <div v-else-if="currentView === 'table'">
        <UTable :data="randos" :columns :ui="{ tr: 'cursor-pointer' }" @select="onSelect" />
      </div>
    </div>
  </div>
</template>
