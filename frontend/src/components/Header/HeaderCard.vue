<template>
  <header class="row items-center justify-between px-md bg-white br-md main-shadow overflow-hidden">
    <img src="../../assets/logo_groupomania.png" alt="Logo groupomania">
    <div class="input-container">
    <InputField :button="buttonConfig"  :placeholder="'Rechercher'" :borderRadius="'24px'"/>

    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import InputField from '../InputField/InputField.vue'
export default defineComponent({
  name:'HeaderCard',
  components:{
    InputField
  },
  setup(){
    const buttonConfig = {
      icon : 'search',
      color: 'secondary',
      size: '30px'
    }
    return {buttonConfig}
  }
  
})
</script>

<style lang="scss" scoped>
img {
  width: 100px;
}
.input-container{
  width: 250px;
}
</style>