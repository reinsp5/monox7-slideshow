import { getAuth } from "firebase/auth";
export default defineNuxtRouteMiddleware(async () => {
  if (!process.server) {
    const auth = getAuth();
    const { checkAuthState, token } = useFirebase();
    await checkAuthState();
    if (token == null) {
      return await navigateTo("/login", { replace: true });
    }
  }
});
