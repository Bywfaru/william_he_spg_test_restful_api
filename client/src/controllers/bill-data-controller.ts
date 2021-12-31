import {
    ElectricityBillData,
    GasBillData,
    WaterBillData,
    UtilityType,
    BillData
} from "../types/bill-data.types";
import {
    ElectricityBillModel,
    GasBillModel,
    WaterBillModel
} from '../models';

export class BillDataController {
    /**
     * Returns bill data in the form of an array containing JSON objects.
     * 
     * @param utilityType UtilityType enum
     * @returns An array containing JSON objects
     */
    static async billDataRequest(utilityType: UtilityType) {
        try {
            let data: ElectricityBillData[] | WaterBillData[] | GasBillData[];

            switch (utilityType) {
                case UtilityType.ELECTRICITY:
                    data = await ElectricityBillModel.getElectricityBillData() as ElectricityBillData[];
                    break;
                case UtilityType.WATER:
                    data = await WaterBillModel.getWaterBillData() as WaterBillData[];
                    break;
                case UtilityType.GAS:
                    data = await GasBillModel.getGasBillData() as GasBillData[];
                    break;
            }

            return data;
        } catch (error: unknown) {
            if (error instanceof Error) return error;
        }
    }

    /**
     * Retrieves all the different bill data
     * 
     * @returns object of arrays of objects
     */
    static async getBillData() {
        try {
            const electricityBillData: ElectricityBillData[] = await this.billDataRequest(UtilityType.ELECTRICITY) as ElectricityBillData[];
            const waterBillData: WaterBillData[] = await this.billDataRequest(UtilityType.WATER) as WaterBillData[];
            const gasBillData: GasBillData[] = await this.billDataRequest(UtilityType.GAS) as GasBillData[];
            const billData: BillData = {
                electricityBillData: electricityBillData,
                waterBillData: waterBillData,
                gasBillData: gasBillData,
            };

            return billData;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return error;
            }
        }
    }
}
