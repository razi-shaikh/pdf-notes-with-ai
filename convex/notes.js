import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addNotes = mutation({
  args: {
    fileId: v.string(),
    content: v.any(),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const notesRecord = await ctx.db
        .query("notes")
        .filter((q) => q.eq(q.field("fileId"), args.fileId))
        .collect();

      if (notesRecord?.length == 0) {
        await ctx.db.insert("notes", {
          fileId: args.fileId,
          content: args.content,
          createdBy: args.createdBy,
        });
      } else {
        await ctx.db.patch(notesRecord[0]._id, {
          content: args.content,
        });
      }
    } catch (error) {
      // console.log(error);
      throw new Error("Failed to add notes");
    }
  },
});

export const fetchNotes = query({
  args: {
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const response = await ctx.db
        .query("notes")
        .filter((q) => q.eq(q.field("fileId"), args.fileId))
        .collect();

      return response[0]?.content;
    } catch (error) {
      // console.log(error);
      throw new Error("Failed to fetch notes");
    }
  },
});
