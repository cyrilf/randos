<script lang="ts" setup>
import type { FormSubmitEvent } from "@nuxt/ui";
import type { Toast } from "@nuxt/ui/runtime/composables/useToast.js";

const PROVIDERS = [
  {
    id: "github",
    name: "Github",
    label: "Github token",
    icon: "i-lucide-github",
  },
  {
    id: "netlify",
    name: "Netlify",
    label: "Netlify hook id",
    icon: "i-lucide-diamond",
  },
];

const API_CONFIG = {
  github: {
    method: "POST" as const,
    url: "https://api.github.com/repos/cyrilf/randos/actions/workflows/deploy.yml/dispatches",
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: { ref: "main" },
  },
  netlify: {
    method: "POST" as const,
    url: "https://api.netlify.com/build_hooks",
  },
};

// Types
type Provider = {
  id: string;
  name: string;
  label: string;
  icon: string;
  token: string;
  isFetching: boolean;
  hasSucceeded: boolean;
};

// State
const providers = ref<Provider[]>(
  PROVIDERS.map((provider) => ({
    ...provider,
    token: "",
    isFetching: false,
    hasSucceeded: false,
  })),
);

const isFetching = computed(() => providers.value.some((p) => p.isFetching));
const isFormSent = ref(false);

function notify({ name, success }: { name: string; success: boolean }) {
  const toastContent: Partial<Toast> = success
    ? {
        title: "Succès",
        icon: "i-lucide-check-circle",
        description: `${name} est en cours de redéploiement.`,
        color: "success",
      }
    : {
        title: "Erreur",
        icon: "i-lucide-alert-triangle",
        description: `Le token pour ${name} est invalide ou le site est déjà en cours de déploiement.`,
        color: "error",
      };

  const toast = useToast();
  toast.add(toastContent);
}

async function sendRequest(provider: Provider) {
  const config = API_CONFIG[provider.id as keyof typeof API_CONFIG];
  provider.isFetching = true;

  const url = provider.id === "github" ? config.url : `${config.url}/${provider.token}`;
  const fetchOptions: { method: "GET" | "POST"; headers?: Record<string, string>; body?: Record<string, string> } = {
    method: config.method,
  };

  if (provider.id === "github") {
    const githubConfig = config as typeof API_CONFIG.github;
    fetchOptions.headers = {
      ...githubConfig.headers,
      Authorization: `Bearer ${provider.token}`,
    };
    fetchOptions.body = githubConfig.body;
  }

  try {
    await $fetch(url, fetchOptions);

    provider.hasSucceeded = true;
  } catch {
    provider.hasSucceeded = false;
  } finally {
    notify({ name: provider.name, success: provider.hasSucceeded });
    provider.isFetching = false;
    isFormSent.value = true;
  }
}

async function sendRequests(githubToken?: string, netlifyToken?: string) {
  const router = useRouter();
  router.replace({ query: undefined });

  if (!githubToken && !netlifyToken) {
    const toast = useToast();
    toast.add({
      title: "Données manquantes",
      icon: "i-lucide-alert-triangle",
      description: "Un token Github et/ou un hook id Netlify est requis",
      color: "warning",
    });
    return;
  }

  if (githubToken) {
    const githubProvider = providers.value.find((p) => p.id === "github")!;
    githubProvider.token = githubToken;
    await sendRequest(githubProvider);
  }

  if (netlifyToken) {
    const netlifyProvider = providers.value.find((p) => p.id === "netlify")!;
    netlifyProvider.token = netlifyToken;
    await sendRequest(netlifyProvider);
  }
}

const route = useRoute();
const githubToken = computed(() => route.query.githubToken as string | undefined);
const netlifyToken = computed(() => route.query.netlifyToken as string | undefined);
const showLoadingScreen = computed(() => !!githubToken.value || !!netlifyToken.value);

onMounted(async () => {
  if (githubToken.value || netlifyToken.value) {
    await sendRequests(githubToken.value, netlifyToken.value);
  }
});

async function onSubmit(event: FormSubmitEvent<{ githubToken: string; netlifyToken: string }>) {
  const { githubToken, netlifyToken } = event.data;
  await sendRequests(githubToken, netlifyToken);
}

function resetForm() {
  isFormSent.value = false;
  providers.value.forEach((provider) => {
    provider.token = "";
    provider.isFetching = false;
    provider.hasSucceeded = false;
  });
}

// UI labels
const getStatusText = (provider: Provider) => (provider.hasSucceeded ? "Succès" : "Échec");

const getStatusColor = (provider: Provider) => {
  if (provider.isFetching) return "neutral";

  return provider.hasSucceeded ? "success" : "error";
};

const getStatusDescription = (provider: Provider) => {
  if (provider.isFetching) return "En cours...";
  if (provider.hasSucceeded) return "Nice! Tu pourras vérifier le site dans quelques minutes.";
  return provider.token?.length
    ? "Le token est invalide ou le site est déjà en cours de déploiement."
    : "Le token est manquant.";
};
</script>

<template>
  <div class="my-16">
    <UCard variant="subtle" color="primary" class="mx-auto w-fit min-w-1/4 p-8">
      <h1 class="text-2xl font-bold">Actualiser les données du site</h1>
      <USkeleton v-if="showLoadingScreen" class="mt-4 h-44" />
      <template v-else>
        <UForm v-if="!isFormSent" :disabled="isFetching" :state="{}" class="mt-8 space-y-4" @submit="onSubmit">
          <UFormField v-for="provider in providers" :key="provider.id" :name="`${provider.id}Token`">
            <template #label>
              <div class="flex items-center gap-1">
                <UButton :icon="provider.icon" variant="soft" class="pointer-events-none" />
                {{ provider.label }}
              </div>
            </template>
            <UInput v-model="provider.token" type="password" />
          </UFormField>
          <UButton type="submit">Re-déployer</UButton>
        </UForm>
        <div v-else class="mt-8 rounded-lg border border-neutral-300 p-4">
          <UButton variant="outline" color="neutral" class="my-2" icon="lucide:arrow-left" @click="resetForm">
            Reset
          </UButton>
          <div class="text-xl">Déploiements en cours</div>
          <ul class="mt-4 flex flex-col gap-4">
            <li v-for="provider in providers" :key="provider.id">
              <UAlert
                :icon="provider.icon"
                :title="`${provider.name} - ${getStatusText(provider)}`"
                :color="getStatusColor(provider)"
                variant="subtle"
                :description="getStatusDescription(provider)"
              />
            </li>
          </ul>
        </div>
      </template>
    </UCard>
  </div>
</template>
