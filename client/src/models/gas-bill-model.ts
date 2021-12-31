import axios from "axios";
import { GasBillData } from "../types/bill-data.types";

const BASE_ENDPOINT_URL = "http://localhost:3000";

export class GasBillModel {
    /**
     * Retrieves the gas bill data.
     * 
     * @returns JSON object
     */
    static async getGasBillData() {
        try {
            const data = (await axios.get(`${BASE_ENDPOINT_URL}/gas-bill-data`)).data;

            return data as GasBillData[];
        } catch (error: unknown) {
            if (error instanceof Error) return error;
        }
    }
}
