import { keys } from '../storage';
import { message } from 'antd';

export interface SiyuanServiceConfig {
  origin: string;
  token: string;
}

export const defaultSiyuanConfig: SiyuanServiceConfig = {
  origin: localStorage.getItem(keys.siyuan_origin) ?? 'http://127.0.0.1:6806',
  token: localStorage.getItem(keys.siyuan_token) ?? '',
};

export class SiyuanService {
  constructor(public config: SiyuanServiceConfig) {}

  async listNotebooks() {
    return this.callApi<{
      notebooks: {
        id: string;
        closed: boolean;
        name: string;
      }[];
    }>('api/notebook/lsNotebooks');
  }

  async checkNotebookOpen(id: string): Promise<boolean> {
    const notebooks = await this.listNotebooks();
    const notebook = notebooks.notebooks.find((p) => p.id === id);
    if (!notebook) {
      message.error('notebook not found');
      return false;
    }
    if (notebook.closed) {
      await this.openNotebook(notebook.id);
      return true;
    }
    return true;
  }

  async openNotebook(id: string) {
    return this.callApi<{ id: string }>('api/notebook/openNotebook', {
      notebook: id,
    });
  }

  async getBlockAttrs(blockId: string) {
    return this.callApi<{
      'custom-hamsterbaseId': string;
      'custom-templateHash': string;
    }>('api/attr/getBlockAttrs', {
      id: blockId,
    });
  }

  async setBlockAttrs(blockId: string, attrs: Record<string, string>) {
    return this.callApi<{ id: string }>('api/attr/setBlockAttrs', {
      id: blockId,
      attrs,
    });
  }

  async deletePage(blockId: string) {
    return this.callApi<{ id: string }>('api/block/deleteBlock', {
      id: blockId,
    });
  }

  async getIdByHPath(hPath: string): Promise<string | null> {
    const res = await this.callApi<{ id: string }[]>('api/query/sql', {
      stmt: `SELECT id FROM blocks WHERE hpath=${JSON.stringify(
        hPath
      )} and type = "d"`,
    });
    if (Array.isArray(res) && res.length > 0) {
      return res[0].id;
    }
    return null;
  }

  async createNote(
    notebook: string,
    path: string,
    markdown: string
  ): Promise<string> {
    return this.callApi('api/filetree/createDocWithMd', {
      notebook: notebook,
      path,
      markdown,
    });
  }

  async isAccessAble(): Promise<boolean> {
    try {
      const result = await this.listNotebooks();
      return (
        !!result.notebooks &&
        Array.isArray(result.notebooks) &&
        result.notebooks.length > 0
      );
    } catch (error) {
      return false;
    }
  }

  private async callApi<T>(url: string, data?: any): Promise<T> {
    const headers: Record<string, string> = {};
    if (this.config.token) {
      headers.Authorization = `Token ${this.config.token}`;
    }
    const requestUrl = `${this.config.origin}/${url}`;
    const result = await fetch(requestUrl, {
      method: 'POST',
      body: JSON.stringify(data),
      headers,
    });
    if (result.status === 401) {
      throw new Error('Unauthorized');
    }
    const json = await result.json();
    return json.data as Promise<T>;
  }

  updateSiyuanConfig(config: SiyuanServiceConfig) {
    this.config = config;
    localStorage.setItem(keys.siyuan_origin, config.origin);
    localStorage.setItem(keys.siyuan_token, config.token);
  }
}

export const siyuanService = new SiyuanService(defaultSiyuanConfig);
