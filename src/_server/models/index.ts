import * as blobs from "./blobs";
import * as items from "./items";
import * as pages from "./pages";
import * as relations from "./relations";
import * as templates from "./templates";
import db from "./utils";

export function initDb() {
  db.serialize(() => {
    blobs.init();
    items.init();
    pages.init();
    relations.init();
    templates.init();
  });
}

export default {
  blobs,
  items,
  pages,
  relations,
  templates,
};
