import React, { useEffect } from 'react';
import useChatWebSocket from "../../hooks/useChatWebSocket";
import { useRecoilState, useRecoilValue } from 'recoil';
import { webSocketConnectionStateAtom } from '../../atoms';

const MouseMoveSender: React.FC<any> = () => {
  const { lastJsonMessage, sendJsonMessage, isOpen } = useChatWebSocket();

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      console.log('pagex', e.pageX);
      console.log('pagey', e.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
    };
  });

  // const { sendJsonMessage, lastJsonMessage, isOpen } = useChatWebSocket();
  //
  // let lastMouseX = 0, lastMouseY = 0;
  // let timeout: NodeJS.Timeout | null = null;
  //
  // const handleMouseMove: { (e: React.MouseEvent): void } = (e) => {
  //   if (!isOpen) return;
  //
  //   lastMouseX = e.pageX;
  //   lastMouseY = e.pageY;
  //
  //   if (timeout != null) return;
  //
  //   timeout = setTimeout(() => {
  //     if (!isOpen) return;
  //
  //     sendJsonMessage({
  //       event_type: "mousemove",
  //       mouse_x: lastMouseX,
  //       mouse_y: lastMouseY,
  //     });
  //
  //     timeout = null;
  //   }, 16);
  // }

  return null;
};

export default MouseMoveSender;
