import axios from "axios";
import * as d3 from "d3";
import {
    ElectricityBillData,
    GasBillData,
    WaterBillData,
} from "../../types/bill-data.types";

const BASE_ENDPOINT_URL = "http://localhost:3000";

export enum UtilityType {
    ELECTRICITY = 'electricity',
    GAS = 'gas',
    WATER = 'water'
}

export type BillData = {
    electricityBillData: ElectricityBillData[];
    waterBillData: WaterBillData[];
    gasBillData: GasBillData[];
};

export async function getElectricityBillData() {
    try {
        const data = (await axios.get(`${BASE_ENDPOINT_URL}/electricity-bill-data`))
            .data;

        return data;
    } catch (error: unknown) {
        if (error instanceof Error) return error;
    }
}

export async function getWaterBillData() {
    try {
        const data = (await axios.get(`${BASE_ENDPOINT_URL}/water-bill-data`)).data;

        return data;
    } catch (error: unknown) {
        if (error instanceof Error) return error;
    }
}

export async function getGasBillData() {
    try {
        const data = (await axios.get(`${BASE_ENDPOINT_URL}/gas-bill-data`)).data;

        return data;
    } catch (error: unknown) {
        if (error instanceof Error) return error;
    }
}

/**
 * Returns bill data in the form of an array containing JSON objects.
 * 
 * @param utilityType UtilityType enum
 * @returns An array containing JSON objects
 */
async function billDataRequest(utilityType: UtilityType) {
    try {
        let data: ElectricityBillData[] | WaterBillData[] | GasBillData[];

        switch (utilityType) {
            case UtilityType.ELECTRICITY:
                data = (await axios.get(`${BASE_ENDPOINT_URL}/electricity-bill-data`)).data as ElectricityBillData[];
                break;
            case UtilityType.WATER:
                data = (await axios.get(`${BASE_ENDPOINT_URL}/water-bill-data`)).data as WaterBillData[];
                break;
            case UtilityType.GAS:
                data = (await axios.get(`${BASE_ENDPOINT_URL}/gas-bill-data`)).data as GasBillData[];
                break;
        }

        return data;
    } catch (error: unknown) {
        if (error instanceof Error) return error;
    }
}

/**
 * Retrieves all the different bill data
 * 
 * @returns object of arrays of objects
 */
export async function getBillData() {
    try {
        const electricityBillData: ElectricityBillData[] = await billDataRequest(UtilityType.ELECTRICITY) as ElectricityBillData[];
        const waterBillData: WaterBillData[] = await billDataRequest(UtilityType.WATER) as WaterBillData[];
        const gasBillData: GasBillData[] = await billDataRequest(UtilityType.GAS) as GasBillData[];
        const billData: BillData = {
            electricityBillData: electricityBillData,
            waterBillData: waterBillData,
            gasBillData: gasBillData,
        };

        return billData;
    } catch (error: unknown) {
        if (error instanceof Error) {
            return error;
        }
    }
}

interface ElectricityKwhData {
    kwh: number,
    date: Date
}

interface WaterM3Data {
    m3: number,
    date: Date
}

interface GasGjData {
    gj: number,
    date: Date
}

function buildLineChart(
    svgElement: SVGSVGElement,
    fromDate: Date,
    toDate: Date,
    clientWidth: number,
    consumptionData: ElectricityKwhData[] | GasGjData[] | WaterM3Data[],
    yValue: (d: any) => number,
    maxConsumption: number,
    titleLabel: string,
    yAxisLabel: string,
) {
    const margin = {
        top: 30,
        right: 85,
        bottom: 50,
        left: 85,
    };
    const compareTime = (a: Date, b: Date) => a.getTime() - b.getTime();

    const xValue = (d: any) => d.date;

    const minDate: Date = fromDate || d3.min(
        consumptionData as any,
        (d: ElectricityKwhData | WaterM3Data | GasGjData) => d.date as Date
    ) as Date;
    const maxDate: Date = toDate || d3.max(
        consumptionData as any,
        (d: any) => d.date as Date
    ) as Date;

    consumptionData.sort((a: ElectricityKwhData | WaterM3Data | GasGjData, b: ElectricityKwhData | WaterM3Data | GasGjData) =>
        compareTime(a.date, b.date)
    );

    const width = clientWidth;
    const height = consumptionData.length;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3
        .select(svgElement)
        .attr("width", width)
        .attr("height", height)
        .attr("background", "#d3d3d3");
    svg.selectAll('g > *').remove();

    const xScale = d3
        .scaleTime()
        .domain([minDate, maxDate])
        .range([0, innerWidth])
        .nice();
    const yScale = d3
        .scaleLinear()
        .domain([0, maxConsumption])
        .range([innerHeight, 0])
        .nice();

    const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const lineGenerator = d3.line()
        .x((d) => xScale(xValue(d)))
        .y((d) => yScale(yValue(d)));

    const yAxis = d3.axisLeft(yScale).tickSize(-innerWidth);
    const xAxis = d3.axisBottom(xScale);

    const yAxisG = g.append("g").call(yAxis).style("font-size", "1em");
    yAxisG
        .append("text")
        .attr("class", "axis-label")
        .attr("y", -70)
        .attr("x", -innerHeight / 2)
        .attr("fill", "black")
        .attr("transform", `rotate(-90)`)
        .attr("text-anchor", "middle")
        .text(('Consumption ' + yAxisLabel));
    const xAxisG = g
        .append("g")
        .call(xAxis)
        .attr("transform", `translate(0, ${innerHeight})`)
        .style("font-size", "1em");
    xAxisG
        .selectAll("text")
        .attr("x", -30)
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "start");

    const clipPath = g.append('defs')
        .append('clipPath')
            .attr('id', 'clip')
                .append('rect')
                .attr('width', innerWidth)
                .attr('height', innerHeight);

    g.append("path")
        .attr("class", "line-path")
        .attr("d", lineGenerator(consumptionData as any))
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr('clip-path', 'url(#clip)');
    g.selectAll("circle")
        .data(consumptionData as any)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(xValue(d)))
        .attr("cy", (d) => yScale(yValue(d)))
        .attr("r", 3)
        .style("fill", "green")
        .attr('clip-path', 'url(#clip)');
    g.append("text")
        .attr("class", "title")
        .attr("y", -10)
        .attr("x", innerWidth / 2 - margin.left / 2)
        .text(titleLabel);

    d3.select(".tick line").attr("stroke", "#d1e8ff");
}

