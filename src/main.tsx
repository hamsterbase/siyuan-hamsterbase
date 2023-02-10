import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'antd/dist/reset.css';
import { siyuanService } from './services/siyuan';
import { Context } from './context';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Context.Provider
      value={{
        siyuanService,
      }}
    >
      <App />
    </Context.Provider>
    ,
  </React.StrictMode>
);
