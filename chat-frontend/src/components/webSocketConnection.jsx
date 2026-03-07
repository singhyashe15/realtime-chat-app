import SockJS from "sockjs-client/dist/sockjs";
import { Client } from '@stomp/stompjs';

let stompClient = null;

export const connectWebSocket = (onConnect) => {
  stompClient = new Client({
    webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
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

