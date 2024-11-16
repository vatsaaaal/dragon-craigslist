import React, { useState } from 'react';
import { 
    TextField, 
    Button, 
    Typography, 
    Container,
    Box,
} from '@mui/material';

import PageHeader from '../components/Header';
import { Link } from 'react-router-dom';

export default function LandingPage() {
    return (
        <Box sx={{ 
            minHeight: '100vh',
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
        }}>
            <PageHeader />
            <Box sx={{ mt: 15}}>
                <Container sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    position: 'relative',
                    zIndex: 1,
                    width: '100%',
                }}>
                    {/* Left Content */}
                    <Box sx={{ maxWidth: '600px', py: 9 }}>
                        <Typography
                        variant="h3"
                        color='primary'
                        sx={{
                            fontWeight: 'bold',
                            fontSize: { xs: '2.5rem', md: '4rem' },
                            mb: 2,
                            lineHeight: 1.1
                        }}
                        >
                        Promote Your Brand,
                        <br />
                        Discover More Books.
                        </Typography>
                        
                        <Button
                            variant="contained"
                            component={Link}
                            to="/register"
                            color='primary'
                            sx={{
                                '&:hover': { bgcolor: '#6cace4' },
                                borderRadius: '20px',
                                px: 4,
                                py: 1.5,
                                mt: 4,
                                textTransform: 'none',
                                fontSize: '1.1rem'
                            }}
                            >
                            Get Started
                        </Button>
        
                        <Typography
                            sx={{
                                color: '#241C15',
                                mt: 4,
                                fontSize: '1.1rem',
                                lineHeight: 1.6,
                                maxWidth: '540px'
                            }}
                        >
                            Dragon Craigslist is Drexel's go-to marketplace for all things materials. It serves as a
                            <Typography component="span" sx={{ color: '#007C89', mx: 1 }}>
                                materials hub
                            </Typography>
                            where students and faculty can easily exchange textbooks, educational resources, and other materials.
                            </Typography>
                    </Box>

                    <Box sx={{
                        display: { xs: 'none', md: 'block' },
                        width: '90%',
                        '& img': {
                            width: '100%',
                            height: 'auto'
                        },
                        marginLeft: '50px'
                    }}>
                        <img 
                            src="/src/assets/bookIllustration.png" 
                            alt="Illustration" 
                        />
                    </Box>

                {/* Decorative Elements */}
                <Box
                    sx={{
                    position: 'absolute',
                    right: -400,
                    bottom: -250,
                    width: '450px',
                    height: '450px',
                    borderRadius: '50%',
                    bgcolor: '#E7B75F',
                    opacity: 0.3,
                    zIndex: 0
                    }}
                />
                <Box
                    sx={{
                    position: 'absolute',
                    left: -400,
                    top: -100,
                    width: '350px',
                    height: '350px',
                    borderRadius: '50%',
                    bgcolor: '#002f6c',
                    opacity: 0.2,
                    zIndex: 0
                    }}
                />
                </Container>
            </Box>
        </Box>               
    );
}