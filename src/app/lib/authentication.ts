
import { db } from "~/server/db";
import bcrypt from 'bcrypt';


export async function validate(email: string, password: string) {
    const user = await db.user.findUnique({
        where: {
            email: email
        }
    })
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    if (user && await bcrypt.compare(password, user.password)) {
        return user;
    }
    return null;
}