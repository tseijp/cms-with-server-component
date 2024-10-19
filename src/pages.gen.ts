import type { PathsForPages, GetConfigResponse } from "waku/router";

import type { getConfig as ApisIndex_getConfig } from "./pages/apis/index";

type Page = {
  DO_NOT_USE_pages:
    | { path: "/apis/[api]/create"; render: "dynamic" }
    | { path: "/apis/[api]"; render: "dynamic" }
    | { path: "/apis/[api]/setting"; render: "dynamic" }
    | { path: "/apis/[api]/update/[id]"; render: "dynamic" }
    | { path: "/apis/create"; render: "dynamic" }
    | ({ path: "/apis" } & GetConfigResponse<typeof ApisIndex_getConfig>)
    | { path: "/"; render: "dynamic" }
    | { path: "/media/[id]"; render: "dynamic" }
    | { path: "/media"; render: "dynamic" };
};

declare module "waku/router" {
  interface RouteConfig {
    paths: PathsForPages<Page>;
  }
  interface CreatePagesConfig {
    pages: Page;
  }
}
