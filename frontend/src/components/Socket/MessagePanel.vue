<template>
  <div class="column justify-between" style="height: 80%">
    <ul class="messages column" v-if="user" id="message-list">
      <li
        v-for="(message, index) in messages"
        :key="index"
        :class="message.fromSelf ? 'self-end items-end' : 'self-start items-start'"
        class="column"
      >
        <div
          class="mt-sm sender text-main"
          v-if="(messages[index - 1] && message.fromSelf != messages[index - 1].fromSelf) || !messages[index - 1]"
        >
          {{ message.fromSelf ? 'Moi' : user.firstname + ' ' + user.lastname }}
        </div>
        <div class="mt-xs content br-sm" :class="message.fromSelf ? 'chat-me' : 'chat-user'">
          {{ message.content }}
        </div>
      </li>
      <div v-if="typing[user.id] && typing[user.id].typing" class="typing-bubble row items-center justify-center mt-md">
        <div class="loader"></div>
      </div>
    </ul>

    <div style="max-height: 20%">
      <InputField
        v-if="user"
        autogrow
        @onInput="(val) => (message = val)"
        :value="message"
        placeholder="Ecrire un message"
        borderRadius="8px"
        :maxLength="255"
        fontSize="14px"
        :button="{
          icon: 'send',
          color: 'secondary',
          size: '30px',
        }"
        @onClick="onSubmit"
      />
    </div>
    <async-loader v-if="changeConvIsLoading" loaderSize="50px" :isLoading="changeConvIsLoading" mode="INLINE" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch, PropType, onMounted } from 'vue';
import InputField from '../InputField/InputField.vue';
import socket from '../../socket';
import { useApiStore } from '../../store/api/api.store';
import AsyncLoader from '../AsyncLoader/AsyncLoader.vue';

export default defineComponent({
  name: 'MessagePanel',
  components: {
    InputField,
    AsyncLoader,
  },
  props: {
    me: Object,
    user: Object,
    messages: { type: Array as PropType<{ content: string; fromSelf: boolean }[]> },
  },
  setup(props, context) {
    const { isLoading } = useApiStore();
    const changeConvIsLoading = computed(() => isLoading('CHANGE_CONV').value);

    const message = ref('');
    const typing = ref<Record<number, { typing: boolean }>>({});
    const isValid = computed(() => message.value.length > 0);
    const messageExist = computed(() => message.value.length > 0);

    const onSubmit = () => {
      if (!isValid.value) return;
      context.emit('onSendMessage', message.value);
      message.value = '';
    };

    watch(
      () => messageExist.value,
      (newValue) => {
        if (!props.me) return;
        if (!newValue) return socket.emit('typing', { typingValue: false, userId: props.me.id });
        socket.emit('typing', { typingValue: true, userId: props.me.id });
      }
    );

    watch(
      () => changeConvIsLoading.value,
      (newValue, prevValue) => {
        if (newValue != prevValue && !newValue) {
          setTimeout(updateScroll, 100);
          updateScroll();
        }
      }
    );

    function updateScroll() {
      const scrollContainer = document.getElementById('message-list');
      if (!scrollContainer) return;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }

    onMounted(() => {
      socket.on('typing', ({ typingValue, userId }: { typingValue: boolean; userId: number }) => {
        typing.value = { ...typing.value, [userId]: { typing: typingValue ? true : false } };
      });

      updateScroll();
    });

    return { onSubmit, message, isValid, typing, changeConvIsLoading, updateScroll };
  },
});
</script>

<style lang="scss" scoped>
ul {
  margin: 0 !important;
  & li {
    list-style: none;
  }
}
.messages {
  overflow: scroll;
  padding: 20px 50px;
  max-height: 80%;
}
.sender {
  font-weight: 500;
}
.chat-user {
  background: #f5f5f5;
  color: #505050;
  max-width: 70%;
}
.chat-me {
  background: rgba(#0d2040, 0.8);
  color: white;
  max-width: 70%;
}
.content {
  padding: 5px 10px;
  font-weight: 300;
}

//Loader typing
.typing-bubble {
  background: rgba(#50505096, 0.3);
  padding: 15px;
  border-radius: 30px;
  width: 40px;
  position: relative;
}
.loader,
.loader:before,
.loader:after {
  border-radius: 50%;
  width: 10px;
  height: 10px;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation: load7 1.8s infinite ease-in-out;
  animation: load7 1.8s infinite ease-in-out;
}
.loader {
  color: white;
  font-size: 10px;
  position: absolute;
  top: -15px;
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}
.loader:before,
.loader:after {
  content: '';
  position: absolute;
  top: 0;
}
.loader:before {
  left: -20px;
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}
.loader:after {
  left: 20px;
}
@-webkit-keyframes load7 {
  0%,
  80%,
  100% {
    box-shadow: 0 2.5em 0 -1.3em;
  }
  40% {
    box-shadow: 0 2.5em 0 0;
  }
}
@keyframes load7 {
  0%,
  80%,
  100% {
    box-shadow: 0 2.5em 0 -1.3em;
  }
  40% {
    box-shadow: 0 2.5em 0 0;
  }
}
</style>
