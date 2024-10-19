import db, { all, one, run } from "./utils";

export interface Templates {
  pathname: string;
  title?: string | null;
  structures?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Structure {
  key: string;
  value: string;
  title: string;
}

export const init = () => {
  db.run(/* SQL */ `DROP TABLE IF EXISTS templates`);
  db.run(/* SQL */ `
    CREATE TABLE templates (
      pathname TEXT PRIMARY KEY,
      title TEXT DEFAULT NULL,
      structures JSON DEFAULT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);
};

export const get = async (pathname: string) => {
  return await one<Templates>(
    "SELECT * FROM templates WHERE pathname = ?",
    pathname,
  );
};

// List templates (excluding logically deleted ones)
export const list = async () => {
  return await all<Templates[]>("SELECT * FROM templates");
};

// Create a new template
export const create = async (input: Templates) => {
  return await run(
    "INSERT INTO templates (title, structures, pathname) VALUES (?, ?, ?)",
    input.title ?? null,
    input.structures ?? null,
    input.pathname,
  );
};

// Update template information
export const update = async (input: Templates) => {
  return await run(
    'UPDATE templates SET title = ?, structures = ?, updated_at = datetime("now") WHERE pathname = ?',
    input.title ?? null,
    input.structures ?? null,
    input.pathname,
  );
};

// Logically delete a template
export const remove = async (pathname: string) => {
  return await run("DELETE FROM templates WHERE pathname = ?", pathname);
};
