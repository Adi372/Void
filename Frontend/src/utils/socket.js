import { io } from "socket.io-client";
export const socket = io("https://void-tup9.onrender.com", {
    withCredentials: true,
    autoConnect: true
});