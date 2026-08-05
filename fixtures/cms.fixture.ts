import { test as base } from "@playwright/test";
import { fetchCmsContent, CmsContent } from "../tests/helpers.js";

export interface NavigationLink {
  name: string;
  href: string;
  visible?: boolean;
}

type CmsDefinitions = {
  navCms: { links: NavigationLink[] };
  homeCms: CmsContent;
  corporateCms: CmsContent;
  footerCms: CmsContent;
};

export const test = base.extend<CmsDefinitions>({
  navCms: async ({ request }, use) => {
    const data = (await fetchCmsContent(request, "navigation")) as { links: NavigationLink[] };
    await use(data);
  },
  homeCms: async ({ request }, use) => {
    const data = await fetchCmsContent(request, "home");
    await use(data);
  },
  corporateCms: async ({ request }, use) => {
    const data = await fetchCmsContent(request, "corporate");
    await use(data);
  },
  footerCms: async ({ request }, use) => {
    const data = await fetchCmsContent(request, "footer");
    await use(data);
  },
});
