<script lang="ts" setup>
import type { FormSubmitEvent } from "@nuxt/ui";
import type { Toast } from "@nuxt/ui/runtime/composables/useToast.js";

const state = reactive({
  hookId: "",
});
const isSuccess = ref(false);

async function sendHookRequest(hookId: string) {
  const { error } = await useFetch(`https://api.netlify.com/build_hooks/${hookId}`, { method: "POST" });

  let toastContent: Partial<Toast> = {
    title: "Erreur",
    description: "Le hook id est invalide ou le site est déjà en cours de déploiement.",
    color: "error",
  };

  if (!error.value) {
    isSuccess.value = true;
    toastContent = {
      title: "Succès",
      description: "Le site est en cours de redéploiement.",
      color: "success",
    };
    // Remove the hookId from the state to prevent resubmission
    // and from the query parameters
    state.hookId = "";
    const route = useRoute();
    await navigateTo({ path: route.path, replace: true });
  }

  const toast = useToast();
  toast.add(toastContent);
}

onMounted(async () => {
  const { hookId } = useRoute().query;
  if (hookId) {
    await sendHookRequest(hookId as string);
  }
});

async function onSubmit(event: FormSubmitEvent<{ hookId: string }>) {
  const hookId = event.data.hookId;
  await sendHookRequest(hookId);
}
</script>

<template>
  <div class="my-16 flex flex-col items-center justify-between">
    <h1 class="text-2xl font-bold">Re-déployer le site</h1>
    <UForm v-if="!isSuccess" :state="state" class="mt-8 space-y-4" @submit="onSubmit">
      <UFormField label="Hook id" name="hookId">
        <UInput v-model="state.hookId" type="password" />
      </UFormField>

      <UButton type="submit"> Re-déployer </UButton>
    </UForm>
    <div v-else class="mt-8 text-green-600">Le site est en cours de redéploiement.</div>
  </div>
</template>
