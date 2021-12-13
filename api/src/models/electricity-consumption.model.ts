import {model, property} from '@loopback/repository';
import {EnergyConsumptionBase} from './energy-consumption-base.model';

@model()
export class ElectricityConsumption extends EnergyConsumptionBase {
  @property({
    type: 'number',
    required: true,
  })
  electricityRate: number;

  @property({
    type: 'number',
    required: true,
  })
  energyCharge: number;

  @property({
    type: 'number',
    required: true,
  })
  transactionCharge: number;

  @property({
    type: 'number',
    required: true,
  })
  distributionCharge: number;

  @property({
    type: 'number',
    required: true,
  })
  localAccountCharge: number;

  @property({
    type: 'number',
    required: true,
  })
  tax: number;

  @property({
    type: 'number',
    required: true,
  })
  rateRiders: number;


  constructor(data?: Partial<ElectricityConsumption>) {
    super(data);
  }
}

export interface ElectricityConsumptionRelations {
  // describe navigational properties here
}

export type ElectricityConsumptionWithRelations = ElectricityConsumption & ElectricityConsumptionRelations;
