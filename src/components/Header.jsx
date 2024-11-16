import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
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
        <AppBar color="inherit" elevation={6}>
          <Toolbar>
            <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "flex-start" }}>
              <Box>Lo Go</Box>
              <Box>
                <Typography
                  variant="h6"
                  className="text-blue-600 font-semibold"
                  color="primary"
                >
                  Dragon Craigslist
                </Typography>
              </Box>
            </Box>
    
            {/* Navigation Links */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                flexGrow: 2,
              }}
            >
              <Button color="inherit">Marketplace</Button>
              <Button color="inherit" className="text-gray-700 normal-case">
                Newstand
              </Button>
              <Button color="inherit" className="text-gray-700 normal-case">
                Contact Us
              </Button>
            </Box>
    
            {/* Auth Buttons */}
            <Box
              className="flex space-x-2"
              sx={{ flex: 2, display: "flex", justifyContent: "space-evenly" }}
            >
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
            </Box>
          </Toolbar>
        </AppBar>
      );
    }
    
    export default PageHeader;