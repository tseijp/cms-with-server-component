"use server";

import models from "./models";
import { listStructures } from "@/utils";
import { randomUUID } from "crypto";

/**
 * public method
 */
export async function create(api: string, formData: FormData) {
  try {
    const Api = await models.apis.get(api);
    if (!Api) return { statusCode: 500 };

    const pathname = (formData.get("pathname") as string) || `${randomUUID()}`;
    const structures = listStructures(Api.structures);

    for (const structure of structures)
      await models.items.create({
        pathname,
        structure_key: structure.key,
        structure_value: formData.get(structure.key) as string,
      });
    await models.pages.create({
      api,
      pathname,
      title: "xxx",
      metadata: "{}",
    });
    return { statusCode: 200, message: "", redirect: `/apis/${api}` };
  } catch (error) {
    console.error(error);
    return { statusCode: 500 };
  }
}

export async function update(
  api: string,
  pathname: string,
  formData: FormData
) {
  try {
    const Api = await models.apis.get(api);
    const items = await models.items.listByPathname(pathname);
    if (!Api) return { statusCode: 500 };

    for (const structure of listStructures(Api.structures)) {
      const { key } = structure;
      const value = formData.get(key) as string;
      const item = items.find((item) => item.structure_key === key);

      // create or update new item
      if (item) models.items.update({ ...item, structure_value: value });
      else
        models.items.create({
          pathname,
          structure_key: structure.key,
          structure_value: value,
        });
    }
    const redirect = `/apis/${api}`;
    return { statusCode: 200, message: "", redirect };
  } catch (error) {
    console.error(error);
    return { statusCode: 500 };
  }
}

export async function remove(api: string) {
  try {
    const [pages, trashes] = await Promise.all([
      models.pages.listByApi(api),
      models.pages.listTrashByApi(api),
    ]);

    await Promise.all([
      ...pages.map((page) => models.pages.hardRemove(page.pathname)),
      ...trashes.map((page) => models.pages.hardRemove(page.pathname)),
    ]);
    const redirect = `/apis/${api}`;
    return { statusCode: 200, message: "", redirect };
  } catch (error) {
    console.error(error);
    return { statusCode: 500 };
  }
}

export async function allRemove(pathname: string, isDeleted = false) {
  try {
    if (isDeleted) {
      await models.pages.hardRemove(pathname);
    } else await models.pages.softRemove(pathname);
    return { statusCode: 200 };
  } catch (error) {
    console.error(error);
    return { statusCode: 500 };
  }
}
