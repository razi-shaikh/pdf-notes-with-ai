import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function WorkspaceHeader({ fileName }) {
  return (
    <div className="p-4 flex justify-between items-center shadow-md">
      {/* logo */}
      <Link href={"/dashboard"}>
        <div className="flex cursor-pointer items-center gap-2 ">
          <Image src={"/blackLogo.svg"} alt="logo" width={40} height={40} />
          <p class="font-sfProDisplay font-semibold text-xl">PDFNotes</p>
        </div>
      </Link>
      <h2 className="font-bold text-xl">{fileName}</h2>
      <UserButton />
    </div>
  );
}

export default WorkspaceHeader;
