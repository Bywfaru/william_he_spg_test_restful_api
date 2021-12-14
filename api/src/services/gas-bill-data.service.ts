import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {Filter} from '@loopback/repository';
import {GasConsumption} from '../models';
import csvtojson from 'csvtojson';

@injectable({scope: BindingScope.TRANSIENT})
export class GasBillDataService {
  constructor(/* Add @inject to inject parameters */) { }

  private GAS_BILL_DATA_PATH = './data/gas_bill_data.csv';

  async getAll(
    filter?: Filter<GasConsumption>,
  ): Promise<Array<GasConsumption>> {
    const response = await csvtojson().fromFile(this.GAS_BILL_DATA_PATH);

    return response;
  }
}
