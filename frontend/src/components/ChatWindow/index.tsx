import React, { useState } from 'react';
import ChatWindowHistory from './components/ChatWindowHistory';
import ChatWindowStatus from './components/ChatWindowStatus';
import ChatWindowInput from './components/ChatWindowInput';
import MouseMoveSender from '../MouseMoveSender';
import { useRecoilValue } from 'recoil';
import css from './ChatWindow.module.scss';
import useChatWebSocket from '../../hooks/useChatWebSocket';

const ChatWindow: React.FC<any> = () => {
  const [messages, setMessages] = useState([]);
  const { lastJsonMessage, sendJsonMessage, isOpen } = useChatWebSocket();

  return (
    <div className={css.chatWindow}>
      <MouseMoveSender />
      <ChatWindowHistory />
      <ChatWindowInput />
      <ChatWindowStatus />
    </div>
  )
};

export default ChatWindow;

