import { SiyuanService, siyuanService } from './siyuan';
import { keys } from './../storage';
import { HamsterBase, Webpage } from '@hamsterbase/sdk';
import ejs from 'ejs';
//@ts-expect-error
import md5 from 'crypto-js/md5';

export interface HamsterBaseConfig {
  endpoint: string;
  apiToken: string;
  folder: string;
  notebook: string;
}

export const defaultHamsterBaseConfig: HamsterBaseConfig = {
  endpoint: localStorage.getItem(keys.hamsterbase_endpoint) ?? '',
  apiToken: localStorage.getItem(keys.hamsterbase_api_token) ?? '',
  folder:
    localStorage.getItem(keys.hamsterbase_folder) ?? 'hamsterbase/highlights',
  notebook: localStorage.getItem(keys.siyuan_notebook) ?? '',
};

export class HighlightsSyncService {
  public config: HamsterBaseConfig;

  constructor(private siyuanService: SiyuanService) {
    this.config = defaultHamsterBaseConfig;
  }

  updateConfig(config: HamsterBaseConfig) {
    this.config = config;
    localStorage.setItem(keys.hamsterbase_endpoint, config.endpoint!);
    localStorage.setItem(keys.hamsterbase_api_token, config.apiToken!);
    localStorage.setItem(keys.hamsterbase_folder, config.folder!);
    localStorage.setItem(keys.siyuan_notebook, config.notebook!);
  }

  async getWebpages(): Promise<Webpage[]> {
    if (!this.config.endpoint || !this.config.apiToken) {
      throw new Error('no endpoint or token');
    }
    const hamsterbase = new HamsterBase({
      endpoint: this.config.endpoint,
      token: this.config.apiToken,
      requestLib: fetch,
    });
    const result = await hamsterbase.webpages.list({
      annotated: true,
      per_page: 10000,
    });
    const webpages = await Promise.all(
      result.webpages.map((p) => {
        return hamsterbase.webpages.get(p.id);
      })
    );
    return webpages;
  }

  async sync() {
    const res = await this.siyuanService.checkNotebookOpen(
      this.config.notebook
    );
    if (!res) {
      return;
    }
    const webpages = await this.getWebpages();
    for (const webpage of webpages) {
      try {
        const pageName =
          this.config.folder + '/' + webpage.title.replace(/\//g, '\\');

        const { templateHash, hamsterbaseId, markdown } = render(webpage);

        const pageId = await this.siyuanService.getIdByHPath('/' + pageName);
        if (pageId !== null) {
          const attrs = await this.siyuanService.getBlockAttrs(pageId);
          if (
            attrs[`custom-hamsterbaseId`] === hamsterbaseId &&
            attrs[`custom-templateHash`] === templateHash
          ) {
            console.log('已存在，跳过');
            continue;
          }
          await siyuanService.deletePage(pageId);
        }
        const id = await this.siyuanService.createNote(
          this.config.notebook,
          pageName,
          markdown
        );
        await this.siyuanService.setBlockAttrs(id, {
          [`custom-hamsterbaseId`]: hamsterbaseId,
          [`custom-templateHash`]: templateHash,
        });
      } catch (error) {}
    }
  }
}

function render(webpage: Webpage) {
  const template = `## metadata
title: <%= title %>     
<% if (link) { %>
link: <%= link %>
<% } %> 

## Highlights

<% for (const highlight of highlights) { %>
-  > <%= highlight.text %>
<% if (highlight.note) { %>
    <%= highlight.note %>
<% } %> 
<% } %>`;

  const markdown = ejs.compile(template)(webpage);
  const templateHash = md5(template).toString();

  return {
    templateHash,
    markdown,
    hamsterbaseId: webpage.id,
  };
}
