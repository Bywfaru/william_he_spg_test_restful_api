import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Container, Stack, FormLabel, FormCheck, FormControl, Form } from 'react-bootstrap';
import { BillData, generateLineChart, getBillData, UtilityType } from './functions';

export default function Home() {
    const [billData, setBillData] = useState<BillData>();
    const [isLoading, setIsLoading] = useState<Boolean>(true);
    const [fromDate, setFromDate] = useState<Date>();
    const [toDate, setToDate] = useState<Date>();
    const [utilityType, setUtilityType] = useState<UtilityType>(UtilityType.ELECTRICITY);
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
        if (typeof billData === 'object' && containerRef.current && svgRef.current) {
            generateLineChart(
                containerRef.current as HTMLDivElement, 
                svgRef.current as SVGSVGElement, 
                billData as BillData, 
                utilityType as UtilityType, 
                fromDate as Date, 
                toDate as Date
            );
        }
    }, [billData, utilityType, fromDate, toDate]);

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
                <FormControl name='inputDateFrom' type='date' onChange={(e) => { setFromDate(new Date(e.target.value)) }} />
                <FormLabel>TO</FormLabel>
                <FormControl name='inputDateTo' type='date' onChange={(e) => { setToDate(new Date(e.target.value)) }} />

                <FormLabel>Utility Types</FormLabel>
                <Form>
                    <Stack>
                        <FormCheck label='Electricity' name='utilityType' type='radio' defaultChecked={true} onChange={() => { setUtilityType(UtilityType.ELECTRICITY) }} />
                        <FormCheck label='Water' name='utilityType' type='radio' onChange={() => { setUtilityType(UtilityType.WATER) }} />
                        <FormCheck label='Gas' name='utilityType' type='radio' onChange={() => { setUtilityType(UtilityType.GAS) }} />
                    </Stack>
                </Form>
            </Stack>
        </Container>
    )
}
