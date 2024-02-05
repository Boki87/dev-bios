import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const createProfile = internalMutation({
  args: { email: v.string(), userId: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("profiles", {
      email: args.email,
      userId: args.userId,
    });
  },
});
