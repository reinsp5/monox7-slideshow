<script lang="ts" setup>
import { useIntervalFn } from "@vueuse/core";
import { DocumentData, onSnapshot, QuerySnapshot } from "firebase/firestore";
definePageMeta({
  layout: "view",
});

const index = ref(0);
const time = ref<Date>(new Date());
const hours = ref("");
const minutes = ref("");

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
  // 画像変更
  useIntervalFn(async () => {
    if (snapshots.value?.docs.length === undefined) return;
    if (index.value < snapshots.value?.docs.length - 1) {
      index.value++;
    } else {
      index.value = 0;
    }
    console.log(index.value);
  }, 300000);

  // 時計
  useIntervalFn(() => {
    time.value.setSeconds(time.value.getSeconds() + 1);
    hours.value = ("0" + time.value.getHours()).slice(-2);
    minutes.value = ("0" + time.value.getMinutes()).slice(-2);
  }, 1000);
});
</script>

<template>
  <div class="grid relative slides">
    <v-img
      v-for="(snapshot, i) in snapshots?.docs"
      :key="snapshot.id"
      :src="snapshot.data().url"
      :class="{ 'opacity-0': i != index }"
      class="transition-opacity duration-500"
      alt=""
    />
    <div
      class="absolute bottom-0 w-full h-40 bg-black opacity-50 ackdrop-blur-md flex items-center"
    >
      <span class="mx-8 text-4xl font-bold">2023.01.25(水)</span>
      <span
        class="mr-8 text-8xl font-bold transition-all duration-500 ease-in-out"
      >
        {{ `${hours}:${minutes}` }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.slides > * {
  grid-column: 1 / -1;
  grid-row: 1 / -1;
}
</style>
