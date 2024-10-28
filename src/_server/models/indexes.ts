import db, { all, one, run } from "./utils";

export interface Indexes {
  id: number;
  api: string;
  title?: string | null;
  created_at?: string;
  updated_at?: string;
}

export const init = () => {
  db.run(/* SQL */ `DROP TABLE IF EXISTS indexes`);
  db.run(/* SQL */ `
    CREATE TABLE indexes (
      id INTEGER PRIMARY KEY,
      api TEXT NOT NULL,
      title TEXT DEFAULT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (api) REFERENCES apis(api)
    );
  `);
};

// Get text data from indexes
export const list = async () => {
  return await all<Indexes[]>("SELECT * FROM indexes");
};

export const listByApi = async (api: string) => {
  return await all<Indexes[]>(
    "SELECT * FROM indexes WHERE api = ?",
    api
  );
};

export const get = async (id: number) => {
  return await one<Indexes>("SELECT * FROM indexes WHERE id = ?", id);
};

// Create indexes for the page
export const create = async (input: Omit<Indexes, "id">) => {
  return await run(
    "INSERT INTO indexes (api, title) VALUES (?, ?)",
    input.api,
    input.title ?? null
  );
};

// Update a content_item
export const update = async (input: Indexes) => {
  return await run(
    'UPDATE indexes SET api = ?, title = ?, updated_at = datetime("now") WHERE id = ?',
    input.api ?? null,
    input.title ?? null,
    input.id
  );
};

// Logically delete a content_item
export const remove = async (id: number) => {
  return await run("DELETE FROM indexes WHERE id = ?", id);
};
