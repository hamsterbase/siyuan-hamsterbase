import React, { useContext, useEffect, useState } from 'react';
import { Context } from './context';

const App: React.FC = () => {
  const [accessSiyuan, setAccessSiyuan] = useState(false);
  const ctx = useContext(Context)!;

  useEffect(() => {
    ctx.siyuanService.isAccessAble().then((res) => {
      setAccessSiyuan(res);
    });
  }, []);

  return <div>{accessSiyuan ? 'true' : 'false'}</div>;
};

export default App;
