"use client";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import React from "react";
import { api } from "../../../convex/_generated/api";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import EditPdfDialog from "./_components/EditPdfDialog";

function Dashoard() {
  const { user } = useUser();
  // console.log(user && user);

  const userFilesList = useQuery(api.fileStorage.getUserFiles, {
    userEmail: user?.primaryEmailAddress?.emailAddress,
  });
  // console.log(userFilesList);
  return (
    <div>
      <h2 className="font-medium text-3xl">Workspace</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-10">
        {userFilesList?.length > 0 ? (
          userFilesList.map((file, index) => (
            <div key={index} className="relative group">
              {/* Card contents wrapped in Link */}
              <Link href={`/workspace/${file.fileId}`} className="block">
                <div className="flex p-5 shadow-md rounded-md flex-col items-center justify-center border cursor-pointer hover:scale-105 transition-all">
                  <Image src={"/pdf.png"} alt="pdf" width={50} height={50} />
                  <h2 className="mt-3 font-medium text-lg">{file?.fileName}</h2>
                </div>
              </Link>

              {/* Edit button outside of Link */}
              <div>
                <EditPdfDialog
                  fileName={file?.fileName}
                  fileId={file?.fileId}
                  storageId={file?.storageId}
                />
              </div>
            </div>
          ))
        ) : userFilesList?.length == 0 ? (
          <div>
            You have no documents.
            <br />
            Let upload the Pdfs
          </div>
        ) : (
          [1, 2, 3, 4, 5, 6, 7].map((item, index) => (
            <div
              key={index}
              className="flex p-5 shadow-md rounded-md flex-col items-center justify-center border cursor-pointer hover:scale-105 transition-all"
            >
              <Skeleton className="w-[50px] h-[50px] rounded" />
              <Skeleton className="w-[100px] h-[20px] rounded-sm mt-3" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashoard;
