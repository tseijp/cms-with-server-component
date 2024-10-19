import db, { all, one, run } from "..";

export interface ContentItems {
  id: number;
  pathname?: string | null;
  blob_id?: number | null;
  template_key?: string | null;
  template_value?: string | null;
  created_at?: string;
  updated_at?: string;
}

export const init = () => {
  db.run(/* SQL */ `DROP TABLE IF EXISTS items`);
  db.run(/* SQL */ `
    CREATE TABLE items (
      id INTEGER PRIMARY KEY,
      blob_id INTEGER DEFAULT NULL,
      pathname TEXT DEFAULT NULL,
      template_key TEXT DEFAULT NULL,
      template_value TEXT DEFAULT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (blob_id) REFERENCES blobs(id),
      FOREIGN KEY (pathname) REFERENCES pages(id)
    );
  `);
};

// Get text data from items (excluding logically deleted ones)
export const list = async () => {
  return await all<ContentItems[]>("SELECT * FROM items");
};

export const listByPathname = async (pathname: string) => {
  return await all<ContentItems[]>(
    "SELECT * FROM items WHERE pathname = ?",
    pathname,
  );
};

export const get = async (id: number) => {
  return await one<ContentItems>("SELECT * FROM items WHERE id = ?", id);
};

// Create items for the page
export const create = async (input: Omit<ContentItems, "id">) => {
  return await run(
    "INSERT INTO items (pathname, template_key, template_value, blob_id) VALUES (?, ?, ?, ?)",
    input.pathname ?? null,
    input.template_key ?? null,
    input.template_value ?? null,
    input.blob_id ?? null,
  );
};

// Update a content_item
export const update = async (input: ContentItems) => {
  return await run(
    'UPDATE items SET template_key = ?, template_value = ?, blob_id = ?, updated_at = datetime("now") WHERE id = ?',
    input.template_key ?? null,
    input.template_value ?? null,
    input.blob_id ?? null,
    input.id,
  );
};

// Logically delete a content_item
export const remove = async (id: number) => {
  return await run("DELETE FROM items WHERE id = ?", id);
};
