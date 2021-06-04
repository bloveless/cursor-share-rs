import React from 'react';
import SendIcon from '@material-ui/icons/Send';
import { FieldValues, useForm } from 'react-hook-form';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { v4 as uuidv4 } from 'uuid';
import { currentUserNameStateAtom } from '../../../../atoms';
import { chatHistoryAtom } from '../../../../atoms/chat';
import css from '../../ChatWindow.module.scss';
import useChatWebSocket from '../../../../hooks/useChatWebSocket';

// we need to progress through the websocket states
// 1. Disconnected
// 2. Connected (waiting for users name)
// 3. Have users name and waiting for a message

const ChatWindowInput: React.FC = () => {
  const [name, setName] = useRecoilState(currentUserNameStateAtom);
  const { register, handleSubmit, errors, reset } = useForm();
  const { sendJsonMessage } = useChatWebSocket();
  const setChatHistory = useSetRecoilState(chatHistoryAtom);

  const handleFormSubmit = (values: FieldValues) => {
    if (name === '') {
      setName(values.text);

      sendJsonMessage({
        event_type: "connect",
        name: values.text,
      });
    } else {
      sendJsonMessage({
        event_type: "text",
        message: values.text,
      });

      setChatHistory((prevChatHistory) => [ ...prevChatHistory, { id: uuidv4(), name, message: values.text } ]);
    }

    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className={css.chatWindowInput}>
        <div className={css.chatWindowInputMessage}>
          <input
            ref={register({ required: name === '' ? 'name is required' : 'you must provide a message' })}
            name="text"
            placeholder={name === '' ? 'Your Name' : 'Your Message'}
          />
          {errors.text?.message && <div>{errors.text.message}</div>}
        </div>
        <div className={css.chatWindowInputButton}>
          <button>
            <SendIcon />
          </button>
        </div>
      </div>
    </form>
  )
};

export default ChatWindowInput;
