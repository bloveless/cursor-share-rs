import React from 'react';
import { CssBaseline } from '@material-ui/core';
import ChatWindow from './components/ChatWindow';
import { RecoilRoot } from 'recoil';

const App = () => {
  return (
    <RecoilRoot>
      <CssBaseline />
      <ChatWindow />
    </RecoilRoot>
  );
}

export default App;
