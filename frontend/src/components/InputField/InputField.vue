<template>
  <div
    class="row"
    :class="`${dense ? 'px-xs' : 'pa-xs'} ${autogrow ? 'items-end' : 'items-center'} ${
      withBackground ? 'bg-tertiary input-shadow' : ''
    } ${disabled ?  'disabled-container' : ''}`"
    :style="`border-radius :${borderRadius};`"
  >
    <input
      v-if="!autogrow"
      style="flex: 1"
      :type="type"
      :value="value"
      @input="onInput($event)"
      @change="onChange($event)"
      :placeholder="placeholder"
      :minlength="minLength"
      :maxlength="maxLength"
      :required="required"
      :autofocus="autofocus"
      :disabled="disabled"
      :style="`font-size : ${fontSize}`"
      :class="disabled ? 'disabled-input' : '' "
      :autocomplete="type =='password' ? 'off' : ''"
    />

    <textarea
      v-else
      ref="input"
      style="flex: 1"
      :value="value"
      :placeholder="placeholder"
      :minlength="minLength"
      :maxlength="maxLength"
      @input="onInput($event)"
      @change="onChange($event)"
      :class="customTextareaClass"
      :required="required"
      :autofocus="autofocus"
      :style="`font-size : ${fontSize}`"
    ></textarea>

    <IconButton v-if="button" :button="button" @onClick="$emit('onClick')" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import IconButton from '../IconButton/IconButton.vue';
export default defineComponent({
  name: 'InputField',
  components: {
    IconButton,
  },
  props: {
    button: Object,
    placeholder: String,
    minLength: { type: Number, default: 0 },
    maxLength: { type: Number, default: 255 },
    borderRadius: { type: String, default: '0px' },
    dense: { type: Boolean, default: false },
    value: { type: String },
    type: { type: String, default: 'text' },
    autogrow: { type: Boolean, default: false },
    customTextareaClass: { type: String },
    withBackground: { type: Boolean, default: true },
    required: { type: Boolean, default: false },
    autofocus: { type: Boolean, default: true },
    fontSize: { type: String, default: '14px' },
    disabled: { type: Boolean, default: false },
  },
  setup(props, context) {
    function onInput(event: any) {
      context.emit('onInput', event.target.value);
      if (props.autogrow) {
        resize(event);
      }
    }

    function onChange(event : any){
      context.emit('onChange', event.target.value);
    }

    const resize = (e: any) => {
      e.target.style.height = 'auto';
      e.target.style.height = `${e.target.scrollHeight}px`;
    };

    return { onInput, onChange };
  },
});
</script>

<style lang="scss" scoped>
input {
  background: transparent;
  border: none;
  outline: none;
}
textarea {
  background: transparent;
  border: none !important;
  outline: none;
  resize: none;
  overflow: hidden;
  box-sizing: border-box;
  font-family: 'Poppins';
  &:focus {
    outline: none;
  }
}
.disabled-container {
  background: rgba(grey, 0.2);
  cursor: not-allowed;
}
.disabled-input {
  color: rgba(grey, 0.3); ;
  cursor: not-allowed;
}

</style>
