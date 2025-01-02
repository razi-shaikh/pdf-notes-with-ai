import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const createFile = mutation({
  args: {
    fileName: v.string(),
    fileId: v.string(),
    fileUrl: v.string(),
    storageId: v.string(),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    const newPdfFile = await ctx.db.insert("pdfFiles", {
      fileName: args.fileName,
      fileId: args.fileId,
      fileUrl: args.fileUrl,
      storageId: args.storageId,
      createdBy: args.createdBy,
    });
    // console.log("Inserted PDF File:", newPdfFile);
    return newPdfFile; // Return the created file
  },
});

export const getFileUrl = mutation({
  args: {
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId);
    return url;
  },
});

export const getFileInfo = query({
  args: {
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    const files = await ctx.db
      .query("pdfFiles")
      .filter((q) => q.eq(q.field("fileId"), args.fileId))
      .collect();
    // console.log(files);//output : 0 th element of array [{...}]
    return files[0];
  },
});

export const getUserFiles = query({
  args: {
    userEmail: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.userEmail) {
      return;
    }
    const userFiles = await ctx.db
      .query("pdfFiles")
      .filter((q) => q.eq(q.field("createdBy"), args?.userEmail))
      .collect();

    return userFiles;
  },
});

export const updateUserFile = mutation({
  args: {
    fileId: v.string(),
    fileName: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if the file exists in the database
    const fileExists = await ctx.db
      .query("pdfFiles")
      .filter((q) => q.eq(q.field("fileId"), args.fileId))
      .collect();
    if (fileExists.length > 0) {
      // Update the fileName for the given fileId
      await ctx.db.patch(fileExists[0]._id, {
        fileName: args.fileName,
      });
    }

    return "file updated successfully";
  },
});

export const deleteFile = mutation({
  args: {
    fileId: v.string(),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    // Fetch file associated with the fileId
    const file = await ctx.db
      .query("pdfFiles")
      .filter((q) => q.eq(q.field("fileId"), args.fileId))
      .collect();

    // Fetch notes associated with the fileId
    const notes = await ctx.db
      .query("notes")
      .filter((q) => q.eq(q.field("fileId"), args.fileId))
      .collect();

    // Fetch all documents associated with the fileId in metadata
    const documents = await ctx.db
      .query("documents")
      .filter((q) => q.eq(q.field("metadata"), args.fileId))
      .collect();

    // console.log("Documents to delete:", documents);

    // Delete all documents with the matching fileId
    for (const document of documents) {
      await ctx.db.delete(document._id);
    }

    // Delete the file and associated notes if found
    if (file.length > 0) {
      await ctx.db.delete(file[0]._id); // Delete file from pdfFiles
      await ctx.storage.delete(args.storageId); // Delete file from storage

      // Delete associated notes
      for (const note of notes) {
        await ctx.db.delete(note._id);
      }

      return "File and all associated records deleted successfully";
    }

    return "File not found";
  },
});
