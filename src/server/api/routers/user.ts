import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
    noUsers: publicProcedure.query(async ({ ctx }) => {
        const count = await ctx.db.user.count();
        return count === 0;
    })
});
