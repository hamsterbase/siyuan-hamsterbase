export interface SiyuanServiceConfig {
  origin: string;
  token: string;
}

const defaultConfig: SiyuanServiceConfig = {
  origin: '',
  token: '',
};

export class SiyuanService {
  constructor(private config: SiyuanServiceConfig) {}

  async listNotebooks() {
    return await this.callApi<{
      notebooks: {
        id: string;
        closed: boolean;
        name: string;
      }[];
    }>('api/notebook/lsNotebooks');
  }

  async isAccessAble(): Promise<boolean> {
    const result = await this.listNotebooks();
    return (
      !!result.notebooks &&
      Array.isArray(result.notebooks) &&
      result.notebooks.length > 0
    );
  }

  private async callApi<T>(url: string, data?: any): Promise<T> {
    const isDevelop = import.meta.env.DEV;
    const prefix = isDevelop ? 'siyuan-proxy/' : '';
    const headers: Record<string, string> = {};
    if (this.config.token) {
      headers.Authorization = `Token ${this.config.token}}`;
    }
    const requestUrl = `${this.config.origin}/${prefix}${url}`;
    const result = await fetch(requestUrl, {
      method: 'POST',
      body: JSON.stringify(data),
      headers,
    });
    const json = await result.json();

    return json.data as Promise<T>;
  }
}

export const siyuanService = new SiyuanService(defaultConfig);
