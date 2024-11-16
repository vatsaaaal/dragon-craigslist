import React, { useState, useEffect } from 'react';

import {
  Stack,
  Button,
  Toolbar,
  Typography,
  AppBar,
  Box
} from '@mui/material';


import { Link, useNavigate } from 'react-router-dom';

function PageHeader() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loggedIn = localStorage.getItem("isLoggedIn") === "true";
        setIsLoggedIn(loggedIn);
      }, []);
    
      const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        setIsLoggedIn(false);
        navigate("/login")
    };

    return (
      <AppBar color="inherit" elevation={6} position="fixed" sx={{borderBottom: '0.px solid grey' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'}}>
              <img 
                src="/src/assets/dragonMascot.png"
                alt="Logo"
                style={{ marginRight: '10px', height: 50, marginBottom: '-16px' }}
              />
              <img 
                src="/src/assets/book.jpg"
                alt="Book"
                style={{ marginRight: '10px', height: 50 }}
              />
            </Box>
            
            <Typography variant="h5" component="div" className="text-blue-600 font-semibold" color='primary'>
              Dragon Craigslist
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Stack direction="row" spacing={3} sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button color="inherit">Marketplace</Button>
              <Button color="inherit">Newstand</Button>
              <Button color="inherit">Features</Button>
              <Button color="inherit">Contact Us</Button>
          </Stack>

          {/* Auth Buttons */}
          <Stack direction="row" spacing={2} sx={{ ml: 3 }}>
            {isLoggedIn ? (
              <Button onClick={handleLogout} color="inherit" className="normal-case">
                Logout
              </Button>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/login"
                  color="inherit"
                  className="text-gray-700 normal-case"
                >
                  Log In
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  className="bg-blue-600 hover:bg-blue-700 normal-case"
                >
                  Register
                </Button>
              </>
            )}
          </Stack>

        </Toolbar>
      </AppBar>
      );
    }
    
    export default PageHeader;