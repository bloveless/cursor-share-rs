import React, { useState } from 'react';
import ChatWindowHistory from './components/ChatWindowHistory';
import ChatWindowStatus from './components/ChatWindowStatus';
import ChatWindowInput from './components/ChatWindowInput';
import MouseMoveSender from '../MouseMoveSender';
import css from './ChatWindow.module.scss';
import useChatWebSocket from '../../hooks/useChatWebSocket';
import {useRecoilValue} from 'recoil';
import {cursorsAtom} from '../../atoms/cursor';
import Cursor from './components/Cursor';

const ChatWindow: React.FC<any> = () => {
  const cursors = useRecoilValue(cursorsAtom);

  return (
    <div className={css.chatWindow}>
      <MouseMoveSender />
      <ChatWindowHistory />
      <ChatWindowInput />
      <ChatWindowStatus />
      {cursors.map((cursor) => (
        <Cursor key={cursor.id} cursor={cursor} />
      ))}
    </div>
  )
};

export default ChatWindow;

