<script lang="ts" setup>
definePageMeta({
  middleware: ["auth"],
});
const { listStore, docsRef } = useFirebase();
await listStore();
console.log(docsRef.value);
</script>

<template>
  <div></div>
</template>

<style scoped></style>
