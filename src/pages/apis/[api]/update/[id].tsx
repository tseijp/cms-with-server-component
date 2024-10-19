import actions from "@/_server";
import Button from "@/_client/atoms/Button";
import Header from "@/_client/atoms/Header";
import TextInput from "@/_client/atoms/TextInput";
import Title from "@/_client/atoms/Title";
import models from "@/_server/models";
import { Structure } from "@/_server/models/templates";
import { listStructures } from "@/utils";
import Form from "@/_client/atoms/Form";

interface Props {
  api: string;
  id: string;
}

export default async function CMSApisIdUpdatePage(props: Props) {
  const { api, id } = props;

  const template = await models.templates.get(api);
  if (!template) return "Template Not Found";

  const page = await models.pages.get(id);
  if (!page) return "Pages Not Found";

  const structures = listStructures(template.structures);
  const items = await models.items.listByPathname(page.pathname);

  const getValue = (structure: Structure) => {
    const current = items.find((i) => i.template_key === structure.key);
    if (typeof current?.template_value !== "string") return structure.value;
    return current.template_value;
  };

  return (
    <Form _action={actions.pages.update.bind(null, api, id)}>
      <Header title={api} setting="API 設定" href={`/apis/${api}/setting`}>
        {/* <Button className="text-[#563BFE] border border-[#563BFE]">
            下書きを保存
          </Button> */}
        <div />
        <Button type="submit" className="text-white bg-[#FB773F]">
          更新
        </Button>
      </Header>
      <Title title="コンテンツ">
        {structures.map((item) => (
          <TextInput
            key={item.key}
            name={item.key}
            title={item.title}
            defaultValue={getValue(item)}
          />
        ))}
      </Title>
    </Form>
  );
}
