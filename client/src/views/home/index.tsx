import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
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
    const [size, setSize] = useState({width: 0, height: 0});
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

    useLayoutEffect(() => {
        if (containerRef.current) setSize({
            ...size,
            width: containerRef.current.clientWidth
        });
    }, []);

    useEffect(() => {
        if (typeof billData === 'object') {
            const container = d3.select(containerRef.current);
            const margin = {
                top: 20,
                right: 20,
                bottom: 100,
                left: 75
            }

            const xValue = (d: any) => d.date;
            const yValue = (d: any) => d.kwh as number;
            const compareTime = (a: Date, b: Date) => a.getTime() - b.getTime();

            const electricityKwhData: ElectricityKwhData[] = billData.electricityBillData.map(data => ({
                kwh: +data.k_wh_consumption,
                date: new Date(+data.year, +data.month)
            }) as ElectricityKwhData);
            const electricityMinDate: Date = d3.min(electricityKwhData, d => d.date as Date) as Date;
            const electricityMaxDate: Date = d3.max(electricityKwhData, d => d.date as Date) as Date;
            const electricityMaxKwh: number = d3.max(electricityKwhData, d => d.kwh) as number;
            electricityKwhData.sort((a: ElectricityKwhData, b: ElectricityKwhData) => compareTime(a.date, b.date));
            
            setSize({
                width: container.property('clientWidth'),
                height: electricityKwhData.length
            });
            const innerWidth = size.width - margin.left - margin.right;
            const innerHeight = size.height - margin.top - margin.bottom;

            const svg = d3.select(svgRef.current)
                .attr('width', size.width)
                .attr('height', size.height)
                .attr('background', '#d3d3d3');

            const xScale = d3.scaleTime()
                .domain([electricityMinDate, electricityMaxDate])
                .range([0, innerWidth])
                .nice();
            const yScale = d3.scaleLinear()
                .domain([0, electricityMaxKwh])
                .range([innerHeight, 0])
                .nice();

            if (svg.selectChild()) console.log(svg.selectChild());

            const g = svg.append('g')
                .attr('transform', `translate(${margin.left}, ${margin.top})`);

            const lineGenerator = d3.line()
                .x(d => xScale(xValue(d)))
                .y(d => yScale(yValue(d)));

            g.append('g').call(d3.axisLeft(yScale))
                .style('font-size', '1em');
            const xLabels = g.append('g').call(d3.axisBottom(xScale))
                .attr('transform', `translate(0, ${innerHeight})`)
                .style('font-size', '1em');
            g.append('path')
                .attr('class', 'line-path')
                .attr('d', lineGenerator(electricityKwhData as any))
                .attr('fill', 'none')
                .attr('stroke', 'green');
            g.selectAll('circle').data(electricityKwhData)
                .enter().append('circle')
                    .attr('cx', d => xScale(xValue(d)))
                    .attr('cy', d => yScale(yValue(d)))
                    .attr('r', 3)
                    .style('fill', 'green');
            xLabels.selectAll('text')
                .attr('x', -30)
                .attr('transform', 'rotate(-45)')
                .style('text-anchor', 'start');
        }
    }, [billData, size]);

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
