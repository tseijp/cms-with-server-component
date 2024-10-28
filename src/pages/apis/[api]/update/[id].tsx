import Button from "@/_client/atoms/Button";
import Form from "@/_client/atoms/Form";
import Header from "@/_client/atoms/Header";
import TextInput from "@/_client/atoms/TextInput";
import Title from "@/_client/atoms/Title";
import actions from "@/_server";
import models from "@/_server/models";

interface Props {
  api: string;
  id: string;
}

export default async function CMSApisIdUpdatePage(props: Props) {
  const { api, id } = props;

  const [Api, indexes] = await Promise.all([
    models.apis.get(api),
    models.indexes.listByApi(api),
  ]);

  if (!Api) return "Api Not Found";

  const page = await models.pages.get(id);
  if (!page) return "Pages Not Found";

  const items = await models.items.listByPathname(page.pathname);

  const getValue = (id: number) => {
    const current = items.find(({ index_id }) => index_id === id);
    return current?.content ?? "";
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
        {indexes.map(({ id, title }) => (
          <TextInput
            key={id}
            name={`id_${id}`}
            title={title ?? ""}
            defaultValue={getValue(id)}
          />
        ))}
      </Title>
    </Form>
  );
}
