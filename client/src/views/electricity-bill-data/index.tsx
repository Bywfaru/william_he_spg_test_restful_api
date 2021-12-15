import React, { useState, useEffect, useRef } from 'react';
import { Container, Stack } from 'react-bootstrap';
import * as d3 from 'd3';
import axios from 'axios';

const BASE_ENDPOINT_URL = 'http://localhost:3000/electricity-bill-data';

async function getElectricityBillData() {
    try {
        const data = (await axios.get(BASE_ENDPOINT_URL)).data;

        return data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            return {
                error: error.message
            };
        }
    }
}

export default function ElectricityBillData() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const svgRef = useRef(null);
    
    useEffect(() => {
        getElectricityBillData()
            .then(res => {
                setData(res);
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        if (data.length) {
            console.log(data.length);
            const width = 400;
            const height = 400;
            const svg = d3.select(svgRef.current)
                .attr('width', width)
                .attr('height', height)
                .style('background', '#d3d3d3');
            const xScale = d3.scaleLinear()
                .domain([0, data.length - 1])
                .range([0, width]);
            const yScale = d3.scaleLinear()
                .domain([0, height])
                .range([height, 0]);
            const generateScaledLine = d3.line()
                .x((d, i) => xScale(i))
                .y((d, i) => yScale(i));

            svg.selectAll('.line')
                .data([data])
                .join('path')
                    .attr('d', d => generateScaledLine(d))
                    .attr('fill', 'none')
                    .attr('stroke', 'black');
        }
    }, [data]);

    if (isLoading) {
        return (
            <Container>
                <Stack>
                    <h1>Loading data...</h1>
                </Stack>
            </Container>
        )
    }

    return (
        <Container>
            <Stack>
                <h1>Electricity Bill Data</h1>
            </Stack>
                <svg ref={svgRef}></svg>
        </Container>
    )
}
