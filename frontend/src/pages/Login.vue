<template>
  <div>
    <div>
      connectez-vous !

      <input type="email" v-model="testMail" required autofocus/>
      <input type="password" v-model="testMdp" required/>

      <button @click.stop="login(testMail, testMdp)">Se connecter</button>
    </div>
    <div style="display: flex; flex-direction: column">
      Pas de compte ? créez en un !
      <label for="firstname">Prénom :</label>
      <input type="text" name="firstname" v-model="firstname" required autofocus/>
      <label for="lastname">Nom :</label>
      <input type="text" name="lastname" v-model="lastname" required/>
      <label for="job">Job :</label>
      <input type="text" name="job" v-model="job" />
      <label for="email">Email :</label>
      <input type="email" name="email" v-model="email" required/>
      <label for="password">Mot de passe :</label>
      <input type="password" name="password" v-model="password" required/>

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
    const { login, signup } = useUser()

    const createUser = reactive({
      firstname: '',
      lastname: '',
      email: '',
      job: '',
      password: '',
    });
    const testMail = ref('');
    const testMdp = ref('');

    const onSignup = () => {
      signup(createUser);
    };

    return { testMail, testMdp, login, ...toRefs(createUser), onSignup };
  },
});
</script>
