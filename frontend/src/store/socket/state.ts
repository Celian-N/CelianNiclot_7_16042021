import { readonly, ref, computed } from 'vue';

interface SocketStateInterface{
  id : string
  newMessage:boolean;
};

const socketState = ref<Record<number, SocketStateInterface>>({});

const setters = {
  setSocketUser: (user: SocketStateInterface) => {
    console.log('setSocket :', user)
    socketState.value = { ...socketState.value, [user.id] : user};
  },
  updateSocketUser: (updatedProperties: Partial<SocketStateInterface>) => {
    socketState.value = { ...socketState.value, ...updatedProperties };
  },
  clearSocketUser: () => {
    socketState.value = {};
  },
};

const getters = {
  getAllSocketUser: computed(() => Object.values(socketState.value)),
  getNewMessageById : (userId : number) => socketState.value[userId],
  getAllUnreadMessages : computed(() => Object.values(socketState.value).filter(socketUser => !!socketUser.newMessage)),
  getUnreadMessagesLength : computed(() => Object.values(socketState.value).filter(socketUser => !!socketUser.newMessage).length),
  
};

export const socketStore = {
  socketState: readonly(socketState),
  ...setters,
  ...getters,
};
