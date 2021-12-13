// Uncomment these imports to begin using these cool features!

import {service} from '@loopback/core';
import {Filter} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {WaterConsumption} from '../models';
import {WaterBillDataService} from '../services/water-bill-data.service';


export class WaterBillDataController {
  constructor(
    @service(WaterBillDataService) public service: WaterBillDataService,
  ) { }

  @get('/water-bill-data', {
    responses: {
      '200': {
        description: 'Array of WaterConsumption model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(WaterConsumption, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(WaterConsumption) filter?: Filter<WaterConsumption>,
  ): Promise<WaterConsumption[]> {

    return await this.service.getAll(filter);
  }
}
