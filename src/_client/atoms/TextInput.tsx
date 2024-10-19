"use client";

import React from "react";

interface Props extends React.HTMLProps<HTMLInputElement> {
  title: string;
}

export default function TextInput(props: Props) {
  const { title, children, className, ...inputProps } = props;
  const baseClasses = "mt-2 mb-10 px-4 h-10 rounded border border-[#CDCDDF]";

  return (
    <>
      <label className="font-bold">{title}</label>
      <input className={`${baseClasses} ${className}`} {...inputProps} />
    </>
  );
}
