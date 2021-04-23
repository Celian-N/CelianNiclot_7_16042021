<template>
  <div class="home">
    <button @click="logout">Se deconnecter</button>
    {{ test }}
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, SetupContext } from 'vue';
import { useApi } from '../mixins/api/api.mixins';
import { useUser } from '../store/user/user.store';

export default defineComponent({
  name: 'Home',
  setup(props, context: SetupContext) {
    const test = ref({});
    const { logout } = useUser();

    const { getAllUsers } = useApi();

    onMounted(async () => {
      test.value = await getAllUsers();
    });

    return { test, logout };
  },
});
</script>
