import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Link,
  CircularProgress,
  useTheme,
  Alert,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

function Registration() {
    useEffect(() => {
      const fetchUsers = async () => {
          try {
              const response = await fetch('https://dragon-craigslist.onrender.com/users', {
                  method: 'GET',
                  headers: {
                      'Content-Type': 'application/json',
                  },
              });

              if (response.ok) {
                  const data = await response.json();
                  console.log('Response:', data);
              } else {
                  console.error('Failed to fetch users:', response.statusText);
              }
          } catch (error) {
              console.error('Error fetching users:', error);
          }
      };

      fetchUsers();
  }, []); 

  let [registerFormData, setRegisterFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    verifyPassword: "",
  });
  const [isLoading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegistrationSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
  
    const userData = {
      username: registerFormData.email.split("@")[0],
      password: registerFormData.password,
      first_name: registerFormData.firstName,
      last_name: registerFormData.lastName,
      email: registerFormData.email,
      school_name: "Drexel University",
    };
  
    try {
      const response = await fetch("https://dragon-craigslist.onrender.com/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
  
      if (response.ok) {
        setSuccessMessage("User registered successfully!");
        setRegisterFormData({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          password: "",
          verifyPassword: "",
        });
      } else {
        const errorData = await response.json(); // Parse server error response
        setErrorMessage(errorData.error || "Failed to register user. Please try again.");
      }
    } catch (error) {
      console.error("Unable to register:", error);
      setErrorMessage("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleChangeInputs = (event) => {
    const { name, value } = event.target;
    setRegisterFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          overflow: "hidden",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <Box
          sx={{
            width: "50%",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            [theme.breakpoints.down("md")]: {
              display: "none",
            },
          }}
        >
          <img
            src="/assets/drexel.jpg"
            alt="Drexel Bridge"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>
        <Box
          sx={{
            width: "50%",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            flexDirection: "column",
            [theme.breakpoints.down("md")]: {
              width: "100%",
              padding: theme.spacing(2),
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              width: "100%",
              maxWidth: "440px",
              padding: "0 20px",
            }}
          >
            <Box
              component="img"
              src="/assets/dragonMascot.png"
              alt="Dragon Logo"
              sx={{ width: 120, height: 120, mb: -1 }}
            />
            <Box
              component="img"
              src="/assets/book.jpg"
              alt="Dragon Logo"
              sx={{ width: 290, height: 110, mb: 2 }}
            />
          </Box>
          <Typography
            component="h1"
            variant="h4"
            color="primary"
            sx={{ mb: 4, textAlign: "center" }}
          >
            Become Our New Dragon Today!
          </Typography>

          <Box
            component="form"
            sx={{
              width: "70%",
              padding: "10px",
            }}
            onSubmit={handleRegistrationSubmit}
          >
            {successMessage && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {successMessage}
              </Alert>
            )}

            {errorMessage && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Alert>
            )}
            {/*First and Last Name*/}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mb: 3,
                justifyContent: "space-between",
              }}
            >
              <TextField
                required
                variant="outlined"
                name="firstName"
                label="First Name"
                value={registerFormData.firstName}
                onChange={handleChangeInputs}
                sx={{ width: "50%" }}
              />
              <TextField
                required
                variant="outlined"
                name="lastName"
                label="Last Name"
                value={registerFormData.lastName}
                onChange={handleChangeInputs}
                sx={{ width: "50%" }}
              />
            </Box>

            <TextField
              fullWidth
              required
              variant="outlined"
              name="email"
              type="email"
              label="Dragon Email"
              value={registerFormData.email}
              onChange={handleChangeInputs}
              sx={{ marginBottom: "20px", borderColor: "black" }}
            />
            <TextField
              fullWidth
              variant="outlined"
              name="phoneNumber"
              label="Phone Number (Optional)"
              value={registerFormData.phoneNumber}
              onChange={handleChangeInputs}
              sx={{ marginBottom: "20px", borderColor: "black" }}
            />
            <TextField
              fullWidth
              type="password"
              required
              variant="outlined"
              name="password"
              label="Create Password (At least 12 characters)"
              value={registerFormData.password}
              onChange={handleChangeInputs}
              sx={{ marginBottom: "20px", borderColor: "black" }}
            />
            <TextField
              fullWidth
              type="password"
              required
              variant="outlined"
              name="verifyPassword"
              label="Verify Password"
              value={registerFormData.verifyPassword}
              onChange={handleChangeInputs}
              sx={{ marginBottom: "20px", borderColor: "black" }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{ py: 1.5, marginTop: "20px" }}
            >
              {isLoading ? <CircularProgress /> : "Register"}
            </Button>
          </Box>

          <Box>
            <Typography>
              Already have an account?&nbsp;
              <Link component={RouterLink} to="/login" color="primary">
                LOG IN
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Registration;
