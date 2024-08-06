import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "~/server/db";
import { lucia } from "~/server/auth";
import bcrypt from "bcrypt";


export default async function login(formData: FormData) {
    "use server";

    const email = formData.get("email")?.toString();
    if (
        !email ||
        !z
            .string()
            .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)
            .parse(email)
    ) {
        return {
            error: "Invalid email format",
        };
    }

    const password = formData.get("password")?.toString();
    if (!password || !z.string().min(1).parse(password)) {
        return {
            error: "Invalid password format",
        };
    }

    const user = await db.user.findUnique({
        where: {
            email: email,
        },
    });

    if (!user) {
        return {
            error: "Incorrect username or password",
        };
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        return {
            error: "Incorrect username or password",
        };
    }
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
    );
    return redirect("/");
}
