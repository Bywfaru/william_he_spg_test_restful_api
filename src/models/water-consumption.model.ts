import {model, property} from '@loopback/repository';
import {EnergyConsumptionBase} from './energy-consumption-base.model';

@model()
export class WaterConsumption extends EnergyConsumptionBase {
  @property({
    type: 'number',
    required: true,
  })
  waterRate: number;

  @property({
    type: 'number',
    required: true,
  })
  waterCharge: number;

  @property({
    type: 'number',
    required: true,
  })
  waterBasicServiceCharge: number;

  @property({
    type: 'number',
    required: true,
  })
  totalWaterCharge: number;

  @property({
    type: 'number',
    required: true,
  })
  sewerRate: number;

  @property({
    type: 'number',
    required: true,
  })
  sewerCharge: number;

  @property({
    type: 'number',
    required: true,
  })
  sewerBasicServiceCharge: number;

  @property({
    type: 'number',
    required: true,
  })
  drianageServiceCharge: number;

  @property({
    type: 'number',
    required: true,
  })
  totalSewerCharge: number;

  @property({
    type: 'number',
    required: true,
  })
  tax: number;


  constructor(data?: Partial<WaterConsumption>) {
    super(data);
  }
}

export interface WaterConsumptionRelations {
  // describe navigational properties here
}

export type WaterConsumptionWithRelations = WaterConsumption & WaterConsumptionRelations;
