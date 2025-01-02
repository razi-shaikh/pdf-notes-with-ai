import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const userUpgradePlan = mutation({
  args: {
    email: v.optional(v.string()),
    changePlan: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      if (!args.email) {
        return;
      }
      const user = await ctx.db
        .query("suscribedUsers")
        .filter((que) => que.eq(que.field("email"), args.email))
        .collect();
      // console.log(user);
      // console.log("changePlan", args.changePlan);

      if (user.length > 0) {
        await ctx.db.patch(user[0]._id, {
          currentPlan: "premium",
          noOfPurchase: user[0].noOfPurchase + 1,
          purchaseDate: new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
          planExpireDate: new Date(
            new Date().setDate(new Date().getDate() + 30)
          ).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
          // purchaseDate: "",
          // planExpireDate: "",
        });
        return "user upgraded to premium";
      }
    } catch (error) {
      // console.log(error);
    }
  },
});

export const userDowngradePlan = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      if (!args.email) {
        return;
      }
      const user = await ctx.db
        .query("suscribedUsers")
        .filter((que) => que.eq(que.field("email"), args.email))
        .collect();

      if (user.length > 0) {
        await ctx.db.patch(user[0]._id, {
          currentPlan: "free", // Downgrade to "free" plan
          planExpireDate: "",
          purchaseDate: "",
        });
        return "User downgraded to free plan.";
      } else {
        throw new Error("User not found.");
      }
    } catch (error) {
      // console.error("Error in userDowngradePlan:", error);
      throw new Error("Failed to downgrade the user.");
    }
  },
});

export const userPlanDetail = query({
  args: {
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      if (!args.email) {
        return;
      }
      const [user] = await ctx.db
        .query("suscribedUsers")
        .filter((que) => que.eq(que.field("email"), args.email))
        .collect();
      // console.log(user);
      return user;
    } catch (error) {
      // console.log(error);
    }
  },
});
