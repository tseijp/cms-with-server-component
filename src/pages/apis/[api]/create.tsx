import Button from "@/_client/atoms/Button";
import Form from "@/_client/atoms/Form";
import Header from "@/_client/atoms/Header";
import TextInput from "@/_client/atoms/TextInput";
import Title from "@/_client/atoms/Title";
import actions from "@/_server";
import models from "@/_server/models";
import { listStructures } from "@/_utils";

interface Props {
  api: string;
}

export default async function CMSApisIdCreatePage(props: Props) {
  const { api } = props;

  const Api = await models.apis.get(api);
  if (!Api) return "Api Not Found";

  const structures = listStructures(Api.structures);

  return (
    <Form _action={actions.pages.create.bind(null, api)}>
      <Header title={api} setting="API 設定" href={`/apis/${api}/setting`}>
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
