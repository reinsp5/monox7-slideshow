<script lang="ts" setup>
const form = reactive({
  email: "",
  password: "",
});

const login = () => {
  useFirebase()
    .signIn(form.email, form.password)
    .then(() => {
      navigateTo("/dashboard");
    });
};
</script>

<template>
  <v-card max-width="600" class="pa-5 w-full">
    <v-form @submit.prevent="login">
      <v-text-field
        label="メールアドレス"
        variant="underlined"
        v-model="form.email"
      />
      <v-text-field
        type="password"
        label="パスワード"
        variant="underlined"
        v-model="form.password"
      />
      <v-card-actions>
        <v-btn type="submit" variant="outlined">ログイン</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<style scoped></style>
