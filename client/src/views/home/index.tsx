import React, { useState, useEffect, useRef } from 'react';
import { Container, InputGroup, Stack, FormLabel, FormCheck, FormControl } from 'react-bootstrap';
import * as d3 from 'd3';
import { BillData, getBillData } from './functions';
import { ElectricityBillData } from '../../types/bill-data.types';

interface ElectricityKwhData {
    kwh: number,
    date: Date
}

export default function Home() {
    const [billData, setBillData] = useState<BillData>();
    const [isLoading, setIsLoading] = useState<Boolean>(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    
    useEffect(() => {
        getBillData()
            .then(res => {
                if (res instanceof Error) {
                    console.error(res.message);
                } else {
                    setIsLoading(false);
                    setBillData(res as BillData);
                }
            });
    }, []);

    useEffect(() => {
        if (typeof billData === 'object') {
            const width = 1200;
            const height = 600;

            const svg = d3.select(svgRef.current)
                .attr('width', width)
                .attr('height', height);

            const electricityKwhData: ElectricityKwhData[] = billData.electricityBillData.map(data => ({
                kwh: +data.k_wh_consumption,
                date: new Date(+data.year, +data.month)
            }) as ElectricityKwhData);
            const electricityMinDate: Date = d3.min(electricityKwhData, d => d.date as Date) as Date;
            const electricityMaxDate: Date = d3.max(electricityKwhData, d => d.date as Date) as Date;
            const electricityMaxKwh: number = d3.max(electricityKwhData, d => d.kwh) as number;

            electricityKwhData.sort((a, b) => a.date.getTime() - b.date.getTime());

            const electricityX = d3.scaleTime()
                .domain([electricityMinDate, electricityMaxDate])
                .range([0, width]);
            const electricityY = d3.scaleLinear()
                .domain([0, electricityMaxKwh])
                .range([height, 0]);

            const electricityLine = d3.line()
                .x((d: any) => electricityX(d.date))
                .y((d: any) => electricityY(d.kwh));

            svg.selectAll('.line')
                .data([electricityKwhData])
                .join('path')
                    .attr('d', (d: any) => electricityLine(d))
                    .attr('fill', 'none')
                    .attr('stroke', '#0f770d')
                    .attr('stroke-width', 2);
        }
    }, [billData]);

    if (isLoading) {
        return (
            <Container>
                <Stack>
                    <h1>Loading...</h1>
                </Stack>
            </Container>
        )
    }

    return (
        <Container ref={containerRef}>
            <Stack>
                <h1>William He - SPG Test RESTful API</h1>

                <svg ref={svgRef}></svg>
                
                <FormLabel>FROM</FormLabel>
                <FormControl name='inputDateFrom' type='date' />
                <FormLabel>TO</FormLabel>
                <FormControl name='inputDateTo' type='date' />

                <FormLabel>Utility Types</FormLabel>
                <InputGroup>
                    <Stack>
                        <FormCheck label='Electricity'></FormCheck>
                        <FormCheck label='Water'></FormCheck>
                        <FormCheck label='Gas'></FormCheck>
                    </Stack>
                </InputGroup>
            </Stack>
        </Container>
    )
}
