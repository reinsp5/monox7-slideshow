<script lang="ts" setup>
import { useIntervalFn } from "@vueuse/core";
import { DocumentData, onSnapshot, QuerySnapshot } from "firebase/firestore";
definePageMeta({
  layout: "view",
});

const index = ref(0);
const snapshots = ref<QuerySnapshot<DocumentData>>();
const { listStorage, urlList, store, collectionRef } = useFirebase();
// Store 一覧
const listenDoc = onSnapshot(
  collectionRef,
  (res) => {
    if (res.docs.length - 1 < index.value) index.value = res.docs.length;
    snapshots.value = res;
  },
  (err) => {
    console.error(err);
  }
);

onMounted(async () => {
  useIntervalFn(async () => {
    if (index.value < snapshots.value?.docs.length - 1) {
      index.value++;
    } else {
      index.value = 0;
    }
    console.log(index.value);
  }, 300000);
});
</script>

<template>
  <div class="grid">
    <v-img
      v-for="(snapshot, i) in snapshots?.docs"
      :key="snapshot.id"
      :src="snapshot.data().url"
      :class="{ 'opacity-0': i != index }"
      class="transition-opacity duration-500"
      alt=""
    />
  </div>
</template>

<style scoped>
.grid > * {
  grid-column: 1 / -1;
  grid-row: 1 / -1;
}
</style>
