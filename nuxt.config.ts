// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  modules: ["@vueuse/nuxt", "@nuxtjs/tailwindcss", "@nuxtjs/google-fonts", "nuxt-icon"],
  css: ["vuetify/lib/styles/main.sass", "mdi/css/materialdesignicons.min.css"],
  build: {
    transpile: ["vuetify"],
  },
  vite: {
    define: {
      "process.env.DEBUG": false,
    },
  },
  runtimeConfig: {
    public: {
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY || "",
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN || "",
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || "",
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET || "",
      FIREBASE_MESSAGE_SENDER: process.env.FIREBASE_MESSAGE_SENDER || "",
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID || "",
      USE_EMULATOR: process.env.USE_EMULATOR || "",
      OPEN_WEATHER_KEY: process.env.OPEN_WEATHER_KEY || "",
      CITY_ID: process.env.CITY_ID || "",
    },
  },
  googleFonts: {
    display: "swap",
    families: {
      "M+PLUS+1": true,
      Lato: [400],
      Raleway: {
        wght: [400],
        ital: [400],
      },
    },
  },
});
