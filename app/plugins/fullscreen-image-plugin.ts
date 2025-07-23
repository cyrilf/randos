import { fullscreenImagePlugin } from "vue-3-fullscreen-image-directive-plugin";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(fullscreenImagePlugin);
});
