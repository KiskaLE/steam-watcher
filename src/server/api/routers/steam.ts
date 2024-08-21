import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

type AboutStats = {
    users_online: number
    users_ingame: number
}

export type AppData = {
    success: boolean;
    data: {
        price_overview: {
            currency: string;
            initial: number;
            final: number;
            discount_percent: number;
            initial_formatted: string;
            final_formatted: string;
        }
    }

}

const valveEndpoint = "https://www.valvesoftware.com"
const storeEndpoint = "https://store.steampowered.com"

export const steamRouter = createTRPCRouter({
    getAboutStats: protectedProcedure.query(async () => {
        const response = await fetch(`${valveEndpoint}/about/stats`);
        if (!response.ok) {
            throw new Error("Failed to fetch stats");
        }
        return await response.json() as AboutStats;
    }),
    getAppDetails: publicProcedure.input(z.object({ appIds: z.number() })).query(async ({ input }) => {
        const myHeaders = new Headers();
        myHeaders.append("Cookie", "steamCountry=CZ%7C707c3774fc362c731377662082b5d333");
        myHeaders.append("filters", "price_overview");
        const requestOptions = {
            method: 'GET',
            headers: myHeaders
        }
        const response = await fetch(`${storeEndpoint}/api/appdetails?appids=${input.appIds}&filters=price_overview`, requestOptions);
        if (!response.ok) {
            throw new Error("Failed to fetch app details");
        }
        const res = await response.json();

        return res as Promise<AppData[]>;
    })
});
