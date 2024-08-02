
import { db } from "~/server/db";
import bcrypt from 'bcrypt';

const salt = bcrypt.genSaltSync(10);


export async function validate(email: string, password: string) {
    const user = await db.user.findUnique({
        where: {
            email: email
        }
    })
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    if (user && await bcrypt.compare(password, user.password as string)) {
        return user;
    }
    return null;
}

export async function register(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, salt);
    //create user
    const user = await db.user.create({
        data: {
            email: email,
            password: hashedPassword
        }
    })
    return user
}