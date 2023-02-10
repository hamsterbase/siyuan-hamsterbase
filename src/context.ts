import React from 'react';
import { SiyuanService } from './services/siyuan';

export interface GlobalContext {
  siyuanService: SiyuanService;
}

export const Context = React.createContext<GlobalContext | null>(null);
