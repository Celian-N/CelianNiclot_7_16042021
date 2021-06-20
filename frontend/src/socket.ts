import { io } from "socket.io-client";

const URL = "http://localhost:3001";
const socket = io(URL, { autoConnect: false }) as any;

socket.onAny((event : any, ...args : any) => {
  console.log(event, args);
});

export default socket;