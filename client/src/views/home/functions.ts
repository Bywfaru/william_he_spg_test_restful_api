import axios from 'axios';
import { ElectricityBillData, GasBillData, WaterBillData } from '../../types/bill-data.types';

const BASE_ENDPOINT_URL = 'http://localhost:3000';

export type BillData = {
    electricityBillData: ElectricityBillData[],
    waterBillData: WaterBillData[],
    gasBillData: GasBillData[]
}

export async function getElectricityBillData() {
    try {
        const data = (await axios.get(`${BASE_ENDPOINT_URL}/electricity-bill-data`)).data;

        return data;
    } catch (error: unknown) {
        if (error instanceof Error) return error;
    }
}

export async function getWaterBillData() {
    try {
        const data = (await axios.get(`${BASE_ENDPOINT_URL}/water-bill-data`)).data;

        return data;
    } catch (error: unknown) {
        if (error instanceof Error) return error;
    }
}

export async function getGasBillData() {
    try {
        const data = (await axios.get(`${BASE_ENDPOINT_URL}/gas-bill-data`)).data;

        return data;
    } catch (error: unknown) {
        if (error instanceof Error) return error;
    }
}

export async function getBillData() {
    try {
        const electricityBillData: ElectricityBillData[] = await getElectricityBillData();
        const waterBillData: WaterBillData[] = await getWaterBillData();
        const gasBillData: GasBillData[] = await getGasBillData();
        const billData: BillData = {
            electricityBillData: electricityBillData,
            waterBillData: waterBillData,
            gasBillData: gasBillData
        }

        return billData;
    } catch (error: unknown) {
        if (error instanceof Error) {
            return error;
        }
    }
}
