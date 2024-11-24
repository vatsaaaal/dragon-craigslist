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
    const [listOfProducts, setListOfProducts] = useState([]);
    const [listOfNewAccounts, setListOfNewAccounts] = useState([]);
    const [listOfBlockedUsers, setListOfBlockedUsers]= useState([]);

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

    useEffect(() => {
        const fetchListOfProducts = async () => {
            try {
                let response = await axios.get("http://localhost:3000/admin/all-products");
                if (!response.status === 200) {
                    throw new Error(`HTTP response error! status: ${response.status}`)
                }
                let productsData = response.data;
                setListOfProducts(productsData);
            } catch(error) {
                console.error("Error fetching products (client side): ", error);
            }
        };
        fetchListOfProducts();
    }, []);

    const toggleBlockUser = async (userId, currentStatus) => {
        console.log("Blocked!");
    };

    const numOfBlockedUsers = listOfUsers.filter(user => user.is_blocked).length;
    
    // Number of new Users per day
    let todayDate = new Date().toISOString().split('T')[0]; 
    let numOfNewUsersPerDay = listOfUsers.filter(user => user.created_at.split('T')[0] === todayDate).length;

    useEffect(() => {    
        const usersCreatedToday = listOfUsers.filter(user => {
            const userCreatedAtDate = user.created_at.split('T')[0]; 
            return userCreatedAtDate === todayDate; 
        });
        setListOfNewAccounts(usersCreatedToday); 
    }, [listOfUsers]);

    // Inventory Cost 
    let inventoryCost = listOfProducts.reduce((total, product) => total + (product.price || 0), 0);

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
                                    <Typography variant="h4" fontWeight="bold">{listOfProducts.length}</Typography>
                                    <Typography variant="body2" color="green">0 New Posts Today</Typography>
                                </Box>
                                <BookCopy size={32} color="#2196f3" />
                            </Box>
                        </CardContent>
                    </Card>
                    
                    <Card sx={cardStyle}>
                        <CardContent sx={contentStyle}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="body2" color="textSecondary">New Accounts</Typography>
                                    <Typography variant="h4" fontWeight="bold">{numOfNewUsersPerDay}</Typography>
                                    <Typography variant="body2" color="green">+{numOfNewUsersPerDay} Daily New Users Account</Typography>                                </Box>
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
                                <Typography variant="body2" color="red">{numOfBlockedUsers} Users have been blocked Weekly</Typography>
                            </Box>
                            <UserRoundX size={32} color="#2196f3" />
                        </Box>
                        </CardContent>
                    </Card>

                    <Card sx={cardStyle}>
                        <CardContent sx={contentStyle}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="body2" color="textSecondary">Inventory Cost</Typography>
                                    <Typography variant="h4" fontWeight="bold">${inventoryCost}</Typography>
                                    <Typography variant="body2" color="green">+${inventoryCost} Products Daily</Typography>
                                </Box>
                                <SquareKanban size={32} color="#2196f3" />
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            
                {/* Line Chart */}
                <Box>
                    <Card sx={{ mt: 4 }}>
                        <CardHeader title="Overview of Users" />
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

                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Card sx={{ mt: 4 }}>
                        <CardHeader title="Recent Posts Report" />
                        <CardContent>
                            <Box sx={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%' }}>
                                <thead>
                                    <tr>
                                    <th style={{ padding: '16px', textAlign: 'left' }}>Product ID</th>
                                    <th style={{ padding: '16px', textAlign: 'left' }}>ISBN</th>
                                    <th style={{ padding: '16px', textAlign: 'left' }}>Title</th>
                                    <th style={{ padding: '16px', textAlign: 'left' }}>Genre</th>
                                    <th style={{ padding: '16px', textAlign: 'left' }}>Author</th>
                                    <th style={{ padding: '16px', textAlign: 'left' }}>Price</th>
                                    <th style={{ padding: '16px', textAlign: 'left' }}>Quantity</th>
                                    <th style={{ padding: '16px', textAlign: 'left' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listOfProducts.map((item, index) => (
                                    <tr key={index}>
                                        <td style={{ padding: '16px' }}>{item.id}</td>
                                        <td style={{ padding: '16px' }}>{item.isbn}</td>
                                        <td style={{ padding: '16px' }}>{item.title}</td>
                                        <td style={{ padding: '16px' }}>{item.genre}</td>
                                        <td style={{ padding: '16px' }}>{item.author}</td>
                                        <td style={{ padding: '16px' }}>${item.price}</td>
                                        <td style={{ padding: '16px' }}>{item.quantity}</td>
                                        <td style={{ padding: '16px' }}>{item.sale_completed}</td>
                                    </tr>
                                    ))}
                                </tbody>
                                </table>
                            </Box>
                        </CardContent>
                    </Card>

                    <Card sx={{ mt: 4 }}>
                        <CardHeader title="New Accounts Report" />
                        <CardContent>
                            <Box sx={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%' }}>
                                    <thead>
                                        <tr>
                                            <th style={{ padding: '16px', textAlign: 'left' }}>User IDs</th>
                                            <th style={{ padding: '16px', textAlign: 'left' }}>Username</th>
                                            <th style={{ padding: '16px', textAlign: 'left' }}>Email</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listOfNewAccounts.map((item, index) => (
                                        <tr key={item.user_id}> 
                                            <td style={{ padding: '16px' }}>{item.user_id}</td>
                                            <td style={{ padding: '16px' }}>{item.username}</td>
                                            <td style={{ padding: '16px' }}>{item.email}</td>
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
                </Box>
            </Box>
        </Box>
    );
};