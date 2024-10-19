import actions from "@/_server/actions";
import { DeleteButton, UploadButton } from "@/_client/media";
import Datetime from "@/_client/atoms/DateTime";
import Header from "@/_client/atoms/Header";
import Table, { LinkedTableRow } from "@/_client/atoms/Table";
import models from "@/_server/models";
import { Blobs } from "@/_server/models/blobs";
import React from "react";

interface Props {
  id: string;
}

interface FilePreviewProps extends React.HTMLProps<HTMLImageElement> {
  blob: Blobs;
}

function FilePreview(props: FilePreviewProps) {
  const { blob, className } = props;

  if (blob.file_type.startsWith("image/"))
    return (
      <img
        src={`data:${blob.file_type};base64,${blob.file_data}`}
        alt={blob.file_name}
        className={`object-cover rounded ${className}`}
      />
    );
  return null;
}

export default async function CMSMediaPage(props: Props) {
  const { id: idList } = props;
  const [id] = idList;

  const blobs = await models.blobs.list();
  const blob = blobs.find((blob) => `${blob.id}` === id);

  return (
    <>
      <Header title="メディア管理" href={`/cms/media/setting`} setting="設定">
        <input
          placeholder="検索"
          className="rounded px-3 w-60 h-10 bg-[#F8F9FD]"
        />
        <UploadButton
          plus
          _action={actions.media.create}
          className="text-white rounded bg-[#563BFE]"
        >
          アップロード
        </UploadButton>
      </Header>
      <div className="mx-10 mt-5 flex">
        <Table>
          <tr className="flex border-bottom border-[#E5E5F2]">
            <th />
            <th>ファイル名</th>
            <th>形式</th>
            <th>作成日</th>
            <th>更新日</th>
          </tr>
          {blobs.map((blob) => (
            <LinkedTableRow
              key={blob.id}
              href={`/cms/media/${blob.id}`}
              active={`${blob.id}` === id}
            >
              <td className="h-[112px]">
                <FilePreview blob={blob} className="h-16" />
              </td>
              <td>{blob.file_name}</td>
              <td>
                <a href={`${blob.id}`}>{blob.file_type}</a>
              </td>
              <td>
                <Datetime date={blob.created_at} />
              </td>
              <td>
                <Datetime datetime={blob.updated_at} />
              </td>
            </LinkedTableRow>
          ))}
        </Table>
        <div className="shrink-0 w-[340px] h-full pl-12 top-9 right-0 flex flex-col gap-4">
          {blob ? (
            <>
              <div className="h-[180px]">
                <FilePreview blob={blob} className="w-[340px] h-[180px]" />
              </div>
              <div className="max-w-[340px]">{blob.file_name}</div>
              <div className="grid grid-cols-[128px_1fr] gap-y-2">
                <div className="font-bold">作成日時</div>
                <div>
                  <Datetime datetime={blob.created_at} />
                </div>
                <div className="font-bold">形式</div>
                <div>{blob.file_type}</div>
                <div className="font-bold">容量</div>
                <div>{(blob.file_size / 1024 / 1024).toFixed(2)} MB</div>
              </div>
              <div className="fixed right-10 bottom-10 flex gap-4">
                <UploadButton
                  _action={actions.media.update.bind(null, blob.id)}
                  className="w-[162px] h-12 border border-[#563BFF] text-[#563BFF] hover:opacity-50"
                >
                  再アップロード
                </UploadButton>
                <DeleteButton
                  _action={actions.media.remove.bind(null, blob.id)}
                  blobId={blob.id}
                  className="w-[162px] h-12 border border-[#DC2647] text-[#DC2647] hover:opacity-50"
                >
                  削除
                </DeleteButton>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
