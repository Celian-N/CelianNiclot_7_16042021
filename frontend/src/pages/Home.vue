<template>
  <div class="home">
    <button @click="disconnect">Se deconnecter</button>
    {{ test }}
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, SetupContext } from 'vue';
import { useApi } from '../mixins/api/api.mixins';
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';


export default defineComponent({
  name: 'Home',
  setup(props, context: SetupContext) {
    const test = ref({});
    const router = useRouter();

    const { getAllUsers } = useApi();

    const disconnect = () => {
      Cookies.remove('groupomania_token')
      router.push({ name: 'Login' });
    };
    onMounted(async () => {
      test.value = await getAllUsers();
    });

    return { test, disconnect };
  },
});
</script>
