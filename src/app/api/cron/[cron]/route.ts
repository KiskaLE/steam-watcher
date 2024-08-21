import { type NextRequest } from "next/server";
import { env } from "~/env";
import { type AppData } from "~/server/api/routers/steam";
import { db } from "~/server/db";
import { api } from "~/trpc/server";

export async function GET(request: NextRequest, { params }: { params: { cron: string } }) {
    const secret = request.nextUrl.searchParams.get("key");
    if (secret !== env.CRON_SECRET) {
        return new Response('Unauthorized', { status: 401 })
    }

    const route = params.cron;
    switch (route) {
        case "test":
            return new Response('Hello, Next.js!')

        case "checkGames":
            return await checkGames();
        default:
            return new Response('Not found', { status: 404 })
    }


}

async function checkGames() {
    try {
        // get all apps ids
        const appsIds = (await db.game.findMany({
            select: {
                appId: true
            }
        })).map((app) => app.appId);
        // if no apps, return OK
        if (!appsIds) {
            return new Response("OK", { status: 200 });
        }
        // get app details
        const res = await api.steam.getAppDetails({ appIds: appsIds });
        // eslint-disable-next-line @typescript-eslint/no-for-in-array
        for (const key in res) {
            if (res.hasOwnProperty(key)) {
                const app = res[key];
                if (!app?.success) {
                    continue;
                }
                // get game from db using key
                const gameDB = await db.game.findFirst({
                    select: {
                        id: true
                    },
                    where: {
                        appId: Number(key)
                    }
                })
                // if there is no game in db skip
                if (!gameDB) {
                    continue;
                }
                // insert new price into database
                await db.gamePrice.create({
                    data: {
                        gameId: gameDB.id,
                        price: app.data.price_overview.final,
                        currency: app.data.price_overview.currency
                    }
                })

            }
        }



        return new Response("OK", { status: 200 });
    } catch (error) {
        return new Response(error as string, { status: 500 });
    }
}