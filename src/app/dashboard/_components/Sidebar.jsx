"use client";
import { Progress } from "@/components/ui/progress";
import { Layout, Shield } from "lucide-react";
import Image from "next/image";
import React from "react";
import UploadPdfDialog from "./UploadPdfDialog";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { usePathname } from "next/navigation";
import Link from "next/link";

function Sidebar() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  // console.log(user && user);

  const userFilesList = useQuery(api.fileStorage.getUserFiles, {
    userEmail: email,
  });
  const userPlanDetail = useQuery(api.payments.userPlanDetail, {
    email: email,
  });

  const path = usePathname();
  // console.log(path);
  return (
    <div className="shadow-md h-screen p-7 relative">
      {/* logo */}
      <div className="flex cursor-pointer items-center gap-2 ">
        <Image src={"/blackLogo.svg"} alt="logo" width={40} height={40} />
        <p class="font-sfProDisplay font-semibold text-xl">PDFNotes</p>
      </div>
      <div className="mt-10">
        <UploadPdfDialog
          isMaxFile={
            userFilesList?.length <
            (userPlanDetail?.currentPlan === "free" ? 5 : 10)
              ? true
              : false
          }
        />
        <Link href={"/dashboard"}>
          <div
            className={`flex gap-2 items-center p-3 mt-5 hover:bg-slate-100 rounded-lg cursor-pointer ${path == "/dashboard" ? "bg-[#E3E5E6]" : ""}`}
          >
            <Layout />
            <h2>Workspace</h2>
          </div>
        </Link>
        <Link href={"/dashboard/upgrade"}>
          <div
            className={`flex gap-2 items-center p-3 mt-2 hover:bg-slate-100 rounded-lg cursor-pointer ${path == "/dashboard/upgrade" ? "bg-[#E3E5E6]" : ""}`}
          >
            <Shield />
            <h2>Upgrade</h2>
          </div>
        </Link>
      </div>
      {/* progress bar */}
      <div className="w-[78%] absolute bottom-20">
        <Progress
          value={
            (userFilesList?.length /
              (userPlanDetail?.currentPlan === "free" ? 5 : 10)) *
            100
          }
        />
        <p className="text-sm mt-1">
          {userFilesList?.length} Out of{" "}
          {userPlanDetail?.currentPlan === "free" ? 5 : 10} Pdf Uploaded
        </p>
        {userPlanDetail?.currentPlan === "free" ? (
          <p className="text-sm text-gray-400 mt-2">Upgrade to Upload</p>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default Sidebar;
