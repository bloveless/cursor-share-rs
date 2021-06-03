import { useEffect } from 'react';
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useSetRecoilState } from 'recoil';
import { webSocketUrl } from "../constants";
import { cursorsAtom } from '../atoms/cursor';
import { chatHistoryAtom } from '../atoms/chat';

const useChatWebSocket = () => {
  const setCursors = useSetRecoilState(cursorsAtom);
  const setChatHistory = useSetRecoilState(chatHistoryAtom);
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(webSocketUrl, {
    share: true,
    shouldReconnect: (_event: WebSocketEventMap['close']) => true,
  });

  useEffect(() => {
    if (lastJsonMessage != null) {
      if (lastJsonMessage.event_type === 'connected') {
        // System messages are always ignored
        if (lastJsonMessage.sender_id !== '00000000-0000-0000-0000-000000000000') {
          const { sender_id, sender_name, mouse_x, mouse_y } = lastJsonMessage;
          setCursors((prevCursors) => [ ...prevCursors, { id: sender_id, name: sender_name, x: mouse_x, y: mouse_y } ]);
        }
      }

      if (lastJsonMessage.event_type === 'disconnect') {
        // we need to filter out the current cursors to remove this user
        const { sender_id } = lastJsonMessage;
        setCursors((prevCursors) => prevCursors.filter((cursor) => cursor.id !== sender_id));
      }

      if (lastJsonMessage.event_type === 'someone_joined') {
        // TODO: log a message to the chat window
        // console.log('someone_joined', lastJsonMessage);
      }

      if (lastJsonMessage.event_type === 'text') {
        // TODO: log a message to the chat window
        setChatHistory((prevChatHistory) => {
          if (!prevChatHistory.find((chat) => chat.id === lastJsonMessage.message_id)) {
            return [ ...prevChatHistory, { id: lastJsonMessage.message_id, name: lastJsonMessage.sender_name, message: lastJsonMessage.message } ]
          }

          return prevChatHistory;
        });
      }

      if (lastJsonMessage.event_type === 'mousemove') {
        const { sender_id, sender_name, mouse_x, mouse_y } = lastJsonMessage;

        // Two cases here: we already know about the cursor so we are just updating the x and y pos
        //                 or this the first time we've seen this message and we need to create a new cursor

        // System messages are always ignored
        if (sender_id !== '00000000-0000-0000-0000-000000000000') {
          setCursors((prevCursors) => {
            const cursorIdIndex = prevCursors.findIndex((cursor) => cursor.id === sender_id);

            if (cursorIdIndex === -1) {
              return [ ...prevCursors, { id: sender_id, name: sender_name, x: mouse_x, y: mouse_y } ];
            }

            return prevCursors.map((cursor) => {
              if (cursor.id === sender_id) {
                return { ...cursor, name: sender_name, x: mouse_x, y: mouse_y };
              }

              return cursor;
            });
          });
        }
      }
    }
  }, [lastJsonMessage]);

  return {
    sendJsonMessage,
    lastJsonMessage,
    isOpen: readyState === ReadyState.OPEN,
  };
};

export default useChatWebSocket;

