<template>
  <div class="bg-primary br-xl overflow-hidden" :style="`min-width:${size};max-width:${size};min-height:${size}; max-height:${size}`">
    <img v-if="userPic" :src="userPic" alt="Photo de profil">
    <img v-else class="full-width"  src="../../assets/default_profile_pic.jpeg" alt="Photo de profil">

  </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name:'Avatar',
  props:{
    userPic : {type : String},
    size : {type : String, default : '50px'}
  }
})
</script>