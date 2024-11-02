"use server";

import models from "./models";

export async function create(api: string) {
  try {
    await models.forms.create({ api });
    const redirect = `/apis/${api}/setting`;
    return { statusCode: 200, redirect };
  } catch (error) {
    console.error(error);
    return { statusCode: 500 };
  }
}

export async function update(api: string, formData: FormData) {
  try {
    const forms = await models.forms.listByApi(api);
    const names = formData.getAll("name") as string[];
    const titles = formData.getAll("title") as string[];
    const promises = forms.map((form, index) => {
      const form_name = names[index]!;
      const form_title = titles[index]!;
      return models.forms.update({ ...form, form_name, form_title });
    });
    await Promise.all(promises);
    const redirect = `/apis/${api}`;
    return { statusCode: 200, redirect };
  } catch (error) {
    console.error(error);
    return { statusCode: 500 };
  }
}

export async function remove(api: string, id: number) {
  try {
    const items = await models.items.listByForm(id);
    await Promise.all([
      models.forms.remove(id),
      ...items.map((item) => models.items.remove(item.id)),
    ]);
    const redirect = `/apis/${api}/setting`;
    return { statusCode: 200, redirect };
  } catch (error) {
    console.error(error);
    return { statusCode: 500 };
  }
}
