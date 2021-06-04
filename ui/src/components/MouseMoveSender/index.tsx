import React, { useEffect } from 'react';
import useChatWebSocket from "../../hooks/useChatWebSocket";

const MouseMoveSender: React.FC<any> = () => {
  const { sendJsonMessage, isOpen } = useChatWebSocket();

  let lastMouseX = 0, lastMouseY = 0;
  let timeout: ReturnType<typeof setTimeout>|null = null;

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isOpen) return;

      lastMouseX = e.pageX;
      lastMouseY = e.pageY;

      if (timeout != null) return;

      timeout = setTimeout(() => {
        if (!isOpen) return;

        sendJsonMessage({
          event_type: 'mousemove',
          mouse_x: lastMouseX,
          mouse_y: lastMouseY,
        });

        timeout = null;
      }, 16);
    }

    document.addEventListener('mousemove', onMouseMove);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
    };
  });

  return null;
};

export default MouseMoveSender;
