import axios from 'axios';
import { ElectricityBillData } from '../types/bill-data.types';

const BASE_ENDPOINT_URL = "http://localhost:3000";

export class ElectricityBillModel {
    /**
     * Retrieves the electricity bill data.
     * 
     * @returns JSON object
     */
    static async getElectricityBillData() {
        try {
            const data = (await axios.get(`${BASE_ENDPOINT_URL}/electricity-bill-data`)).data;

            return data as ElectricityBillData[];
        } catch (error: unknown) {
            if (error instanceof Error) return error;
        }
    }
}
