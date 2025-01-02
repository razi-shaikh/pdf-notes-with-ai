"use client";
import { useParams } from "next/navigation";
import WorkspaceHeader from "../_components/WorkspaceHeader";
import PdfViewer from "../_components/PdfViewer";
import TextEditor from "../_components/TextEditor";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

function Workspace() {
  const { fileId } = useParams();
  const getFileInfo = useQuery(api.fileStorage.getFileInfo, { fileId: fileId });

  return (
    <div>
      <WorkspaceHeader fileName={getFileInfo?.fileName} />
      <div className="grid grid-cols-2 gap-5">
        {/* text editor */}
        <div>
          <TextEditor fileId={fileId} />
        </div>
        {/* pdf file */}
        <div>
          <PdfViewer fileUrl={getFileInfo?.fileUrl} />
        </div>
      </div>
    </div>
  );
}

export default Workspace;
