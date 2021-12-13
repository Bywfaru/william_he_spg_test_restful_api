import {model, property} from '@loopback/repository';
import {EnergyConsumptionBase} from './energy-consumption-base.model';

@model()
export class GasConsumption extends EnergyConsumptionBase {
  @property({
    type: 'number',
    required: true,
  })
  gasCharge: number;

  @property({
    type: 'number',
    required: true,
  })
  demandCharge: number;

  @property({
    type: 'number',
    required: true,
  })
  deliveryCharge: number;

  @property({
    type: 'number',
    required: true,
  })
  rateRiders: number;

  @property({
    type: 'number',
    required: true,
  })
  minucipalFranchiseeFee: number;

  @property({
    type: 'number',
    required: true,
  })
  carbonTax: number;

  @property({
    type: 'number',
    required: true,
  })
  adminFee: number;


  constructor(data?: Partial<GasConsumption>) {
    super(data);
  }
}

export interface GasConsumptionRelations {
  // describe navigational properties here
}

export type GasConsumptionWithRelations = GasConsumption & GasConsumptionRelations;
