import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {Filter} from '@loopback/repository';
import {GasConsumption} from '../models';

@injectable({scope: BindingScope.TRANSIENT})
export class GasBillDataService {
  constructor(/* Add @inject to inject parameters */) { }

  async getAll(
    filter?: Filter<GasConsumption>,
  ): Promise<Array<GasConsumption>> {

    return [];
  }
}
