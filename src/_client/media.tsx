"use client";

import Button from "./atoms/Button";
import React, { useRef } from "react";
import Form, { FormActionResponse } from "./atoms/Form";

interface Props extends React.HTMLProps<HTMLFormElement> {
  plus?: boolean;
  _action: (formData: FormData) => Promise<FormActionResponse>;
}

export function UploadButton(props: Props) {
  const { children, className, plus, _action, ...formProps } = props;
  const formRef = useRef<HTMLFormElement>(null!);
  const inputRef = useRef<HTMLInputElement>(null!);

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleChange = () => {
    formRef.current.requestSubmit();
    inputRef.current.value = "";
  };

  return (
    <Form _action={_action} ref={formRef} {...formProps}>
      <input
        ref={inputRef}
        name="file"
        type="file"
        className="hidden"
        onChange={handleChange}
      />
      <Button plus={plus} className={className} onClick={handleClick}>
        {children}
      </Button>
    </Form>
  );
}

interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  blobId: number;
  _action: (formData: FormData) => Promise<FormActionResponse>;
}

export function DeleteButton(props: ButtonProps) {
  const { blobId, _action, ...buttonProps } = props;

  const handleClick = async () => {
    if (!window.confirm("削除しますか？")) return;
    const res = await _action(blobId);
    if (res.statusCode === 200) alert("削除しました");
  };

  return <Button {...buttonProps} type="button" onClick={handleClick} />;
}
