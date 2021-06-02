import React from 'react';
import SendIcon from '@material-ui/icons/Send';
import { FieldValues, useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';
import { currentUserNameStateAtom } from '../../../../atoms';
import css from '../../ChatWindow.module.scss';

// we need to progress through the websocket states
// 1. Disconnected
// 2. Connected (waiting for users name)
// 3. Have users name and waiting for a message

const ChatWindowInput: React.FC = () => {
  const [name, setName] = useRecoilState(currentUserNameStateAtom);
  const { register, handleSubmit, errors } = useForm();

  const handleFormSubmit = (values: FieldValues) => {
    if (name === '') {
      setName(values.name);
    }

    console.log(values);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className={css.chatWindowInput}>
        <div className={css.chatWindowInputMessage}>
          <input
            ref={register({ required: 'name is required' })}
            name="name"
            placeholder="Your Name"
          />
          {errors.name?.message && <div>{errors.name.message}</div>}
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
