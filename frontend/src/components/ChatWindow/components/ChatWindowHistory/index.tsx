import React, { useRef, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import css from '../../ChatWindow.module.scss'
import { chatHistoryAtom } from '../../../../atoms/chat';

const ChatWindowHistory: React.FC<any> = () => {
  const chatHistory = useRecoilValue(chatHistoryAtom);
  const scrollToDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollToDivRef.current) {
      scrollToDivRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  return (
    <div className={css.chatWindowHistory}>
      {chatHistory.map((message) => <div key={message.id}><strong>{message.name}:</strong> {message.message}</div>)}
      <div style={{ float:"left", clear: "both" }} ref={scrollToDivRef} />
    </div>
  );
};

export default ChatWindowHistory;
