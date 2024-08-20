import { type NextRequest } from "next/server";
import { env } from "~/env";
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
            // TODO
            await api.steam.getAppDetails({ appIds: ["2358720", "456"] });
            return new Response('OK', { status: 200 })
        default:
            return new Response('Not found', { status: 404 })
    }


}