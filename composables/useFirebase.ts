import {
  getFirestore,
  collection,
  addDoc,
} from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  listAll,
  getDownloadURL,
  StorageReference,
} from "firebase/storage";
import { blobToWebP } from "webp-converter-browser";

export const useFirebase = () => {
  const urlList = ref<string[]>([]);
  const auth = getAuth();
  const storage = getStorage();
  const store = getFirestore();
  const collectionRef = collection(store, "imageUrls");

  // ログイン
  const signIn = async (email: string, password: string) => {
    return await new Promise<void>((resolve, reject) => {
      return signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          resolve();
        })
        .catch(reject);
    });
  };

  // Storageアップロード（WebP変換あり）
  const uploadFile = async (name: string, file: File | undefined) => {
    return await new Promise<void>((resolve, reject) => {
      const fileRef = storageRef(storage, `images/${name}.webp`);
      if (file == undefined) return reject; // nullの場合は終了する
      return blobToWebP(file, {
        quality: 100,
      })
        .then((blob) => {
          uploadBytes(fileRef, blob)
            .then(async (snapshot) => {
              await saveDoc(fileRef);
              resolve();
            })
            .catch(reject);
        })
        .catch(reject);
    });
  };

  // Storage一覧取得
  const listStorage = async () => {
    return await new Promise<void>((resolve, reject) => {
      const listRef = storageRef(storage, "images");
      return listAll(listRef)
        .then((res) => {
          res.items.forEach(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            if (!urlList.value.includes(url)) urlList.value.push(url);
          });
          resolve();
        })
        .catch(reject);
    });
  };

  // Store 追加
  const saveDoc = async (storageRef: StorageReference) => {
    return await new Promise<void>(async (resolve, reject) => {
      const url = await getDownloadURL(storageRef);
      await addDoc(collectionRef, {
        name: storageRef.name,
        url: url,
      });
    });
  };

  return {
    signIn,
    uploadFile,
    listStorage,
    urlList,
    store,
    collectionRef,
  };
};
