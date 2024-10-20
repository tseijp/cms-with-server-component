import * as apis from "./apis";
import * as blobs from "./blobs";
import * as indexes from "./indexes";
import * as items from "./items";
import * as pages from "./pages";
import db from "./utils";


export function initDb() {
  db.serialize(() => {
    apis.init();
    blobs.init();
    indexes.init();
    items.init();
    pages.init();
  });
}

export default {
  apis,
  blobs,
  indexes,
  items,
  pages,
};