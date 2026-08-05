import { Page, APIRequestContext } from "@playwright/test";
import { NavigationBar } from "./components/NavigationBar.js";
import { Footer } from "./components/Footer.js";
import { fetchCmsContent, CmsContent } from "../helpers.js";

export class BasePage {
  readonly page: Page;
  readonly request: APIRequestContext;
  readonly navbar: NavigationBar;
  readonly footer: Footer;

  constructor(page: Page, request: APIRequestContext) {
    this.page = page;
    this.request = request;
    this.navbar = new NavigationBar(page);
    this.footer = new Footer(page);
  }

  async goto(route: string): Promise<void> {
    await this.page.goto(route);
  }

  async fetchCms(pageId: string): Promise<CmsContent> {
    return await fetchCmsContent(this.request, pageId);
  }
}
