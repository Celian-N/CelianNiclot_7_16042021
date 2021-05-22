<template>
  <div
    class="bg-primary overflow-hidden row items-center justify-center avatar"
    :style="`min-width:${size};max-width:${size};min-height:${size}; max-height:${size}; border-radius : 300px;`"
  >
  <!--  background-image :url(${userPic}) -->
    <img v-if="userPic" class="user-pic" :src="userPic" alt="Photo de profil" />
    <img v-else class="full-width" src="../../assets/default_profile_pic.jpeg" alt="Photo de profil" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Avatar',
  props: {
    userPic: { type: String },
    size: { type: String, default: '50px' },
  },
});
</script>

<style lang="scss" scoped>
.user-pic{
  width: 100%;
}
.avatar{
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
