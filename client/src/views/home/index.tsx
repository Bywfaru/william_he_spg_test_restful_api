import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Stack } from 'react-bootstrap';

export default function Home() {
    return (
        <>
            <Container>
                <Stack direction='vertical'>
                    <h1>William He - SPG Test: RESTful API</h1>
                    <Link to={'/electricity-bill-data'}>Electricity Bill Data</Link>
                    <Link to={'/water-bill-data'}>Water Bill Data</Link>
                    <Link to={'/gas-bill-data'}>Gas Bill Data</Link>
                </Stack>
            </Container>
        </>
    )
}
