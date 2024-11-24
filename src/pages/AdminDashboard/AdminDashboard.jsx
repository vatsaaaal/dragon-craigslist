import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    Box,
} from '@mui/material';
import { BookCopy, Users, SquareKanban, UserRoundX } from 'lucide-react';
import PageHeader from '../../components/Header';
import { LineChart } from '@mui/x-charts/LineChart';
import axios from "axios";
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';


const browserData = [
    { browser: 'Chrome', sessions: 1200, bounceRate: '25%', transactions: 200 },
];

const cardStyle = {
    borderRadius: '5px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    height: '150px',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
    transform: 'scale(1.02)',
    }
};

    const contentStyle = {
        height: '100%',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    };


export default function AdminDashboard() {
    const [listOfUsers, setListOfUsers] = useState([]);

    useEffect(() => {
        const fetchListOfUsers = async () => {
            try {
                let response = await axios.get("http://localhost:3000/admin/all-users");
                if (!response.status === 200) {
                    throw new Error(`HTTP response error! status: ${response.status}`)
                }
                let usersData = response.data;
                setListOfUsers(usersData);
            } catch(error) {
                console.error("Error fetching users (client side): ", error);
            }
        };
        fetchListOfUsers();
    }, []);


    const toggleBlockUser = async (userId, currentStatus) => {
        console.log("Blocked!");
    }

    const numOfBlockedUsers = listOfUsers.filter(user => user.is_blocked).length;

    return (
        <Box p={1}>
            <PageHeader />
            
        {/* Stats Cards */}
            <Box container spacing={4} sx={{mt: 12, bgcolor: 'lightgrey'}}>
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Card sx={cardStyle}>
                        <CardContent sx={contentStyle}>
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
                    
                    <Card sx={cardStyle}>
                        <CardContent sx={contentStyle}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="body2" color="textSecondary">New Sign Up</Typography>
                                    <Typography variant="h4" fontWeight="bold">2</Typography>
                                    <Typography variant="body2" color="green">+2 Weekly New Users Account</Typography>
                                </Box>
                                <Users size={32} color="#2196f3" />
                            </Box>
                        </CardContent>
                    </Card>

                    <Card sx={cardStyle}>
                        <CardContent sx={contentStyle}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box>
                                <Typography variant="body2" color="textSecondary">Blocked Users</Typography>
                                <Typography variant="h4" fontWeight="bold">{numOfBlockedUsers}</Typography>
                                <Typography variant="body2" color="red">0 Users have been blocked Weekly</Typography>
                            </Box>
                            <UserRoundX size={32} color="#2196f3" />
                        </Box>
                        </CardContent>
                    </Card>

                    <Card sx={cardStyle}>
                        <CardContent sx={contentStyle}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="body2" color="textSecondary">Inventories</Typography>
                                    <Typography variant="h4" fontWeight="bold">99</Typography>
                                    <Typography variant="body2" color="green">+10% Products Weekly</Typography>
                                </Box>
                                <SquareKanban size={32} color="#2196f3" />
                            </Box>
                        </CardContent>
                    </Card>
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
                            <Box>
                                <Gauge width={100} height={100} value={listOfUsers.length} startAngle={-90} endAngle={90} />
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