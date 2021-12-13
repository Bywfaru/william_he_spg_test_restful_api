// Uncomment these imports to begin using these cool features!

import {service} from '@loopback/core';
import {Filter} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {GasConsumption} from '../models';
import {GasBillDataService} from '../services/gas-bill-data.service';

export class GasBillDataController {
  constructor(
    @service(GasBillDataService) public service: GasBillDataService,
  ) { }

  @get('/gas-bill-data', {
    responses: {
      '200': {
        description: 'Array of GasConsumption model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(GasConsumption, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(GasConsumption) filter?: Filter<GasConsumption>,
  ): Promise<GasConsumption[]> {

    return await this.service.getAll(filter);
  }
}
