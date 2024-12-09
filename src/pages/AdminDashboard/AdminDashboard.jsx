import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TableContainer,
    Paper,
    TableRow,
    Table,
    TableHead,
    TableCell,
    TableBody,
    Avatar,
    Switch,
    styled
} from '@mui/material';
import { BookCopy, Users, SquareKanban, UserRoundX } from 'lucide-react';
import PageHeader from '../../components/Header';
import { BarChart } from '@mui/x-charts/BarChart';
import axios from "axios";
import { Gauge } from '@mui/x-charts/Gauge';

import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import PhoneIcon from '@mui/icons-material/Phone';

const cardStyle = {
    borderRadius: '20px',
    border: '0.5px solid gray',
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

const IOSSwitch = styled((props) => (
    <Switch disableRipple focusVisibleClassName=".Mui-focusVisible" {...props} />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 2,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(16px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
          opacity: 1,
          border: 0,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#33cf4d',
        border: '6px solid #fff',
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color: theme.palette.mode === 'dark' ? theme.palette.grey[600] : theme.palette.grey[100],
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: theme.palette.mode === 'dark' ? 0.3 : 0.7,
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 22,
      height: 22,
    },
    '& .MuiSwitch-track': {
      borderRadius: 13,
      backgroundColor: theme.palette.mode === 'dark' ? '#39393D' : '#E9E9EA',
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
    },
  }));




