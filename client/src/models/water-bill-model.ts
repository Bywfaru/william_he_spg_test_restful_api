import axios from "axios";
import { WaterBillData } from "../types/bill-data.types";

const BASE_ENDPOINT_URL = "http://localhost:3000";

export class WaterBillModel {
    /**
     * Retrieves the water bill data.
     * 
     * @returns JSON object
     */
    static async getWaterBillData() {
        try {
            const data = (await axios.get(`${BASE_ENDPOINT_URL}/water-bill-data`)).data;

            return data as WaterBillData[];
        } catch (error: unknown) {
            if (error instanceof Error) return error;
        }
    }
}
