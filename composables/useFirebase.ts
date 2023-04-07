import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
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
  const auth = getAuth();
  const token = useState<string | null>("token", () => null);
  const storage = getStorage();
  const store = getFirestore();
  const collectionRef = collection(store, "imageUrls");
  const docsRef = ref();

  // ログイン
  const signIn = async (email: string, password: string) => {
    return await new Promise<void>((resolve, reject) => {
      return signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          userCredential.user
            .getIdToken()
            .then((idToken) => {
              token.value = idToken;
              resolve();
            })
            .catch(reject);
        })
        .catch(reject);
    });
  };

  const checkAuthState = async () => {
    return await new Promise<void>((resolve, reject) => {
      // client only
      if (process.server) return resolve();
      const auth = getAuth();
      onAuthStateChanged(
        auth,
        (user) => {
          if (user) {
            user
              .getIdToken()
              .then((idtoken) => {
                token.value = idtoken;
                resolve();
              })
              .catch(reject);
          } else {
            token.value = null;
            resolve();
          }
        },
        (error) => {
          reject(error);
        }
      );
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

  // Store取得
  const listStore = async () => {
    return await new Promise<void>((resolve, reject) => {
      getDocs(collectionRef)
        .then((res) => {
          docsRef.value = res;
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

  // Store 削除
  const delDoc = async (fileName: string) => {
    return await new Promise<void>(async (resolve, reject) => {
      console.log(fileName);
    });
  };

  return {
    signIn,
    checkAuthState,
    uploadFile,
    listStore,
    delDoc,
    token,
    store,
    collectionRef,
    docsRef,
  };
};
