import React from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    Box,
} from '@mui/material';
import { BookCopy, Clock, ArrowUpRight, Target } from 'lucide-react';
import PageHeader from '../../components/Header';
import { LineChart } from '@mui/x-charts/LineChart';


const browserData = [
    { browser: 'Chrome', sessions: 1200, bounceRate: '25%', transactions: 200 },
];

const Dashboard = () => {
    return (
        <Box p={6}>
            <PageHeader />
            
        {/* Stats Cards */}
            <Box container spacing={4} sx={{mt: 7, bgcolor: 'lightgrey'}}>
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Box item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Box>
                                        <Typography variant="body2" color="textSecondary">Recent Posts</Typography>
                                        <Typography variant="h4" fontWeight="bold">10</Typography>
                                        <Typography variant="body2" color="green">+2 New Posts Today</Typography>
                                    </Box>
                                    <BookCopy size={32} color="#2196f3" />
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>

                    <Box item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Box>
                                        <Typography variant="body2" color="textSecondary">New Sign Up</Typography>
                                        <Typography variant="h4" fontWeight="bold">2</Typography>
                                        <Typography variant="body2" color="green">+2 Weekly New Users Account</Typography>
                                    </Box>
                                    <Clock size={32} color="#2196f3" />
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>

                    <Box item xs={12} md={3}>
                        <Card>
                            <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="body2" color="textSecondary">Blocked Users</Typography>
                                    <Typography variant="h4" fontWeight="bold">0</Typography>
                                    <Typography variant="body2" color="red">0 Users have been blocked Weekly</Typography>
                                </Box>
                                <ArrowUpRight size={32} color="#2196f3" />
                            </Box>
                            </CardContent>
                        </Card>
                    </Box>

                    <Box item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Box>
                                        <Typography variant="body2" color="textSecondary">Inventories</Typography>
                                        <Typography variant="h4" fontWeight="bold">99</Typography>
                                        <Typography variant="body2" color="green">+10% Products Weekly</Typography>
                                    </Box>
                                    <Target size={32} color="#2196f3" />
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
            
                {/* Line Chart */}
                <Box>
                    <Card sx={{ mt: 4 }}>
                        <CardHeader title="Users' Account Overview" />
                        <CardContent>
                        <Box sx={{ height: 300 }}>
                            <LineChart
                                xAxis={[{ data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }]}
                                series={[
                                    {
                                    data: [2, 3, 5.5, 8.5, 1.5, 5, 1, 4, 3, 8],
                                    showMark: ({ index }) => index % 2 === 0,
                                    },
                                ]}
                                width={500}
                                height={300}
                            />
                        </Box>
                        </CardContent>
                    </Card>
                </Box>

                {/* Browser Stats Table */}
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Card sx={{ mt: 4 }}>
                        <CardHeader title="Recent Posts Report" />
                        <CardContent>
                            <Box sx={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%' }}>
                                <thead>
                                    <tr>
                                    <th style={{ padding: '16px', textAlign: 'left' }}>Browser</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {browserData.map((item, index) => (
                                    <tr key={index}>
                                        <td style={{ padding: '16px' }}>{item.browser}</td>
                                    </tr>
                                    ))}
                                </tbody>
                                </table>
                            </Box>
                        </CardContent>
                    </Card>

                    <Card sx={{ mt: 4 }}>
                        <CardHeader title="Sign Up Report" />
                        <CardContent>
                            <Box sx={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%' }}>
                                <thead>
                                    <tr>
                                    <th style={{ padding: '16px', textAlign: 'left' }}>Browser</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {browserData.map((item, index) => (
                                    <tr key={index}>
                                        <td style={{ padding: '16px' }}>{item.browser}</td>
                                    </tr>
                                    ))}
                                </tbody>
                                </table>
                            </Box>
                        </CardContent>
                    </Card>

                    <Card sx={{ mt: 4 }}>
                        <CardHeader title="Blocked Users Report" />
                        <CardContent>
                            <Box sx={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%' }}>
                                <thead>
                                    <tr>
                                    <th style={{ padding: '16px', textAlign: 'left' }}>Browser</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {browserData.map((item, index) => (
                                    <tr key={index}>
                                        <td style={{ padding: '16px' }}>{item.browser}</td>
                                    </tr>
                                    ))}
                                </tbody>
                                </table>
                            </Box>
                        </CardContent>
                    </Card>

                    <Card sx={{ mt: 4 }}>
                        <CardHeader title="Inventories Report" />
                        <CardContent>
                            <Box sx={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%' }}>
                                <thead>
                                    <tr>
                                    <th style={{ padding: '16px', textAlign: 'left' }}>Browser</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {browserData.map((item, index) => (
                                    <tr key={index}>
                                        <td style={{ padding: '16px' }}>{item.browser}</td>
                                    </tr>
                                    ))}
                                </tbody>
                                </table>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Box>
    );
};

export default Dashboard;
