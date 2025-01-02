import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userName: v.string(),
    email: v.string(),
    imageUrl: v.string(),
    // upgraded: v.boolean(),
  }),

  suscribedUsers: defineTable({
    email: v.string(),
    currentPlan: v.string(),
    noOfPurchase: v.number(),
    purchaseDate: v.string(),
    planExpireDate: v.string(),
  }),

  pdfFiles: defineTable({
    fileName: v.string(),
    fileId: v.string(),
    fileUrl: v.string(),
    storageId: v.string(),
    createdBy: v.string(),
  }),

  documents: defineTable({
    embedding: v.array(v.number()),
    text: v.string(),
    metadata: v.any(),
  }).vectorIndex("byEmbedding", {
    vectorField: "embedding",
    dimensions: 768,
  }),

  notes: defineTable({
    fileId: v.string(),
    content: v.any(),
    createdBy: v.string(),
  }),
});
