"use client";

import Border from "./atoms/Border";
import Button from "./atoms/Button";
import TextInput from "./atoms/TextInput";
import { Forms } from "@/_server/models/forms";
import React, { Fragment, useState } from "react";

interface Props {
  forms: Partial<Forms>[];
}

export function UpdateStructure(props: Props) {
  const [forms, set] = useState(props.forms);

  const handleClick = () => {
    set((p) => [...p, {}]);
  };

  const handleRemove = (index = 0) => {
    return () => {
      set((p) => p.filter((_, i) => i !== index));
    };
  };

  return (
    <>
      {forms.map((form, index) => (
        <Fragment key={index}>
          <div className="relative flex w-full gap-10">
            <button
              type="submit"
              onClick={handleRemove(index)}
              className="absolute right-0 -top-6"
            >
              削除
            </button>
            <input name="id" value={form.id} className="hidden" />
            <div className="flex flex-col w-full">
              <TextInput
                title="APIキー"
                name="form"
                defaultValue={form.form ?? ""}
              />
            </div>
            <div className="flex flex-col w-full">
              <TextInput
                title="表示名"
                name="title"
                defaultValue={form.title ?? ""}
              />
            </div>
          </div>
          <Border />
        </Fragment>
      ))}
      <Button
        onClick={handleClick}
        className="text-[#563BFE] border border-[#563BFE]"
      >
        <span className="mr-4">+</span>
        フィールドを追加
      </Button>
    </>
  );
}

export function ConditionalDelete({ value }: { value: string }) {
  const [isValid, set] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    set(value === e.target.value);
  };

  return (
    <div className="flex flex-col">
      <TextInput
        title={`確認：${value} と入力`}
        placeholder={value}
        onChange={handleChange}
      />
      <Button
        disabled={!isValid}
        type="submit"
        className="flex-0 h-12 border border-[#DC2647] text-[#DC2647] hover:opacity-50 disabled:opacity-25"
      >
        全てを削除
      </Button>
    </div>
  );
}
