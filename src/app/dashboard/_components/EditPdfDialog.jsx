"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit2, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";

function EditPdfDialog({ fileName, fileId, storageId }) {
  const [open, setOpen] = useState(false);
  const [fileNameState, setFileNameState] = useState(fileName);
  const [loading, setLoading] = useState(false);
  const updateUserFile = useMutation(api.fileStorage.updateUserFile);
  const deleteFile = useMutation(api.fileStorage.deleteFile);

  const updateData = async () => {
    try {
      setLoading(true);
      await updateUserFile({
        fileId,
        fileName: fileNameState,
      });
      toast("File name updated !!");
      setLoading(false);
      setOpen(false);
    } catch (error) {
      setLoading(false);
      toast("Unable to update !!");
    }
  };

  const deleteData = async () => {
    try {
      setLoading(true);
      await deleteFile({
        fileId,
        storageId,
      });
      toast("File deleted !!");
      setLoading(false);
      setOpen(false);
    } catch (error) {
      setLoading(false);
      toast("Unable to delete !!");
    }
  };

  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        {/* Hover Edit Icon */}
        <div
          onClick={() => setOpen(!open)}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer hover:scale-110"
        >
          <div className="hover:bg-gray-400 p-2 rounded-full">
            <Edit2 className="text-gray-500 hover:text-white text-xl" />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update your data</DialogTitle>
        </DialogHeader>
        <div className="mt-5">
          <div className="mt-2 grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="fileName">File Name</Label>
            <Input
              type="text"
              id="fileName"
              placeholder={fileName}
              value={fileNameState}
              onChange={(e) => setFileNameState(e.target.value)}
            />
          </div>
        </div>
        <Button onClick={updateData}>
          {loading ? <Loader className="animate-spin" /> : "Update"}
        </Button>
        <DialogFooter className="sm:justify-end mt-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className="hover:bg-gray-200"
              onClick={() => {
                setOpen(false);
                setFileNameState(fileName);
              }}
            >
              Close
            </Button>
          </DialogClose>
          <Button className="bg-red-500 hover:bg-red-600" onClick={deleteData}>
            {loading ? <Loader className="animate-spin" /> : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditPdfDialog;
