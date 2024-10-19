import Button from "@/_client/atoms/Button";
import Form from "@/_client/atoms/Form";
import Header from "@/_client/atoms/Header";
import TextInput from "@/_client/atoms/TextInput";
import Title from "@/_client/atoms/Title";
import actions from "@/_server/actions";
import models from "@/_server/models";
import { listStructures } from "@/utils";

interface Props {
  api: string;
}

export default async function CMSApisIdCreatePage(props: Props) {
  const { api } = props;

  const template = await models.templates.get(api);
  if (!template) return { statusCode: 500, redirect: `/cms/apis` };

  const structures = listStructures(template.structures);

  return (
    <Form _action={actions.pages.create.bind(null, api)}>
      <Header title={api} setting="API 設定" href={`/cms/apis/${api}/setting`}>
        <div />
        <Button type="submit" className="text-white bg-[#FB773F]">
          公開
        </Button>
      </Header>
      {/*
      <Title title="リンク">
        <TextInput name="pathname" title="リンク" defaultValue={randomUUID()} />
      </Title>
      */}
      <Title title="コンテンツ">
        {structures.map((item) => (
          <TextInput
            key={item.key}
            name={item.key}
            title={item.title}
            defaultValue={item.value}
          />
        ))}
      </Title>
    </Form>
  );
}
