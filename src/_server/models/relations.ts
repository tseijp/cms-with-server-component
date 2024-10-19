import db, { all, one, run } from "..";

export interface Relations {
  page_from: string;
  page_to: string;
  direction: string;
  created_at?: string;
  updated_at?: string;
}

export const init = () => {
  db.run(/* SQL */ `DROP TABLE IF EXISTS relations`);
  db.run(/* SQL */ `
    CREATE TABLE relations (
      page_from TEXT NOT NULL,
      page_to TEXT NOT NULL,
      direction TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      PRIMARY KEY (page_from, page_to),
      FOREIGN KEY (page_from) REFERENCES pages(id),
      FOREIGN KEY (page_to) REFERENCES pages(id)
    );
  `);
};

export const get = async (id: number) => {
  return await one<Relations>(
    "SELECT * FROM relations WHERE id = ? AND deleted_at IS NULL",
    id,
  );
};

// List relations for a specific page with optional direction filtering
export const listByPathname = async (
  pathname: string,
  directions: string[] = [],
) => {
  let query = "SELECT * FROM relations WHERE page_from = ?";

  if (directions.length <= 0) return await all<Relations[]>(query, pathname);

  const placeholders = directions.map(() => "?").join(", ");
  query += ` AND direction IN (${placeholders})`;

  return await all<Relations[]>(query, pathname, ...directions);
};

// Create a relationship between two pages
export const create = async (from: string, to: string, dir: string) => {
  return await run(
    "INSERT INTO relations (page_from, page_to, direction) VALUES (?, ?, ?)",
    from,
    to,
    dir,
  );
};

export const remove = async (from: string, to: string, dir: string) => {
  await run(
    "DELETE FROM relations WHERE page_from = ? AND page_to = ? AND direction = ?",
    from,
    to,
    dir,
  );
};
