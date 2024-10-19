import { LinkButton } from "@/_client/atoms/Button";
import Header from "@/_client/atoms/Header";
import Table from "@/_client/atoms/Table";
import models from "@/_server/models";
import Datetime from "@/_client/atoms/DateTime";
import { TableRow } from "@/_client/pages";


export default async function ApisPage() {
  const templates = await models.templates.list();
  return (
    <>
      <Header title="API管理">
        <input
          placeholder="検索"
          className="rounded px-3 w-60 h-10 bg-[#F8F9FD]"
        />
        <LinkButton
          plus
          href={`/apis/create`}
          className="text-white rounded bg-[#563BFE]"
        >
          追加
        </LinkButton>
      </Header>
      <Table className="px-10 py-4">
        <tr className="flex border-bottom border-[#E5E5F2]">
          <th>API 名</th>
          <th>エンドポイント</th>
          <th>作成日</th>
          <th>更新日</th>
        </tr>
        {templates.map((item) => (
          <TableRow
            key={item.pathname}
            href={`/apis/${item.pathname}`}
            className="flex hover:bg-[#F2FCFF] cursor-pointer"
          >
            <td>{item.title}</td>
            <td>{item.pathname}</td>
            <td>
              <Datetime date={item.created_at} />
            </td>
            <td>
              <Datetime datetime={item.updated_at} />
            </td>
          </TableRow>
        ))}
      </Table>
    </>
  );
}

export const getConfig = async () => {
  return {
    render: "static",
  } as const;
};
