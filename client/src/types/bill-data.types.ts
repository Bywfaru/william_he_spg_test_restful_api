export interface ElectricityBillData {
    id: string;
    createdBy: string;
    createdDate: string;
    lastModifiedBy: string;
    lastModifiedDate: string;
    month: string;
    year: string;
    total_charge: string;
    k_wh_consumption: string;
    blended_rate: string;
    electricity_rate: string;
    energy_charge: string;
    transaction_charge: string;
    distribution_charge: string;
    local_account_charge: string;
    tax: string;
    rate_riders: string;
    building_id: string;
}

export interface GasBillData {
    id: string;
    createdBy: string;
    createdDate: string;
    lastModifiedBy: string;
    lastModifiedDate: string;
    month: string;
    year: string;
    total_charge: string;
    g_j_consumption: string;
    blended_rate: string;
    gas_charge: string;
    demand_charge: string;
    delivery_charge: string;
    rate_riders: string;
    municipal_franchisee_fee: string;
    carbon_tax: string;
    admin_fee: string;
    building_id: string;
}

export interface WaterBillData {
    id: string;
    createdBy: string;
    createdDate: string;
    lastModifiedBy: string;
    lastModifiedDate: string;
    month: string;
    year: string;
    total_charge: string;
    m_3_consumption: string;
    blended_rate: string;
    water_rate: string;
    water_charge: string;
    water_basic_service_charge: string;
    total_water_charge: string;
    sewer_rate: string;
    sewer_charge: string;
    sewer_basic_service_charge: string;
    drianage_service_charge: string;
    total_sewer_charge: string;
    tax: string;
    building_id: string;
}
