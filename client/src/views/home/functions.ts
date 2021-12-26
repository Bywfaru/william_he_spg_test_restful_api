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

export async function getBillData() {
    try {
        const electricityBillData: ElectricityBillData[] =
            await getElectricityBillData();
        const waterBillData: WaterBillData[] = await getWaterBillData();
        const gasBillData: GasBillData[] = await getGasBillData();
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

export function generateElectricityLineChart(containerElement: HTMLDivElement, svgElement: SVGSVGElement, billData: BillData, fromDate: Date, toDate: Date) {
    const container = d3.select(containerElement);
    const margin = {
        top: 30,
        right: 85,
        bottom: 50,
        left: 85,
    };

    const xValue = (d: any) => d.date;
    const yValue = (d: any) => d.kwh as number;
    const compareTime = (a: Date, b: Date) => a.getTime() - b.getTime();

    const electricityKwhData: ElectricityKwhData[] =
        billData.electricityBillData.map((data) => ({
                kwh: +data.k_wh_consumption,
                date: new Date(+data.year, +data.month),
            } as ElectricityKwhData)
        );
    const minDate: Date = fromDate || d3.min(
        electricityKwhData,
        (d) => d.date as Date
    ) as Date;
    const maxDate: Date = toDate || d3.max(
        electricityKwhData,
        (d) => d.date as Date
    ) as Date;
    const electricityMaxKwh: number = d3.max(
        electricityKwhData,
        (d) => d.kwh
    ) as number;
    electricityKwhData.sort((a: ElectricityKwhData, b: ElectricityKwhData) =>
        compareTime(a.date, b.date)
    );

    const width = container.property("clientWidth");
    const height = electricityKwhData.length;
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
        .domain([0, electricityMaxKwh])
        .range([innerHeight, 0])
        .nice();

    const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const lineGenerator = d3
        .line()
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
        .text("Consumption (kwh)");
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

    g.append("path")
        .attr("class", "line-path")
        .attr("d", lineGenerator(electricityKwhData as any))
        .attr("fill", "none")
        .attr("stroke", "green");
    g.selectAll("circle")
        .data(electricityKwhData)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(xValue(d)))
        .attr("cy", (d) => yScale(yValue(d)))
        .attr("r", 3)
        .style("fill", "green");
    g.append("text")
        .attr("class", "title")
        .attr("y", -10)
        .attr("x", innerWidth / 2 - margin.left / 2)
        .text("Electricity Bill Data");

    d3.select(".tick line").attr("stroke", "#d1e8ff");
}

export function generateWaterLineChart(containerElement: HTMLDivElement, svgElement: SVGSVGElement, billData: BillData, fromDate: Date, toDate: Date) {
    const container = d3.select(containerElement);
    const margin = {
        top: 30,
        right: 85,
        bottom: 50,
        left: 85,
    };

    const xValue = (d: any) => d.date;
    const yValue = (d: any) => d.m3 as number;
    const compareTime = (a: Date, b: Date) => a.getTime() - b.getTime();

    const waterM3Data: WaterM3Data[] =
        billData.waterBillData.map((data) => ({
                m3: +data.m_3_consumption,
                date: new Date(+data.year, +data.month),
            } as WaterM3Data)
        );
    const minDate: Date = fromDate || d3.min(
        waterM3Data,
        (d) => d.date as Date
    ) as Date;
    const maxDate: Date = toDate || d3.max(
        waterM3Data,
        (d) => d.date as Date
    ) as Date;
    const waterMaxM3: number = d3.max(
        waterM3Data,
        (d) => d.m3
    ) as number;
    waterM3Data.sort((a: WaterM3Data, b: WaterM3Data) =>
        compareTime(a.date, b.date)
    );

    console.log(waterM3Data);

    const width = container.property("clientWidth");
    const height = waterM3Data.length;
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
        .domain([0, waterMaxM3])
        .range([innerHeight, 0])
        .nice();

    const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const lineGenerator = d3
        .line()
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
        .html("Consumption (&#13221)");
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

    g.append("path")
        .attr("class", "line-path")
        .attr("d", lineGenerator(waterM3Data as any))
        .attr("fill", "none")
        .attr("stroke", "green");
    g.selectAll("circle")
        .data(waterM3Data)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(xValue(d)))
        .attr("cy", (d) => yScale(yValue(d)))
        .attr("r", 3)
        .style("fill", "green");
    g.append("text")
        .attr("class", "title")
        .attr("y", -10)
        .attr("x", innerWidth / 2 - margin.left / 2)
        .text("Water Bill Data");

    d3.select(".tick line").attr("stroke", "#d1e8ff");
}

export function generateGasLineChart(containerElement: HTMLDivElement, svgElement: SVGSVGElement, billData: BillData, fromDate: Date, toDate: Date) {
    const container = d3.select(containerElement);
    const margin = {
        top: 30,
        right: 85,
        bottom: 50,
        left: 85,
    };

    const xValue = (d: any) => d.date;
    const yValue = (d: any) => d.gj as number;
    const compareTime = (a: Date, b: Date) => a.getTime() - b.getTime();

    const gasGjData: GasGjData[] =
        billData.gasBillData.map((data) => ({
                gj: +data.g_j_consumption,
                date: new Date(+data.year, +data.month),
            } as GasGjData)
        );
    const minDate: Date = fromDate || d3.min(
        gasGjData,
        (d) => d.date as Date
    ) as Date;
    const maxDate: Date = toDate || d3.max(
        gasGjData,
        (d) => d.date as Date
    ) as Date;
    const gasMaxGj: number = d3.max(
        gasGjData,
        (d) => d.gj
    ) as number;
    gasGjData.sort((a: GasGjData, b: GasGjData) =>
        compareTime(a.date, b.date)
    );

    const width = container.property("clientWidth");
    const height = gasGjData.length;
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
        .domain([0, gasMaxGj])
        .range([innerHeight, 0])
        .nice();

    const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const lineGenerator = d3
        .line()
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
        .text("Consumption (GJ)");
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

    g.append("path")
        .attr("class", "line-path")
        .attr("d", lineGenerator(gasGjData as any))
        .attr("fill", "none")
        .attr("stroke", "green");
    g.selectAll("circle")
        .data(gasGjData)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(xValue(d)))
        .attr("cy", (d) => yScale(yValue(d)))
        .attr("r", 3)
        .style("fill", "green");
    g.append("text")
        .attr("class", "title")
        .attr("y", -10)
        .attr("x", innerWidth / 2 - margin.left / 2)
        .text("Gas Bill Data");

    d3.select(".tick line").attr("stroke", "#d1e8ff");
}

export function generateLineChart(
    containerElement: HTMLDivElement, 
    svgElement: SVGSVGElement, 
    billData: BillData, 
    utilityType: UtilityType,
    fromDate: Date,
    toDate: Date
    ) {
    switch (utilityType) {
        case UtilityType.ELECTRICITY:
            generateElectricityLineChart(containerElement, svgElement, billData, fromDate, toDate);
            break;
        case UtilityType.WATER:
            generateWaterLineChart(containerElement, svgElement, billData, fromDate, toDate);
            break;
        case UtilityType.GAS:
            generateGasLineChart(containerElement, svgElement, billData, fromDate, toDate);
            break;
    }
}