<script lang="ts" setup>
import {
  DocumentData,
  FirestoreError,
  onSnapshot,
  QuerySnapshot,
} from "firebase/firestore";
definePageMeta({
  middleware: ["auth"],
});
const index = ref(0);
const snapshots = ref<QuerySnapshot<DocumentData>>();
const { store, collectionRef, delDoc } = useFirebase();
const listenDoc = onSnapshot(
  collectionRef,
  (res: QuerySnapshot<DocumentData>) => {
    if (res.docs.length - 1 < index.value) index.value = res.docs.length;
    snapshots.value = res;
  },
  (err: FirestoreError) => {
    console.error(err);
  }
);

const deletePhoto = async (fileName:string) => {
  await delDoc(fileName);
}
</script>

<template>
  <div class="m-8 grid grid-cols-1 lg:grid-cols-5 gap-10">
    <div
      v-for="snapshot in snapshots?.docs"
      :key="snapshot.id"
      class="relative"
    >
      <img class="h-96 relative" :src="snapshot.data().url" alt="" />
      <button @click="delDoc(snapshot.data().name)" class="absolute top-1 right-1 w-fit h-auto bg-red-700 text-white p-1 grid grid-cols-1 place-items-center">
        <Icon name="material-symbols:delete-forever" size="20" />
      </button>
    </div>
  </div>
</template>

<style scoped></style>
