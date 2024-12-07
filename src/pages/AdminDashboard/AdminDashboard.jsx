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
import { LineChart } from '@mui/x-charts/LineChart';
import axios from "axios";
import { Gauge } from '@mui/x-charts/Gauge';

import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

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
                let response = await axios.get("http://localhost:3000/admin/all-users");
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
                let response = await axios.get("http://localhost:3000/admin/all-products");
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
            const response = await axios.put(`http://localhost:3000/admin/block-user/${userId}`, {
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
            const response = await axios.put(`http://localhost:3000/admin/block-post/${postId}`, {
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
            let currentCost = Number(listOfProducts[i].price);
            totalCost += currentCost
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
                                    <Typography variant="body2" color="green">+{numOfNewUsersPerDay} Daily New Users Account</Typography>                                
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
                                    <Typography variant="body2" color="textSecondary">Inventory Cost</Typography>
                                    <Typography variant="h4" fontWeight="bold">${sumOfCost()}</Typography>
                                    <Typography variant="body2" color="green">+${sumOfCost()} Products Daily</Typography>
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
                                                        alignItems: 'center', // Vertically center the content
                                                        justifyContent: 'center', // Horizontally center the content
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
                                                <TableCell sx={{textAlign: 'center'}}>{user.phone}</TableCell>
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
                                                <DialogTitle>Block User: {user.first_name}?</DialogTitle>
                                                <DialogContent>
                                                    The User Account will be disabled from the system.
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={onCancel}>Cancel</Button>
                                                    <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => toggleBlockUser(selectedUserId, user.is_blocked)}
                                                    >
                                                    Block Account
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
                        <CardHeader title="Recent Posts Report" />
                        <CardContent>
                        <Box sx={{ overflowX: 'auto' }}>
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
                                        {/* <TableCell>{item.sale_completed}</TableCell> */}
                                        <TableCell>
                                            <IOSSwitch 
                                                sx={{ m: 1 }} 
                                                defaultChecked 
                                                onClick={() => toggleBlockPost(item.id, item.is_blocked)}                                                />
                                        </TableCell>
                                    </TableRow>
                                    ))}
                                </TableBody>
                                </Table>
                            </TableContainer>
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
                </Box>
            </Box>
        </Box>
    );
};