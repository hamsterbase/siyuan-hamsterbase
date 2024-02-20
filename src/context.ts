import React from 'react';
import { HighlightsSyncService } from './services/highlightsService';
import { SiyuanService } from './services/siyuan';

export interface GlobalContext {
  siyuanService: SiyuanService;
  highlightsService: HighlightsSyncService;
}

export const Context = React.createContext<GlobalContext | null>(null);
