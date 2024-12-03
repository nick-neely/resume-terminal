export interface SiteConfig {
  name: {
    full: string;
    short: string;
    legal: string;
  };
  seo: {
    title: string;
    description: string;
    category: string;
    keywords: string[];
    url: string;
    author: {
      name: string;
      url: string;
    };
    creator: string;
    publisher: string;
  };
}
