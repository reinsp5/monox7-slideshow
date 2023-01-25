import { useAuth } from "@vueuse/firebase";
import { getAuth } from "firebase/auth";
export default defineNuxtRouteMiddleware(async () => {
  if (!process.server) {
    const auth = getAuth();
    const { isAuthenticated, user } = useAuth(auth);
    if (!isAuthenticated.value) {
      return await navigateTo("/login", { replace: true });
    }
  }
});
