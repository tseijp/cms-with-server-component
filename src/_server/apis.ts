"use server";

import models from "./models";

/**
 * public method
 */
export async function create(formData: FormData) {
  try {
    const title = formData.get("title") as string | null;
    const pathname = formData.get("pathname") as string | null;
    if (!title || !pathname)
      throw new Error(`apis/create Error: no title or pathname`);
    await models.apis.create({ title, pathname });
    const redirect = `/apis/${pathname}/setting`;
    return { statusCode: 200, redirect };
  } catch (error) {
    console.error(error);
    return { statusCode: 500 };
  }
}

export async function update(api: string, formData: FormData) {
  try {
    const keys = formData.getAll("key");
    const values = formData.getAll("value");
    const titles = formData.getAll("title");
    const items = [];

    for (let i = 0; i < keys.length; i++)
      items.push({ key: keys[i], value: values[i], title: titles[i] });

    const item = await models.apis.get(api);
    if (!item) throw new Error(`settings Error: no ${api} apis`);

    const structures = JSON.stringify(items);
    models.apis.update({ ...item, structures });

    const redirect = `/apis/${api}`;
    return { statusCode: 200, redirect };
  } catch (error) {
    console.error(error);
    return { statusCode: 500 };
  }
}

export async function remove(api: string) {
  try {
    await models.apis.remove(api);
    const redirect = `/apis`;
    return { statusCode: 200, redirect };
  } catch (error) {
    console.error(error);
    return { statusCode: 500 };
  }
}