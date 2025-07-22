<script lang="ts" setup>
const { rando } = defineProps<{
  rando: {
    id: string;
    title: string;
    dateStart?: string;
    dateEnd?: string;
    type?: string;
    cover?: string;
    difficulte?: string;
  };
}>();

const active = useState();
</script>

<template>
  <article
    class="group/blog-post hover:bg-elevated/50 relative flex flex-col overflow-hidden rounded-lg transition"
    :class="{
      'active-article': active === rando.id,
    }"
    @click="active = rando.id"
  >
    <div
      class="pointer-events-none relative aspect-[16/9] w-full overflow-hidden rounded-lg transition-all group-hover/blog-post:rounded-b-none"
    >
      <nuxt-img
        :alt="rando.title"
        class="h-full w-full transform bg-neutral-50 object-cover object-top transition-transform duration-200 group-hover/blog-post:scale-110"
        :src="rando.cover"
      />
    </div>
    <div class="flex min-w-0 flex-1 flex-col px-2 py-4">
      <NuxtLink
        :to="`/randos/${rando.id}`"
        class="peer absolute inset-0 focus:outline-none"
        tabindex="-1"
        :aria-label="`Voir la rando ${rando.title}`"
      />

      <time class="text-toned text-sm"
        >{{
          !rando.dateStart
            ? undefined
            : new Date(rando.dateStart).toLocaleString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
        }}
      </time>
      <h2 class="text-highlighted text-xl font-semibold text-pretty">
        {{ rando.title }}
      </h2>
    </div>
  </article>
</template>
<style scope>
.active-article h2 {
  view-transition-name: title;
}
.active-article time {
  view-transition-name: time;
}
.active-article img {
  view-transition-name: selected-rando;
  contain: layout;
}
</style>
