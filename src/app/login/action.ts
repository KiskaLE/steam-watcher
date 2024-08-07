"use server";
import { cookies } from "next/headers";
import { db } from "~/server/db";
import { lucia } from "~/server/auth";
import bcrypt from "bcrypt";


export default async function login(email: string, password: string) {
    const user = await db.user.findUnique({
        where: {
            email: email,
        },
    });

    if (!user) {
        return false
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        return false
    }
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
    );
    return true;
}
