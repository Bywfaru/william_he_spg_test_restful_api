import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {Filter} from '@loopback/repository';
import {ElectricityConsumption} from '../models';
import csvtojson from 'csvtojson';

@injectable({scope: BindingScope.TRANSIENT})
export class ElectricityBillDataService {
  constructor(/* Add @inject to inject parameters */) {}

  private ELECTRICITY_BILL_DATA_PATH = './data/electricity_bill_data.csv';

  async getAll(
    filter?: Filter<ElectricityConsumption>,
  ): Promise<Array<ElectricityConsumption>> {
    const response = await csvtojson().fromFile(this.ELECTRICITY_BILL_DATA_PATH);

    return response;
  }
}
