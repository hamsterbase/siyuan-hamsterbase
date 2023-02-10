export interface SiyuanServiceConfig {
  origin: string;
  token: string;
}

const defaultConfig: SiyuanServiceConfig = {
  origin: '/',
  token: '',
};

export class SiyuanService {
  constructor(private config: SiyuanServiceConfig) {}

  async listNotebooks() {
    await this.callApi('api/notebook/lsNotebooks');
  }

  async isAccessAble(): Promise<boolean> {
    return false;
  }

  private async callApi<T>(url: string, data?: any): Promise<T> {
    const headers: Record<string, string> = {};
    if (this.config.token) {
      headers.Authorization = `Token ${this.config.token}}`;
    }
    const result = await fetch(`${this.config.origin}/${url}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers,
    });
    const json = await result.json();
    return json.data as Promise<T>;
  }
}

export const siyuanService = new SiyuanService(defaultConfig);
