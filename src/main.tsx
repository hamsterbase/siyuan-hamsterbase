import 'antd/dist/reset.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Context } from './context';
import { siyuanService } from './services/siyuan';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Context.Provider
      value={{
        siyuanService,
      }}
    >
      <App />
    </Context.Provider>
  </React.StrictMode>
);
