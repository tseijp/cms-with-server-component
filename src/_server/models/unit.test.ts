import { TEST_CSV } from "./test.csv";
import models, { initDb } from "@/_server/models";
import { beforeAll, describe, expect, it } from "@jest/globals";

interface Parsed {
  code: string;
  pref: string;
  city: string;
  pref_kana: string;
  city_kana: string;
}

function* parseCSV() {
  const lines = TEST_CSV.split("\n");
  for (const line of lines) {
    // 団体コード,都道府県名（漢字）,市区町村名（漢字）,都道府県名（カナ）,市区町村名（カナ）
    const [code, pref, city, pref_kana, city_kana] = line.split(",");
    yield { code, pref, city, pref_kana, city_kana } as Parsed;
  }
}

const STRUCTURES = [
  { key: "pref", value: "", title: "都道府県名（漢字）" },
  { key: "city", value: "", title: "市区町村名（漢字）" },
  { key: "pref_kana", value: "", title: "都道府県名（カナ）" },
  { key: "city_kana", value: "", title: "市区町村名（カナ）" },
];

const structures = JSON.stringify(STRUCTURES);

// 使用例:
const test_csv = parseCSV();

beforeAll(() => {
  initDb();
});

describe("Database Integration Tests", () => {
  it("create api and pages", async () => {
    let api = "";
    for (const item of test_csv)
      if (item.city) {
        await Promise.all([
          models.pages.create({
            pathname: item.code,
            title: item.city ?? null,
            api,
          }),
          ...STRUCTURES.map(({ key }) =>
            models.items.create({
              pathname: item.code,
              structure_key: key,
              structure_value: (item as any)[key] ?? null,
            })
          ),
        ]);
      } else {
        // Create root page and api
        api = item.code;
        const items = { pathname: item.code, title: item.pref };
        await Promise.all([
          models.pages.create({ ...items, api }),
          models.apis.create({ ...items, structures }),
        ]);
      }
  });

  /**
   * CRUD operations
   */
  it("CRUD operations on apis", async () => {
    // Create a new api
    const pathname = "test_api";
    await models.apis.create({ pathname });
    expect(await models.apis.get(pathname)).toBeDefined();

    // Update the api
    await models.apis.update({ pathname, title: "updated" });
    expect((await models.apis.get(pathname)).title).toBe("updated");

    // Logically delete the api
    await models.apis.remove(pathname);
    expect(await models.apis.get(pathname)).toBeUndefined();
  });

  it("CRUD operations on blobs", async () => {
    // Create a blob
    let file_data = "image_data";
    const fileInput = {
      file_name: "image.jpg",
      file_type: "image/jpeg",
      file_size: 1024 * 1024,
    };

    // Create the blob
    const id = await models.blobs.create({ file_data, ...fileInput });
    expect(await models.blobs.get(id)).toBeDefined();

    // Update the blob
    file_data = "Updated";
    await models.blobs.update({ file_data, ...fileInput, id });
    expect((await models.blobs.get(id)).file_data).toBe("Updated");

    // Delete the blob
    await models.blobs.remove(id);
    expect(await models.blobs.get(id)).toBeUndefined();
  });

  it("CRUD operations on pages", async () => {
    // Create a page
    const pathname = "test_page";
    await models.pages.create({ pathname });
    expect(await models.pages.get(pathname)).toBeDefined();

    // Update the page
    await models.pages.update({ pathname, title: "Updated" });
    expect((await models.pages.get(pathname)).title).toBe("Updated");

    // Logically delete the page
    await models.pages.softRemove(pathname);
    expect(await models.pages.get(pathname)).not.toBeNull();
  });

  it("CRUD operations on items", async () => {
    // Create a page
    const pathname = "/tmp";
    await models.pages.create({ pathname });

    // Create a content item
    const id = await models.items.create({ pathname });
    expect(models.items.get(id)).toBeDefined();

    // Update the content item
    await models.items.update({ id, structure_value: "Updated" });
    expect((await models.items.get(id)).structure_value).toBe("Updated");

    // Logically delete the content item
    await models.items.remove(id);
    expect(await models.items.get(id)).not.toBeNull();
  });
});
