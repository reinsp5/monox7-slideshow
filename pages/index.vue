<script lang="ts" setup>
import { useIntervalFn } from "@vueuse/core";
import { DocumentData, FirestoreError, onSnapshot, QuerySnapshot } from "firebase/firestore";
definePageMeta({
  layout: "view",
});

const index = ref(0);
const time = ref<Date>(new Date());
const hours = ref("");
const minutes = ref("");

const snapshots = ref<QuerySnapshot<DocumentData>>();
const { store, collectionRef } = useFirebase();
const { getWeather, weather, weatherIcon } = useWeather();
await getWeather();
// Store 一覧
const listenDoc = onSnapshot(
  collectionRef,
  (res:QuerySnapshot<DocumentData>) => {
    if (res.docs.length - 1 < index.value) index.value = res.docs.length;
    snapshots.value = res;
  },
  (err:FirestoreError) => {
    console.error(err);
  }
);

onMounted(async () => {
  // 画像変更（５分ごとに更新）
  useIntervalFn(async () => {
    if (snapshots.value?.docs.length === undefined) return;
    if (index.value < snapshots.value?.docs.length - 1) {
      index.value++;
    } else {
      index.value = 0;
    }
  }, 300000);

  // 時計（１秒毎に更新）
  useIntervalFn(() => {
    time.value.setSeconds(time.value.getSeconds() + 1);
    hours.value = ("0" + time.value.getHours()).slice(-2);
    minutes.value = ("0" + time.value.getMinutes()).slice(-2);
  }, 1000);

  // 天気予報（１時間毎に更新）
  useIntervalFn(async () => {
    await getWeather();
  }, 3600000);
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
      class="absolute bottom-0 w-full h-52 bg-black/50 text-white backdrop-blur-md flex items-center"
    >
      <div class="grow grid grid-cols2">
        <div class="ml-8 text-3xl font-bold">2023.01.25(水)</div>
        <div class="mx-auto text-8xl font-bold">
          {{ `${hours}:${minutes}` }}
        </div>
      </div>
      <div class="mx-8 grow flex place-items-center">
        <div class="grow text-right">
          <span class="text-4xl font-bold">{{ weather.name }}</span>
        </div>
        <div class="grid grid-cols-1 place-items-center">
          <img
            class="w-32 h-auto"
            :src="`/weather_icon/${weatherIcon}.svg`"
            alt=""
          />
          <div class="grid grid-cols-3">
            <div class="grid grid-cols-2 place-items-center text-2xl">
              <img
                class="w-16 h-auto"
                src="/weather_icon/thermometer-warmer.svg"
                alt=""
              />
              {{ `${weather.main.temp_max.toFixed(1)}℃` }}
            </div>
            <div class="grid grid-cols-2 place-items-center text-2xl">
              <img
                class="w-16 h-auto"
                src="/weather_icon/thermometer-colder.svg"
                alt=""
              />
              {{ `${weather.main.temp_min.toFixed(1)}℃` }}
            </div>
            <div class="grid grid-cols-2 place-items-center text-2xl">
              <img
                class="w-16 h-auto"
                src="/weather_icon/humidity.svg"
                alt=""
              />
              {{ `${weather.main.humidity.toFixed(1)}%` }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.slides > * {
  grid-column: 1 / -1;
  grid-row: 1 / -1;
}
.AnimatedWeatherIcon {
  width: 128px;
  height: 128px;
}
</style>
