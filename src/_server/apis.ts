"use server";

import models from "./models";
import { Forms } from "./models/forms";

/**
 * public method
 */
export async function create(formData: FormData) {
  try {
    const title = formData.get("title") as string | null;
    const api = formData.get("api") as string | null;
    if (!title || !api) throw new Error(`apis/create Error: no title or api`);

    // insert new api
    await models.apis.create({ title, api });
    const redirect = `/apis/${api}/setting`;
    return { statusCode: 200, redirect };
  } catch (error) {
    console.error(error);
    return { statusCode: 500 };
  }
}

export async function update(api: string, formData: FormData) {
  try {
    const ids = formData.getAll("id") as string[];
    const forms = formData.getAll("form") as string[];
    const titles = formData.getAll("title") as string[];

    // list forms by api
    const current = await models.forms.listByApi(api);
    const id2form = new Map<string, Forms>()
    for (const form of current) id2form.set(`${form.id}`, form);
console.log({api, ids, forms, titles})
    // update form data
    await Promise.all(ids.map((id, i) => {
      const form = forms[i]!;
      const title = titles[i]!;
      console.log(id2form.has(id) ? "create" : "update");
      if (id2form.has(id)) return models.forms.create({ api, form, title });
      else return models.forms.update({ id: Number(id), api, form, title });
    }))

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