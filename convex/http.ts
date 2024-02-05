import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/clerk",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const payloadString = await req.text();
    const payloadHeader = req.headers;

    try {
      const result = await ctx.runAction(internal.clerk.fulfill, {
        payload: payloadString,
        headers: {
          "svix-id": payloadHeader.get("svix-id"),
          "svix-timestamp": payloadHeader.get("svix-timestamp"),
          "svix-signature": payloadHeader.get("svix-signature"),
        },
      });

      switch (result.type) {
        case "user.created":
          await ctx.runMutation(internal.profiles.createProfile, {
            email: result.data.email_addresses[0]?.email_address,
            userId: result.data.id,
          });
          break;

        default:
          break;
      }

      return new Response(null, {
        status: 200,
      });
    } catch (e) {
      return new Response(null, {
        status: 400,
      });
    }
  }),
});

export default http;
