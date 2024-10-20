import Button from "@/_client/atoms/Button";
import Form from "@/_client/atoms/Form";
import Header from "@/_client/atoms/Header";
import Modal from "@/_client/atoms/Modal";
import Title from "@/_client/atoms/Title";
import { ConditionalDelete, UpdateStructure } from "@/_client/setting";
import PagesTable from "@/_client/table";
import actions from "@/_server";
import models from "@/_server/models";
import { listStructures } from "@/_utils";

interface Props {
  api: string;
}

export default async function CMSApisIdSettingPage(props: Props) {
  const { api } = props;
  const Api = await models.apis.get(api);
  if (!Api) return "Api Not Found";

  const pages = await models.pages.listByApi(api);
  const structures = listStructures(Api.structures);

  return (
    <>
      <Form _action={actions.apis.update.bind(null, api)}>
        <Header
          active
          title={api}
          href={`/apis/${api}/setting`}
          setting="API 設定"
        >
          <div className="flex justify-end w-full gap-2.5">
            <Button type="submit" className="text-white bg-[#FB773F]">
              更新
            </Button>
          </div>
        </Header>
        <Title title="API スキーマ">
          <UpdateStructure items={structures} />
        </Title>
      </Form>
      <Title title="削除したコンテンツ">
        <div>
          <PagesTable api={api} isDeleted />
        </div>
      </Title>
      <Title title="重要な操作">
        <Modal small>
          <Button className="flex-0 h-12 border border-[#DC2647] text-[#DC2647] hover:opacity-50 disabled:opacity-25">
            コンテンツを完全に削除
          </Button>
          <Form
            _action={actions.pages.remove.bind(null, Api.pathname)}
            className="p-10"
          >
            <ConditionalDelete value={Api.pathname} />
          </Form>
        </Modal>
        <Modal small>
          <Button
            disabled={pages.length > 0}
            className="flex-0 h-12 border border-[#DC2647] text-[#DC2647] hover:opacity-50 disabled:opacity-25"
          >
            API を完全に削除
          </Button>
          <Form
            _action={actions.apis.remove.bind(null, Api.pathname)}
            className="p-10"
          >
            <ConditionalDelete value={Api.pathname} />
          </Form>
        </Modal>
      </Title>
    </>
  );
}
