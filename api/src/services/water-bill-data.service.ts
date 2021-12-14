import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {Filter} from '@loopback/repository';
import {WaterConsumption} from '../models';
import csvtojson from 'csvtojson';

@injectable({scope: BindingScope.TRANSIENT})
export class WaterBillDataService {
  constructor(/* Add @inject to inject parameters */) { }

  private WATER_BILL_DATA_PATH = './data/water_bill_data.csv';

  async getAll(
    filter?: Filter<WaterConsumption>,
  ): Promise<Array<WaterConsumption>> {
    const response = await csvtojson().fromFile(this.WATER_BILL_DATA_PATH);

    return response;
  }
}
