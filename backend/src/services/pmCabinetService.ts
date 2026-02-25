import { success } from "zod";

export const pmCabinetService = {
    async AddCabinet(data: any, db: any) {
        const client = await db.connect();
        return {
            success: true
        }
    },
}