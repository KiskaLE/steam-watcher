import { z } from "zod";
import bcrypt from 'bcrypt';

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";
import { lucia } from "~/server/auth";
import { cookies } from "next/headers";

export const userRouter = createTRPCRouter({
    noUsers: publicProcedure.query(async ({ ctx }) => {
        const count = await ctx.db.user.count();
        return count === 0;
    }),
    login: publicProcedure.input(z.object({ email: z.string().regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, "Invalid email"), password: z.string() })).mutation(async ({ ctx, input }) => {
        const user = await ctx.db.user.findUnique({
            where: {
                email: input.email,
            },
        });

        if (!user) {
            return null
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const isValid = await bcrypt.compare(input.password, user.password);
        if (!isValid) {
            return null
        }
        const session = await lucia.createSession(user.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes,
        );
        return sessionCookie;
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
