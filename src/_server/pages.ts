"use server";

import models from "./models";
import { randomUUID } from "crypto";

/**
 * public method
 */
export async function create(api: string, formData: FormData) {
  try {
    const [Api, indexes] = await Promise.all([
      models.apis.get(api),
      models.indexes.listByApi(api),
    ]);
    if (!Api) return { statusCode: 500 };

    const pathname = (formData.get("pathname") as string) || `${randomUUID()}`;
    const title = (formData.get("title") as string) || "";

    for (const index of indexes)
      await models.items.create({
        pathname,
        index_id: index.id,
        content: formData.get(`id_${index.id}`) as string,
      });

    await models.pages.create({
      api,
      pathname,
      title,
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
    const [Api, indexes] = await Promise.all([
      models.apis.get(api),
      models.indexes.listByApi(api),
    ]);
    const items = await models.items.listByPathname(pathname);
    if (!Api) return { statusCode: 500 };

    for (const index of indexes) {
      const content = formData.get(`id_${index.id}`) as string;
      const item = items.find(({ index_id }) => index_id === index.id);
      if (item) models.items.update({ ...item, content });
      else models.items.create({ pathname, index_id: index.id, content });
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
