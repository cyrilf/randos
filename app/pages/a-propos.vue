<template>
  <u-container class="my-16">
    <UCard variant="subtle" color="primary" class="mx-auto w-fit min-w-1/4 p-8">
      <h1 class="text-2xl font-bold">À propos de Randos</h1>

      <p class="mt-8">Randos est un site conçu pour afficher des randonnées depuis Notion.</p>
      <p class="mt-4">Les pages détailées sont enrichies depuis Viso Rando.</p>
      <p class="mt-4">Ce site est une version démo, la version complète est pour le moment non déployée.</p>
      <p class="mt-4">
        Le site est entiérement open-source et disponible sur
        <UButton to="https://github.com/cyrilf/randos" variant="link"><u-icon name="lucide-github" /> Github</UButton>.
      </p>
      <p class="mt-4"></p>
      <img src="/randos.png" alt="Logo de Randos" class="mx-auto mt-16" />
    </UCard>
  </u-container>
</template>
