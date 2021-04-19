<template>
  <div>
    connectez-vous !

    <input type="text" v-model="testMail" />
    <input type="password" v-model="testMdp" />

    <button @click="login(testMail, testMdp)">Se connecter</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import {useApi} from '../mixins/api/api.mixins'



export default defineComponent({
  name: 'LoginPage',
  setup(props, context) {

    const { login } = useApi()


    const testMail = ref('');
    const testMdp = ref('');

    return { testMail, testMdp, login };
  },
});
</script>
