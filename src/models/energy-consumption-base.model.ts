import {Model, model, property} from '@loopback/repository';

@model()
export class EnergyConsumptionBase extends Model {
  @property({
    type: 'string',
    required: true,
  })
  createdBy: string;

  @property({
    type: 'date',
    required: true,
  })
  createdDate: string;

  @property({
    type: 'string',
    required: true,
  })
  lastModifiedBy: string;

  @property({
    type: 'date',
    required: true,
  })
  lastModifiedDate: string;

  @property({
    type: 'number',
    required: true,
  })
  year: number;

  @property({
    type: 'number',
    required: true,
  })
  month: number;

  @property({
    type: 'number',
    required: true,
  })
  totalCharge: number;

  @property({
    type: 'number',
    required: true,
  })
  consumption: number;

  @property({
    type: 'number',
    required: true,
  })
  blendedRate: number;

  @property({
    type: 'string',
  })
  buildingId?: string;


  constructor(data?: Partial<EnergyConsumptionBase>) {
    super(data);
  }
}

export interface EnergyConsumptionBaseRelations {
  // describe navigational properties here
}

export type EnergyConsumptionBaseWithRelations = EnergyConsumptionBase & EnergyConsumptionBaseRelations;
