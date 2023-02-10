import React, { useContext, useEffect, useState } from 'react';
import { SiyuanConfig } from './component/siyuan-config';
import { SyncPanel } from './component/sync-panel';
import { Context } from './context';
import { useSiyuanState } from './store/status';

const App: React.FC = () => {
  const siyuanState = useSiyuanState((o) => o);
  const ctx = useContext(Context)!;

  useEffect(() => {
    ctx.siyuanService.isAccessAble().then((res) => {
      siyuanState.setSiyuanAccessAble(res);
    });
  }, []);

  return (
    <div>
      {siyuanState.siyuanAccessAble ? (
        <SyncPanel></SyncPanel>
      ) : (
        <SiyuanConfig></SiyuanConfig>
      )}
    </div>
  );
};

export default App;