export default function AdminDashboard() {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const [listOfUsers, setListOfUsers] = useState([]);
    const [listOfProducts, setListOfProducts] = useState([]);
    const [listOfNewAccounts, setListOfNewAccounts] = useState([]);
    const [listOfBlockedUsers, setListOfBlockedUsers]= useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const [openModal, setOpenModal] = useState(false);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        const fetchListOfUsers = async () => {
            try {
                let response = await axios.get(`${API_URL}/admin/all-users`);
                console.log("response users: ", response);
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
                let response = await axios.get(`${API_URL}/admin/all-products`);
                console.log("response products: ", response)
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


    // Handle Deactivate Users
    const toggleBlockUser = async (userId, currentStatus) => {
        try {
            const response = await axios.put(`${API_URL}/admin/block-user/${userId}`, {
                is_blocked: !currentStatus,
            });
            const updatedUser = response.data;

            // Update the local state with the modified user
            setListOfUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.user_id === updatedUser.user_id ? updatedUser : user
                )
            );
            onCancel();
        } catch (error) {
            console.error("Error updating user block status:", error);
        }
    };

    const toggleBlockPost = async (postId, currentStatus) => {
        try {
            const response = await axios.put(`${API_URL}/admin/block-post/${postId}`, {
                is_blocked: !currentStatus,
            });
            const updatedPost = response.data;

            // Update the local state with the modified user
            setListOfProducts((prevPosts) =>
                prevPosts.map((product) =>
                    product.id === updatedPost.id ? updatedPost : product
                )
            );
            onCancel();
        } catch (error) {
            console.error("Error updating Post block status:", error);
        }
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
    function sumOfCost() {
        let totalCost = 0
        for (let i=0; i < listOfProducts.length; i++) {
            let currentCost = Number(listOfProducts[i].price) * Number(listOfProducts[i].quantity);
            totalCost += currentCost
        }
        return totalCost;
    }

    function numberOfBooksPerGenre(type) {
        let totalQuantity = 0;

        for (let product of listOfProducts) {
            if (product.genre == String(type)) {
                totalQuantity += parseInt(product.quantity)
            }
        }
        return totalQuantity;
    }

    function totalSalesPerGenre(type) {
        let totalCost = 0;

        for (let product of listOfProducts) {
            if (product.genre == String(type)) {
                totalCost += parseInt(product.price ? (product.price * product.quantity)  : 0)
            }
        }
        return totalCost;
    }

    const handleConfirmationModal = (userId) => {
        setSelectedUserId(userId);
        setOpenModal(true);
    }

    const onCancel = () => {
        setOpenModal(false);
    }

    return (
        <Box p={1}>
            <PageHeader />
            
        {/* Stats Cards */}
            <Box container spacing={4} sx={{mt: 12}}>
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Card sx={cardStyle}>
                        <CardContent sx={contentStyle}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="body2" color="textSecondary">Total Posts</Typography>
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
                                    <Typography variant="body2" color="green">{numOfNewUsersPerDay} Daily New Users Account</Typography>                                
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
                                    <Typography variant="body2" color="textSecondary">Number of Users</Typography>
                                    <Typography variant="h4" fontWeight="bold">{listOfUsers.length}</Typography>
                                    <Typography variant="body2" color="green">+5% Increase Users</Typography>
                                </Box>
                                <SquareKanban size={32} color="#2196f3" />
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            
                {/* Bar Chart */}
                <Box>
                    <Card sx={{ mt: 4, border: '0.5px solid gray', borderRadius: '20px' }}>
                        <CardHeader title="Inventories Analysis" />
                        <CardContent sx={{border: '1px solid red', display: 'flex', padding: 1, borderRadius: '20px'}}>
                                {/* Left Parent Box */}
                            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Box sx={{ border: '0.5px solid red' }}>
                                    <Typography>Product Quantity by Genre</Typography>
                                    <Box sx={{display: 'flex', justifyContent: "space-between"}}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <Gauge width={150} height={100} value={numberOfBooksPerGenre("Fiction")} startAngle={-90} endAngle={90} />
                                            <Typography variant="body1" sx={{ mt: 1 }}>
                                                Total Fiction Books
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <Gauge width={150} height={100} value={numberOfBooksPerGenre('Dystopian')} startAngle={-90} endAngle={90} />
                                            <Typography variant="body1" sx={{ mt: 1 }}>
                                                Total Dystopian Books
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <Gauge width={150} height={100} value={numberOfBooksPerGenre('Science')} startAngle={-90} endAngle={90} />
                                            <Typography variant="body1" sx={{ mt: 1 }}>
                                                Total Science Books
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <Gauge width={150} height={100} value={numberOfBooksPerGenre('Classic')} startAngle={-90} endAngle={90} />
                                            <Typography variant="body1" sx={{ mt: 1 }}>
                                                Total Classic Books
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box sx={{ border: '0.5px solid blue' }}>
                                    {/* This Typo go all right top */}
                                    <Typography variant="h6">Total Sales Inventory: ${sumOfCost()}</Typography> 
                                    <BarChart
                                        xAxis={[{ scaleType: 'band', data: ['Fiction', 'Non-Fiction', 'Dystopian', 'Science', 'Classic', 'Technology'] }]}
                                        series={[{ data: [totalSalesPerGenre('Fiction'), totalSalesPerGenre('Non-Fiction'), totalSalesPerGenre('Dystopian'), totalSalesPerGenre('Science'), totalSalesPerGenre('Classic'), totalSalesPerGenre('Technology')] }]}
                                        width={700}
                                        height={250}
                                    />
                                    {/* This Typo go all Left Top  */}
                                    <Typography sx={{ display: 'flex', alignItems: 'center'}} variant="h6">Total Sales by Genre</Typography>
                                </Box>
                            </Box>
                            {/* Right Parent Box */}
                            <Box sx={{ flex: 1, overflowX: 'auto', gap: 1, border: "1px solid black" }}>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Product ID</TableCell>
                                                <TableCell>ISBN</TableCell>
                                                <TableCell>Title</TableCell>
                                                <TableCell>Genre</TableCell>
                                                <TableCell>Author</TableCell>
                                                <TableCell>Price</TableCell>
                                                <TableCell>Quantity</TableCell>
                                                <TableCell>Post Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {listOfProducts.map((item, index) => (
                                            <TableRow key={index}>
                                            <TableCell>{item.id}</TableCell>
                                            <TableCell>{item.isbn}</TableCell>
                                            <TableCell>{item.title}</TableCell>
                                            <TableCell>{item.genre}</TableCell>
                                            <TableCell>{item.author}</TableCell>
                                            <TableCell>${item.price}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>
                                                <IOSSwitch
                                                sx={{ m: 1 }}
                                                checked={item.is_blocked} 
                                                onClick={() => toggleBlockPost(item.id, item.is_blocked)}
                                                />
                                            </TableCell>
                                            </TableRow>
                                        ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </CardContent>
                    </Card>

                    <Card sx={{mt: 4}}>
                        <CardHeader title="Users Management" />
                        <CardContent>
                            <Box sx={{ overflowX: 'auto' }}>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{fontWeight: 'bold', textAlign: 'center'}}>User ID</TableCell>
                                                <TableCell sx={{fontWeight: 'bold', textAlign: 'center'}}>Full Name</TableCell>
                                                <TableCell sx={{fontWeight: 'bold', textAlign: 'center'}}>Username</TableCell>
                                                <TableCell sx={{fontWeight: 'bold', textAlign: 'center'}}>Password</TableCell>
                                                <TableCell sx={{fontWeight: 'bold', textAlign: 'center'}}>Phone Number</TableCell>
                                                <TableCell sx={{fontWeight: 'bold', textAlign: 'center'}}>Create Date</TableCell>
                                                <TableCell sx={{fontWeight: 'bold', textAlign: 'center'}} >User Status</TableCell>
                                                <TableCell sx={{fontWeight: 'bold', textAlign: 'center'}}>Block Users</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {listOfUsers.map((user) => (
                                            <TableRow key={user.user_id}>
                                            
                                                <TableCell sx={{textAlign: 'center'}}>
                                                    {user.user_id}
                                                </TableCell>
                                                <TableCell>
                                                    <Box
                                                        sx={{
                                                        display: 'flex',
                                                        alignItems: 'center', 
                                                        justifyContent: 'center', 
                                                        gap: 1,
                                                        }}
                                                    >
                                                        <Avatar sx={{ bgcolor: 'orange' }}>
                                                        {user.first_name[0].toUpperCase()}
                                                        </Avatar>
                                                        {`${user.first_name} ${user.last_name}`}
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{textAlign: 'center'}}>{user.username}</TableCell>
                                                <TableCell sx={{textAlign: 'center'}}>{user.password}</TableCell>
                                                <TableCell sx={{textAlign: 'center'}}>
                                                    <Box sx={{
                                                        display: 'flex',
                                                        alignItems: 'center', 
                                                        justifyContent: 'center', 
                                                        gap: 1,
                                                        }}>
                                                            <PhoneIcon /> 
                                                            {user.phone}
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{textAlign: 'center'}}>{user.created_at}</TableCell>
                                            <TableCell sx={{textAlign: 'center'}}>
                                                {user.is_blocked ? (
                                                <CancelRoundedIcon sx={{ color: 'red' }} />
                                                ) : (
                                                <CheckCircleRoundedIcon sx={{ color: 'green' }} />
                                                )}
                                            </TableCell>
                                            <TableCell sx={{textAlign: 'center'}}>
                                                <Button
                                                type="button"
                                                onClick={() => handleConfirmationModal(user.user_id)}
                                                sx={{
                                                    color: 'black',
                                                    borderRadius: '5px',
                                                    border: '0.5px solid gray'
                                                }}
                                                >
                                                {user.is_blocked? "Reactivate": "Block"}
                                                </Button>

                                                <Dialog open={openModal} onClose={onCancel}>
                                                <DialogTitle>
                                                    {user.is_blocked ? `Reactivate Account: ${user.username} ?` : `Deactivate User: ${user.username}?`}
                                                </DialogTitle>
                                                <DialogContent>
                                                    {user.is_blocked ? "Enabling this account will restore full system access for the user." : "Disabling this account will block the user from accessing the system."}
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={onCancel}>Cancel</Button>
                                                    <Button
                                                        variant="contained"
                                                        color={user.is_blocked ? "success" : "error"}
                                                        onClick={() => toggleBlockUser(selectedUserId, user.is_blocked)}
                                                    >
                                                        {user.is_blocked ? "Reactivate Account" : "Block Account"}
                                                    </Button>
                                                </DialogActions>
                                                </Dialog>
                                            </TableCell>
                                            </TableRow>
                                        ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>

                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
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
                </Box>
            </Box>
        </Box>
    );
};