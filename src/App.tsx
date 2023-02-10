import React, { useContext, useEffect, useState } from 'react';
import { SyncPanel } from './component/sync-panel';
import { Context } from './context';

const App: React.FC = () => {
  const [accessSiyuan, setAccessSiyuan] = useState(false);
  const ctx = useContext(Context)!;

  useEffect(() => {
    ctx.siyuanService.isAccessAble().then((res) => {
      setAccessSiyuan(res);
    });
  }, []);

  return <div>{accessSiyuan ? <SyncPanel></SyncPanel> : 'false'}</div>;
};

export default App;
