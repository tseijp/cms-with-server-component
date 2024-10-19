"use server";

import models from "./models";
import { randomUUID } from "crypto";
import { listStructures } from "@/utils";

/**
 * public method
 */
export async function create(api: string, formData: FormData) {
  try {
    const template = await models.templates.get(api);
    if (!template) return { statusCode: 500 };

    const pathname = (formData.get("pathname") as string) || `${randomUUID()}`;
    const structures = listStructures(template.structures);

    for (const structure of structures)
      await models.items.create({
        pathname,
        template_key: structure.key,
        template_value: formData.get(structure.key) as string,
      });
    await models.relations.create(api, pathname, "list");
    await models.pages.create({
      template: api,
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
  formData: FormData,
) {
  try {
    const template = await models.templates.get(api);
    const items = await models.items.listByPathname(pathname);
    if (!template) return { statusCode: 500 };

    for (const structure of listStructures(template.structures)) {
      const { key } = structure;
      const value = formData.get(key) as string;
      const item = items.find((item) => item.template_key === key);

      // create or update new item
      if (item) models.items.update({ ...item, template_value: value });
      else
        models.items.create({
          pathname,
          template_key: structure.key,
          template_value: value,
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
      models.pages.listByTemplate(api),
      models.pages.listTrashByTemplate(api),
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
