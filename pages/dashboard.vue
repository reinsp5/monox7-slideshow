<script lang="ts" setup>
definePageMeta({
  middleware: ["auth"],
});

const path = computed(() => {
  if (typeof files.value === "undefined") return;
  return "images/" + files.value[0].name;
});
const files = ref<File[]>();

const upload = () => {
  if (typeof files.value === "undefined") return;
  let name = files.value[0].name.slice(0, files.value[0].name.lastIndexOf(".")); // 拡張子以外を選択
  useFirebase().uploadFile(name, files.value[0]);
};
</script>

<template>
  <v-card max-width="600" class="pa-5 w-full">
    <v-form @submit.prevent="upload">
      <v-file-input v-model="files" accept="image/*" label="ファイル" />
      <v-btn type="submit" variant="outlined">アップロード</v-btn>
    </v-form>
  </v-card>
</template>

<style scoped></style>
