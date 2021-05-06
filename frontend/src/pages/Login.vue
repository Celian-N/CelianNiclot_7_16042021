<template>
  <div>
    <div class="column">
      Connectez-vous !

      <input type="email" v-model="userMail" required autofocus />
      <input type="password" v-model="userPassword" required minlength="8" />

      <button @click.stop="onLogin">Se connecter</button>
    </div>
    <div class="column">
      Pas de compte ? créez en un !
      <label for="firstname">Prénom :</label>
      <input type="text" name="firstname" v-model="firstname" maxlength="40" required />
      <label for="lastname">Nom :</label>
      <input type="text" name="lastname" v-model="lastname" maxlength="40" required />
      <label for="job">Job :</label>
      <input type="text" name="job" v-model="job" maxlength="60" />
      <label for="email">Email :</label>
      <input type="email" name="email" v-model="email" maxlength="100" required />
      <label for="password">Mot de passe :</label>
      <input type="password" name="password" v-model="password" minlength="8" required />

      <button @click.stop="onSignup">Créer un compte</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from 'vue';
import { useUser } from '../store/user/user.store';

export default defineComponent({
  name: 'LoginPage',
  setup(props, context) {
    const emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const { login, signup } = useUser();

    const createUser = reactive({
      firstname: '',
      lastname: '',
      email: '',
      job: '',
      password: '',
    });
    const userMail = ref('');
    const userPassword = ref('');

    const onLogin = async () => {
      if (userMail.value.match(emailRegExp)) {
        await login(userMail.value, userPassword.value);
      }
    };

    const onSignup = async() => {
      if (createUser.email.match(emailRegExp)) {
        await signup(createUser);
      }
    };

    return { userMail, userPassword, onLogin, ...toRefs(createUser), onSignup };
  },
});
</script>
