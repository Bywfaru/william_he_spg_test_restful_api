import React, { useState, useEffect, useRef } from 'react';
import { Container, Stack, FormLabel, FormCheck, FormControl, Form } from 'react-bootstrap';
import { BillData, generateLineChart, getBillData, UtilityType, handleDateOnChange } from './functions';

export default function Home() {
    const [billData, setBillData] = useState<BillData>();
    const [isLoading, setIsLoading] = useState<Boolean>(true);
    const [fromDate, setFromDate] = useState<Date>();
    const [toDate, setToDate] = useState<Date>();
    const [utilityType, setUtilityType] = useState<UtilityType>(UtilityType.ELECTRICITY);
    const [clientWidth, setClientWidth] = useState<number>();
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    
    function handleResize() {
        if (containerRef.current) setClientWidth(containerRef.current.clientWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        getBillData()
            .then(res => {
                if (res instanceof Error) {
                    console.error(res.message);
                } else {
                    setIsLoading(false);
                    setBillData(res as BillData);
                    handleResize()
                }
            });

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (typeof billData === 'object' && containerRef.current && svgRef.current && clientWidth) {
            generateLineChart(
                svgRef.current as SVGSVGElement, 
                billData as BillData, 
                utilityType as UtilityType, 
                fromDate as Date, 
                toDate as Date,
                clientWidth as number
            );
        }
    }, [billData, utilityType, fromDate, toDate, clientWidth]);

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
                <FormControl name='inputDateFrom' type='date' onChange={(e) => { handleDateOnChange(e, setFromDate) }} />
                <FormLabel>TO</FormLabel>
                <FormControl name='inputDateTo' type='date' onChange={(e) => { handleDateOnChange(e, setToDate) }} />

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
