import { unknown, z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";

type AboutStats = {
    users_online: number
    users_ingame: number
}

type AppData = {
    price_overview: {
        currency: string;
        initial: number;
        final: number;
        discount_percent: number;
        initial_formatted: string;
        final_formatted: string;
    }

}

const valveEndpoint = "https://www.valvesoftware.com"
const steamEndpoint = "https://api.steampowered.com"
const storeEndpoint = "https://store.steampowered.com"

export const steamRouter = createTRPCRouter({
    getAboutStats: protectedProcedure.query(async () => {
        const response = await fetch(`${valveEndpoint}/about/stats`);
        if (!response.ok) {
            throw new Error("Failed to fetch stats");
        }
        return await response.json() as AboutStats;
    }),
    getAppDetails: protectedProcedure.input(z.object({ appIds: z.string().array().nonempty("App IDs are required") })).query(async ({ input }) => {
        const response = await fetch(`${valveEndpoint}/api/appdetails?appids=${input.appIds.join(",")}&filters=price_overview`);
        if (!response.ok) {
            throw new Error("Failed to fetch app details");
        }
        const data = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
        const priceOverviews = data?.map((app: any) => app?.data?.price_overview) as AppData[];
        return priceOverviews;
    })
});
