import 'antd/dist/reset.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Context } from './context';
import { HighlightsSyncService } from './services/highlightsService';
import { siyuanService } from './services/siyuan';

const highlightsService = new HighlightsSyncService(siyuanService);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Context.Provider
      value={{
        siyuanService,
        highlightsService,
      }}
    >
      <App />
    </Context.Provider>
  </React.StrictMode>
);
