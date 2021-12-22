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

    // useLayoutEffect(() => {
    //     if (containerRef.current) setSize({
    //         ...size,
    //         width: containerRef.current.clientWidth
    //     });
    // }, []);

    useEffect(() => {
        if (typeof billData === 'object') {
            const container = d3.select(containerRef.current);
            const margin = {
                top: 30,
                right: 85,
                bottom: 50,
                left: 85
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
            
            const width = container.property('clientWidth');
            const height = electricityKwhData.length
            const innerWidth = width - margin.left - margin.right;
            const innerHeight = height - margin.top - margin.bottom;

            const svg = d3.select(svgRef.current)
                .attr('width', width)
                .attr('height', height)
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
            const yAxis = d3.axisLeft(yScale)
                .tickSize(-innerWidth);
            const xAxis = d3.axisBottom(xScale);
            const yAxisG = g.append('g').call(yAxis)
                .style('font-size', '1em');
            yAxisG.append('text')
                .attr('class', 'axis-label')
                .attr('y', -70)
                .attr('x', -innerHeight / 2)
                .attr('fill', 'black')
                .attr('transform', `rotate(-90)`)
                .attr('text-anchor', 'middle')
                .text('Consumption (kwh)');
            const xAxisG = g.append('g').call(xAxis)
                .attr('transform', `translate(0, ${innerHeight})`)
                .style('font-size', '1em');
            xAxisG.selectAll('text')
                .attr('x', -30)
                .attr('transform', 'rotate(-45)')
                .style('text-anchor', 'start');        
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
            g.append('text')
                .attr('class', 'title')
                .attr('y', -10)
                .attr('x', (innerWidth / 2 - margin.left / 2))
                .text('Utility Bill Data');
            d3.select('.tick line')
                .attr('stroke', '#d1e8ff');
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
