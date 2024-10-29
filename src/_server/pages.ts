"use server";

import models from "./models";
import { randomUUID } from "crypto";

/**
 * public method
 */
export async function create(api: string, formData: FormData) {
  try {
    const forms = await models.forms.listByApi(api);
    const pathname = (formData.get("pathname") as string) || `${randomUUID()}`;
    const title = (formData.get("title") as string) || "";
    for (const form of forms)
      await models.items.create({
        pathname,
        form_id: form.id,
        content: formData.get(form.form!) as string,
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
    const forms = await models.forms.listByApi(api);
    const items = await models.items.listByPathname(pathname);
    for (const form of forms) {
      const content = formData.get(form.form!) as string;
      const item = items.find(({ form_id }) => form_id === form.id);
      if (item) models.items.update({ ...item, content });
      else models.items.create({ pathname, form_id: form.id, content });
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
