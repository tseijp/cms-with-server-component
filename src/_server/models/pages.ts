import * as modelsItems from "./items";
import db, { all, one, run } from "./utils";

export interface Pages {
  pathname: string;
  title?: string | null;
  metadata?: string | null;
  template?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  publish_at?: string;
}

export const init = () => {
  db.run(/* SQL */ `DROP TABLE IF EXISTS pages`);
  db.run(/* SQL */ `
    CREATE TABLE pages (
      pathname TEXT PRIMARY KEY,
      title TEXT DEFAULT NULL,
      metadata JSON DEFAULT NULL,
      template JSON DEFAULT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      deleted_at TEXT DEFAULT NULL,
      publish_at TEXT DEFAULT NULL,
      FOREIGN KEY (template) REFERENCES templates(template)
    );
  `);
};

// Get page
export const get = async (pathname: string) => {
  return await one<Pages>(
    "SELECT * FROM pages WHERE pathname = ? AND deleted_at IS NULL",
    pathname,
  );
};

export const list = async () => {
  return await all<Pages[]>("SELECT * FROM pages WHERE deleted_at IS NULL");
};

// List pages created from a specific template
export const listByTemplate = async (template: string) => {
  return await all<Pages[]>(
    `SELECT * FROM pages WHERE template = ? AND deleted_at IS NULL`,
    template,
  );
};

export const listTrashByTemplate = async (template: string) => {
  return await all<Pages[]>(
    `SELECT * FROM pages WHERE template = ? AND deleted_at IS NOT NULL`,
    template,
  );
};

// Create a new page from a PDF
export const create = async (input: Omit<Pages, "id">) => {
  return await run(
    "INSERT INTO pages (template, pathname, title, metadata) VALUES (?, ?, ?, ?)",
    input.template ?? null,
    input.pathname ?? null,
    input.title ?? null,
    input.metadata ?? null,
  );
};

// Update page information
export const update = async (input: Pages) => {
  return await run(
    'UPDATE pages SET template = ?, title = ?, metadata = ?, updated_at = datetime("now") WHERE pathname = ?',
    input.template ?? null,
    input.title ?? null,
    input.metadata ?? null,
    input.pathname,
  );
};

// Logically delete a page
export const softRemove = async (pathname: string) => {
  return await run(
    'UPDATE pages SET deleted_at = datetime("now") WHERE pathname = ?',
    pathname,
  );
};

export const hardRemove = async (pathname: string) => {
  const items = await modelsItems.listByPathname(pathname);
  Promise.all([...items.map((item) => modelsItems.remove(item.id))]);
  return await run("DELETE FROM pages WHERE pathname = ?", pathname);
};
