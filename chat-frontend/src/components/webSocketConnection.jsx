import SockJS from "sockjs-client/dist/sockjs";
import { Client } from '@stomp/stompjs';

let stompClient = null;

export const connectWebSocket = (onConnect) => {
  const server_url = import.meta.env.VITE_SERVER_URL;
  stompClient = new Client({
    webSocketFactory: () => new SockJS(`${server_url}/ws`),
    reconnectDelay: 5000,
    // debug : () => {}
  })

  stompClient.onConnect = () => {
    console.log("connect");
    onConnect && onConnect();
  }

  stompClient.onStompError = (frame) => {
    console.error('WebSocket connection error');
  }

  stompClient.activate();
}

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
  }
}

export const getClient = () => {
  // console.log("getting client:", stompClient);
  return stompClient;
}

