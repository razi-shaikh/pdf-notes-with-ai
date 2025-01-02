import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createUser = mutation({
  args: {
    userName: v.string(),
    email: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    // if user already exists
    const user = await ctx.db
      .query("users")
      .filter((que) => que.eq(que.field("email"), args.email))
      .collect();

    // console.log("user", user);

    // if user does not exist
    if (user.length == 0) {
      await ctx.db.insert("users", {
        userName: args.userName,
        email: args.email,
        imageUrl: args.imageUrl,
      });

      await ctx.db.insert("suscribedUsers", {
        email: args.email,
        currentPlan: "free",
        noOfPurchase: 0,
        purchaseDate: "",
        planExpireDate: "",
      });

      return "Inserted New User..";
    }
    return "user already exist";
  },
});
