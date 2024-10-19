import "./style.css";
import "../styles.css";
import React from "react";
import models from "@/_server/models";
import { MenuLink, WrapLinks } from "@/_client/layout";

interface RootLayoutProps {
  children: React.ReactNode;
  path: string;
}

export default async function RootLayout(props: RootLayoutProps) {
  const { children, path } = props;
  const templates = await models.templates.list();
  return (
    <div>
      <main>
        <img
          src="https://placehold.co/40x40"
          className="fixed top-5 left-[10px] rounded-full max-lg:hidden"
        />
        <button
          children="+"
          className="fixed top-[68px] w-[60px] text-white text-[28px] max-lg:hidden"
        />
        <img
          src="/admin/ungra.svg"
          alt={"😺"}
          width={32}
          height={32}
          className="fixed left-3 bottom-3 w-8 h-8 rounded-full bg-[#A8A8C5] max-lg:hidden"
        />
        <div className="fixed ml-[60px] w-[200px] px-4 py-2 text-[#686889] max-lg:left-[-260px]">
          <div className="font-bold pb-6 text-[#21213B]">Untitled</div>
          <WrapLinks title="コンテンツ">
            {templates
              .sort((a, b) => (a.pathname < b.pathname ? -1 : 1))
              .map((template) => (
                <MenuLink
                  key={template.pathname}
                  href={"/apis/" + template.pathname}
                  active={"/apis/" + template.pathname === path}
                >
                  {template.pathname}
                </MenuLink>
              ))}
            <a href="/apis/create" className="absolute right-4 text-[24px]">
              +
            </a>
          </WrapLinks>
          <WrapLinks title="メディア">
            <MenuLink href="/media">全てのアイテム</MenuLink>
          </WrapLinks>
        </div>
        <div className="lg:pl-[260px] max-lg:pt-12 min-h-screen background text-[#21213B]">
          {children}
        </div>
      </main>
    </div>
  );
}


export const getConfig = async () => {
  return {
    render: "static",
  } as const;
};
