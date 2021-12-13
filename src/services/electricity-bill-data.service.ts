import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {Filter} from '@loopback/repository';
import {ElectricityConsumption} from '../models';

@injectable({scope: BindingScope.TRANSIENT})
export class ElectricityBillDataService {
  constructor(/* Add @inject to inject parameters */) { }

  async getAll(
    filter?: Filter<ElectricityConsumption>,
  ): Promise<Array<ElectricityConsumption>> {

    return [];
  }
}
