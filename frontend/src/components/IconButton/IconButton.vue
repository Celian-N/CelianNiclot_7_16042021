<template>
  <button
      @click="$emit('onClick')"
      :style="`width:${button.size}; height : ${button.size};`"
      class="row items-center justify-center"
    >
      <span
        class="material-icons-round"
        :class="`text-${button.color}`"
        :style="`font-size:calc(${button.size} - 5px);`"
        >{{ button.icon }}</span
      >
    </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name:'IconButton',
  props:{
    button: Object
  }
  
})
</script>
<style lang="scss" scoped>
button {
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 30px;
  transition: background 300ms;

  &:hover {
    background: rgba(grey, 0.1);
  }
}
</style>