"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useAction, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import crypto from "crypto";
import * as Yup from "yup";
import { toast } from "sonner";

// Validation Schema
const validationSchema = Yup.object({
  file: Yup.mixed()
    .required("A file is required")
    .test("fileType", "Only PDF files are allowed", (value) =>
      value ? value.type === "application/pdf" : false
    ),
  fileName: Yup.string()
    .required("File name is required")
    .min(3, "File name must be at least 3 characters"),
});

function UploadPdfDialog({ children, isMaxFile }) {
  const [fileValue, setFilevalue] = useState({
    file: null,
    fileName: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);

  const { user } = useUser();

  const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
  const createFile = useMutation(api.fileStorage.createFile);
  const getFileUrl = useMutation(api.fileStorage.getFileUrl);
  const embededDocument = useAction(api.myActions.ingest);

  const onFileChange = (e) => {
    // setFile(e.target.files[0]);
    setFilevalue((prev) => ({ ...prev, file: e.target.files[0] }));
    setErrors((prev) => ({ ...prev, file: null })); // Clear file errors on new input
  };

  const onFileNameChange = (e) => {
    // setFileName(e.target.value);
    setFilevalue((prev) => ({ ...prev, fileName: e.target.value }));
    setErrors((prev) => ({ ...prev, fileName: null })); // Clear fileName errors on new input
  };

  const onUpload = async () => {
    // Validate inputs using Yup
    try {
      // Validate inputs using Yup
      const { file, fileName } = fileValue;
      validationSchema.validateSync({ file, fileName }, { abortEarly: false });
      setErrors({}); // Clear previous errors
    } catch (err) {
      const newErrors = {};
      err.inner.forEach((e) => {
        newErrors[e.path] = e.message;
      });
      setErrors(newErrors);
      return; // Stop upload process if validation fails
    }

    // uploading file
    try {
      toast("Uploading the file");
      setLoading(true);
      // Step 1: Get a short-lived upload URL
      const postUrl = await generateUploadUrl();
      // Step 2: POST the file to the URL
      // const result = await fetch(postUrl, {
      //   method: "POST",
      //   headers: { "Content-Type": file?.type },
      //   body: file,
      // });

      const response = await axios.post(postUrl, fileValue.file, {
        headers: {
          "Content-Type": fileValue.file.type,
        },
      });
      const { storageId } = response.data;
      // console.log(storageId);

      // Step 3: Save the newly allocated storage id to the database
      const fileUrl = await getFileUrl({ storageId });
      const fileId = crypto.randomBytes(16).toString("hex");
      const respo = await createFile({
        fileId,
        fileName: fileValue.fileName,
        fileUrl,
        storageId,
        createdBy: user?.primaryEmailAddress?.emailAddress,
      });
      // console.log("Inserted new file data:", respo);
      toast("File uploaded successfully and processing started ....");

      // step4: embed the file
      const { data } = await axios.get(
        `/api/pdf-loader?pdf-url=${fileUrl}&fileName=${fileValue.fileName}&fileId=${fileId}`,
        fileValue,
        fileId
      );
      // console.log(data);

      const embededResult = await embededDocument({
        splitedText: data.result,
        fileId: { fileId: data.fileId },
      });
      // console.log("embededResult", embededResult);
      toast("All done ....");

      setFilevalue({
        file: null,
        fileName: "",
      });
      setLoading(false);
      setOpen(false);
    } catch (error) {
      setFilevalue({
        file: null,
        fileName: "",
      });
      setLoading(false);
      // console.log(error);
    }
  };

  return (
    <form>
      <Dialog open={open}>
        <DialogTrigger asChild>
          <Button
            disabled={!isMaxFile}
            onClick={() => setOpen(true)}
            className="w-full"
          >
            + Upload PDF
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Pdf File</DialogTitle>
            <DialogDescription>
              Notes: Only Pdf files are allowed
            </DialogDescription>
          </DialogHeader>
          <div className="mt-5">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="pdf">Select Pdf</Label>
              <Input
                id="pdf"
                type="file"
                accept="application/pdf"
                onChange={onFileChange}
              />
              {errors.file && (
                <p className="text-red-500 text-sm">{errors.file}</p>
              )}
            </div>

            <div className="mt-2 grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="fileName">File Name</Label>
              <Input
                type="text"
                id="fileName"
                placeholder="File Name"
                value={fileValue.fileName}
                onChange={onFileNameChange}
              />
              {errors.fileName && (
                <p className="text-red-500 text-sm">{errors.fileName}</p>
              )}
            </div>
          </div>

          <DialogFooter className="sm:justify-end mt-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                className="hover:bg-gray-200"
                onClick={() => {
                  setOpen(false);
                  setFilevalue({
                    file: null,
                    fileName: "",
                  });
                  setErrors({});
                }}
              >
                Close
              </Button>
            </DialogClose>
            <Button
              onClick={onUpload}
              disabled={loading || !fileValue.file || !fileValue.fileName}
            >
              {loading ? <Loader className="animate-spin" /> : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
}

export default UploadPdfDialog;
