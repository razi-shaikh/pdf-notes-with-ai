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

function DeleteDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const deleteFile = useMutation(api.fileStorage.deleteFile);

  const deleteData = async ({ storageId, fileId }) => {
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
        {/* Delete */}
        <Button className="bg-red-500 hover:bg-red-600" onClick={deleteData}>
          {loading ? <Loader className="animate-spin" /> : "Delete"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update your data</DialogTitle>
        </DialogHeader>
        <div className="mt-5">
          <div className="mt-2 grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="fileName">File Name</Label>
            <Input type="text" id="fileName" placeholder="File Name" />
          </div>
        </div>
        <Button>
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
              }}
            >
              Close
            </Button>
          </DialogClose>
          <Button className="bg-red-500 hover:bg-red-600">
            {loading ? <Loader className="animate-spin" /> : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteDialog;
