import {service} from '@loopback/core';
import {Filter} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {ElectricityConsumption} from '../models';
import {ElectricityBillDataService} from '../services';

export class ElectricityBillDataController {
  constructor(
    @service(ElectricityBillDataService) public service: ElectricityBillDataService,
  ) { }

  @get('/electricity-bill-data', {
    responses: {
      '200': {
        description: 'Array of ElectricityConsumption model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(ElectricityConsumption, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(ElectricityConsumption) filter?: Filter<ElectricityConsumption>,
  ): Promise<ElectricityConsumption[]> {

    return await this.service.getAll(filter);
  }
}