/**
 * Generates the requested line chart
 * 
 * @param svgElement SVGSVGElement DOM element
 * @param billData BillData object
 * @param fromDate Date object representing the lower range
 * @param toDate Date object representing the upper range
 * @param clientWidth the width of the container
 */
export function generateElectricityLineChart(svgElement: SVGSVGElement, billData: BillData, fromDate: Date, toDate: Date, clientWidth: number) {
    const yValue = (d: any) => d.kwh as number;
    
    const electricityKwhData: ElectricityKwhData[] =
    billData.electricityBillData.map((data) => ({
        kwh: +data.k_wh_consumption,
        date: new Date(+data.year, +data.month),
    } as ElectricityKwhData));

    const electricityMaxKwh: number = d3.max(
        electricityKwhData,
        (d) => d.kwh
    ) as number;

    const titleLabel = 'Electricity Bill Data';
    const xAxisLabel = '(kwh)';

    buildLineChart(svgElement, fromDate, toDate, clientWidth, electricityKwhData, yValue, electricityMaxKwh, titleLabel, xAxisLabel);
}

/**
 * Generates the requested line chart
 * 
 * @param svgElement SVGSVGElement DOM element
 * @param billData BillData object
 * @param fromDate Date object representing the lower range
 * @param toDate Date object representing the upper range
 * @param clientWidth the width of the container
 */
export function generateWaterLineChart(
    svgElement: SVGSVGElement, 
    billData: BillData, 
    fromDate: Date, 
    toDate: Date, 
    clientWidth: number
) {
    const yValue = (d: any) => d.m3 as number;

    const waterM3Data: WaterM3Data[] =
        billData.waterBillData.map((data) => ({
                m3: +data.m_3_consumption,
                date: new Date(+data.year, +data.month),
            } as WaterM3Data)
        );
    const waterMaxM3: number = d3.max(
        waterM3Data,
        (d) => d.m3
    ) as number;

    const titleLabel = 'Water Bill Data';
    const xAxisLabel = '(meters cubed)';
    
    buildLineChart(svgElement, fromDate, toDate, clientWidth, waterM3Data, yValue, waterMaxM3, titleLabel, xAxisLabel);
}

/**
 * Generates the requested line chart
 * 
 * @param svgElement SVGSVGElement DOM element
 * @param billData BillData object
 * @param fromDate Date object representing the lower range
 * @param toDate Date object representing the upper range
 * @param clientWidth the width of the container
 */
export function generateGasLineChart(
    svgElement: SVGSVGElement, 
    billData: BillData, 
    fromDate: Date, 
    toDate: Date, 
    clientWidth: number
) {
    const yValue = (d: any) => d.gj as number;

    const gasGjData: GasGjData[] =
        billData.gasBillData.map((data) => ({
                gj: +data.g_j_consumption,
                date: new Date(+data.year, +data.month),
            } as GasGjData)
        );
    const gasMaxGj: number = d3.max(
        gasGjData,
        (d) => d.gj
    ) as number;

    const titleLabel = 'Gas Bill Data';
    const xAxisLabel = '(GJ)';
    
    buildLineChart(svgElement, fromDate, toDate, clientWidth, gasGjData, yValue, gasMaxGj, titleLabel, xAxisLabel);
}

/**
 * Generates the requested line chart
 * 
 * @param svgElement SVGSVGElement DOM element
 * @param billData BillData object
 * @param fromDate Date object representing the lower range
 * @param toDate Date object representing the upper range
 * @param clientWidth the width of the container
 */
export function generateLineChart(
    svgElement: SVGSVGElement,
    billData: BillData,
    utilityType: UtilityType,
    fromDate: Date,
    toDate: Date,
    clientWidth: number
) {
    switch (utilityType) {
        case UtilityType.ELECTRICITY:
            generateElectricityLineChart(svgElement, billData, fromDate, toDate, clientWidth);
            break;
        case UtilityType.WATER:
            generateWaterLineChart(svgElement, billData, fromDate, toDate, clientWidth);
            break;
        case UtilityType.GAS:
            generateGasLineChart(svgElement, billData, fromDate, toDate, clientWidth);
            break;
    }
}

export function handleDateOnChange(e: any, callback: React.Dispatch<React.SetStateAction<Date | undefined>>) {
    const date = `${e.target.value} 00:00`;

    callback(new Date(date));
}
