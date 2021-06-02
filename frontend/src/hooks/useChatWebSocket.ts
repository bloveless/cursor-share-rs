import useWebSocket, { ReadyState } from "react-use-websocket";
import { webSocketUrl } from "../constants";

const useChatWebSocket = () => {
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(webSocketUrl, {
    share: true,
    shouldReconnect: (event: WebSocketEventMap['close']) => true,
  });

  return {
    sendJsonMessage,
    lastJsonMessage,
    isOpen: readyState === ReadyState.OPEN,
  };
};

export default useChatWebSocket;

