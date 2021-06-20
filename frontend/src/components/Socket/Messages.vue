<template>
  <div class="full-width column justify-between" style="min-height: 300px; height: 90%">
    <div class="row items-center self-end users-sessions">
      <div
        v-for="user in oldSessions"
        :key="user.id"
        class="mr-md position-relative"
        @click="$emit('onSelectUser', user)"
      >
        <Avatar v-if="user" :userPic="user.userPic" class="user-avatar" />
        <div class="tooltip">
          {{ user.firstname + ' ' + user.lastname }}
        </div>
        <div
          class="connected-status"
          :class="`background-color : ${usersConnected.includes(user.id) ? 'bg-positive' : 'bg-secondary'}`"
        ></div>
        <div v-if="hasNewMessage(user.id)" class="new-messages bg-primary row items-center justify-center">
          <span class="material-icons-round font-12 text-white"> mail </span>
        </div>
      </div>
    </div>

    <div v-if="selectedUser" class="row items-center justify-between">
      <Avatar size="50px" :userPic="selectedUser.userPic" class="mr-sm" />
      <div class="column items-start" style="flex: 1">
        <span class="text-main text-bold">{{ selectedUser.firstname }} {{ selectedUser.lastname }}</span>
        <span class="text-caption font-12">{{ selectedUser.job }}</span>
      </div>
    </div>

    <MessagePanel
      ref="messagePanel"
      :user="user"
      :me="me"
      @onSendMessage="onMessage"
      :messages="messages"
      class="full-width"
    />
  </div>
</template>

<script lang="ts">
import socket from '../../socket';
import MessagePanel from './MessagePanel.vue';
import { defineComponent, onMounted, ref, PropType, watch, onBeforeUnmount } from 'vue';
import { IUser } from '../../interface/user/user';
import Avatar from '../Avatar/Avatar.vue';
import { useApiStore } from '../../store/api/api.store';
import { useSocket } from '../../store/socket/socket.store';

interface MessagePanelRef {
  updateScroll: () => void;
}
export interface IAuthor extends Partial<IUser> {
  sessionId: string;
}

export default defineComponent({
  name: 'Messages',
  components: {
    MessagePanel,
    Avatar,
  },
  props: {
    selectedUser: { type: Object as PropType<IUser> },
    me: { type: Object as PropType<IUser> },
    oldSessions: { type: Array as PropType<IAuthor[]> },
    unreadMessages: { type: Array as PropType<{ id: number; newMessage: boolean }[]> },
  },
  setup(props) {
    const { endLoading } = useApiStore();
    const messagePanel = ref<MessagePanelRef | undefined>(undefined);
    const user = ref<IUser | undefined>(undefined);
    const messages = ref<{ content: string; fromSelf: boolean }[]>([]);
    const usersConnected = ref<number[]>([]);
    const unMounted = ref(true);
    const { setSocketUser } = useSocket();

    const hasNewMessage = (userId: number) => {
      if (!props.unreadMessages) return;
      const user = props.unreadMessages.find((unreadMessage) => unreadMessage.id == userId);
      if (!user) return;
      return user.newMessage;
    };

    const onMessage = (content: string) => {
      if (!user.value || !props.me) return;

      socket.emit('private message', {
        content,
        from: props.me.id,
        to: user.value.id,
      });
      messages.value.push({
        content,
        fromSelf: true,
      });
      if (!messagePanel.value) return;
      setTimeout(messagePanel.value.updateScroll, 100);
    };

    watch(
      () => props.selectedUser,
      (newValue, prevValue) => {
        if (newValue != prevValue && !!newValue) {
          messages.value = [];
          user.value = newValue;
        }
      }
    );

    const setOldMessages = (oldMessages: { message: string; user_id: number; session_id: string }[]) => {
      oldMessages.map((message) => {
        if (!props.me) return;
        messages.value.push({
          content: message.message,
          fromSelf: message.user_id == props.me.id,
        });
      });
      endLoading('CHANGE_CONV');
    };

    onMounted(() => {
      unMounted.value = false;
      if (props.selectedUser) {
        user.value = props.selectedUser;
        socket.emit('messages', socket.auth.sessionId);
      }

      socket.on('messages', (oldMessages: { message: string; user_id: number; session_id: string }[]) => {
        if (!oldMessages) return;
        messages.value = [];
        setOldMessages(oldMessages);
      });

      socket.on('user_connected', (connectedUsers: number[]) => {
        usersConnected.value = connectedUsers;
      });

      socket.on('private message', ({ content, from, to }: { content: string; from: number; to: number }) => {
        if (unMounted.value == false) {
          if (!props.me) return;
          const fromSelf = props.me.id === from;
          messages.value.push({
            content,
            fromSelf,
          });
          if (props.selectedUser && from == props.selectedUser.id) {
            socket.emit('readMessages', { userId: from, sessionId: socket.auth.sessionId });
            return setSocketUser({ id: from.toString(), newMessage: false });
          }
          setSocketUser({ id: from.toString(), newMessage: true });
        }
      });
    });
    onBeforeUnmount(() => {
      unMounted.value = true;
    });

    return { user, onMessage, messages, messagePanel, usersConnected, hasNewMessage };
  },
});
</script>

<style lang="scss" scoped>
.tooltip {
  position: absolute;
  top: 30px;
  opacity: 0;
  transition: all 300ms;
  cursor: pointer;
  &:hover {
    top: 50px;
    opacity: 1;
  }
}
.user-avatar:hover {
  cursor: pointer;
  & + .tooltip {
    top: 50px;
    opacity: 1;
  }
}
.connected-status {
  width: 15px;
  height: 15px;
  position: absolute;
  bottom: 0;
  left: 0;
  border-radius: 30px;
}
.users-sessions {
  max-width: 100%;
  overflow: scroll;
  padding-bottom: 50px;
  margin-bottom: -50px;
  &::-webkit-scrollbar {
    display: none;
  }
}
.new-messages {
  position: absolute;
  bottom: 0;
  right: 0;
  border-radius: 30px;
  width: 20px;
  height: 20px;
}
</style>
