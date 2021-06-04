import React from 'react';
import css from '../../ChatWindow.module.scss';
import { useRecoilState } from 'recoil';
import { currentUserNameStateAtom } from '../../../../atoms';

const ChatWindowStatus: React.FC<any> = () => {
  const [name, setName] = useRecoilState(currentUserNameStateAtom);

  return (
    <div className={css.chatWindowStatus}>{name === '' ? (
      <div>
        Disconnected
      </div>
    ) : (
      <div>
        {`Connected As: ${name} `}
        (<button className="asText" onClick={() => setName('')}>Disconnect</button>)
      </div>
    )}
    </div>
  );
};

export default ChatWindowStatus;
