import db, { all, one, run } from "./utils";

export interface Apis {
  pathname: string;
  title?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Structure {
  key: string;
  value: string;
  title: string;
}

export const init = () => {
  db.run(/* SQL */ `DROP TABLE IF EXISTS apis`);
  db.run(/* SQL */ `
    CREATE TABLE apis (
      pathname TEXT PRIMARY KEY,
      title TEXT DEFAULT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);
};

export const get = async (pathname: string) => {
  return await one<Apis>(
    "SELECT * FROM apis WHERE pathname = ?",
    pathname,
  );
};

// List apis (excluding logically deleted ones)
export const list = async () => {
  return await all<Apis[]>("SELECT * FROM apis");
};

// Create a new api
export const create = async (input: Apis) => {
  return await run(
    "INSERT INTO apis (title, pathname) VALUES (?, ?)",
    input.title ?? null,
    input.pathname,
  );
};

// Update api information
export const update = async (input: Apis) => {
  return await run(
    'UPDATE apis SET title = ?, updated_at = datetime("now") WHERE pathname = ?',
    input.title ?? null,
    input.pathname,
  );
};

// Logically delete a api
export const remove = async (pathname: string) => {
  return await run("DELETE FROM apis WHERE pathname = ?", pathname);
};
