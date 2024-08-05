import { z } from "zod";
import bcrypt from 'bcrypt';

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
    noUsers: publicProcedure.query(async ({ ctx }) => {
        const count = await ctx.db.user.count();
        return count === 0;
    }),
    validate: publicProcedure.input(z.object({ email: z.string().regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, "Invalid email"), password: z.string() })).query(async ({ ctx, input }) => {
        const user = await ctx.db.user.findUnique({
            where: {
                email: input.email
            }
        })
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        if (user && await bcrypt.compare(input.password, user.password)) {
            return user;
        }
        return null;
    }),
    register: publicProcedure.input(z.object({ email: z.string().regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, "Invalid email"), password: z.string().min(6) })).mutation(async ({ ctx, input }) => {

        const salt = bcrypt.genSaltSync(10);

        if (await ctx.db.user.count()) {
            return 0;
        }
        const hashedPassword = await bcrypt.hash(input.password, salt);
        console.log(hashedPassword);

        //create user
        await ctx.db.user.create({
            data: {
                email: input.email,
                password: hashedPassword
            }
        })

    })
});
