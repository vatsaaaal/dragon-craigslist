import React, { useState } from 'react';
import { 
    TextField, 
    Button, 
    Typography, 
    Container,
    Box,
    Link,
    CircularProgress
} from '@mui/material';

import PageHeader from '../components/Header';


export default function LandingPage() {
    return (
        <>
        <Box sx={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex',
        overflow: 'hidden',
        position: 'fixed',
        flexDirection: 'column',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0}}>
            <PageHeader />

            {/* Main image */}
            <Box sx={{
                flex: 1,  
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: 'url(/src/assets/drexel.jpg)',
            }}>
                Main Image
            </Box>

            <Box sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                
            }}>
                Slogan
            </Box>
        </Box>
        </>
    )
}