<script lang="ts" setup>
import type { FormSubmitEvent } from "@nuxt/ui";
import type { Toast } from "@nuxt/ui/runtime/composables/useToast.js";

const state = reactive({
  accessToken: "",
});

const isSuccess = ref(false);

async function sendHookRequest(accessToken: string) {
  try {
    await $fetch(`https://api.github.com/repos/cyrilf/randos/actions/workflows/deploy.yml/dispatches`, {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${accessToken}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: {
        ref: "main",
      },
    });
    isSuccess.value = true;
  } catch {
    isSuccess.value = false;
  } finally {
    let toastContent: Partial<Toast> = {
      title: "Erreur",
      description: "L'access token est invalide ou le site est déjà en cours de déploiement.",
      color: "error",
    };

    if (isSuccess.value) {
      toastContent = {
        title: "Succès",
        description: "Le site est en cours de redéploiement.",
        color: "success",
      };
    }

    const toast = useToast();
    toast.add(toastContent);

    // Remove the accessToken from the state to prevent resubmission
    // and from the query parameters
    state.accessToken = "";
    const route = useRoute();
    await navigateTo({ path: route.path, replace: true });
  }
}

onMounted(async () => {
  const { accessToken } = useRoute().query;
  if (accessToken) {
    await sendHookRequest(accessToken as string);
  }
});

async function onSubmit(event: FormSubmitEvent<{ accessToken: string }>) {
  const accessToken = event.data.accessToken;
  await sendHookRequest(accessToken);
}
</script>

<template>
  <div class="my-16">
    <UCard variant="subtle" color="primary" class="mx-auto w-fit p-8">
      <h1 class="text-2xl font-bold">Re-déployer le site</h1>
      <UForm v-if="!isSuccess" :state class="mt-8 space-y-4" @submit="onSubmit">
        <UFormField label="Access token" name="accessToken">
          <UInput v-model="state.accessToken" type="password" />
        </UFormField>

        <UButton type="submit"> Re-déployer </UButton>
      </UForm>
      <div v-else class="mt-8 text-green-600">Le site est en cours de redéploiement.</div>
    </UCard>
  </div>
</template>
