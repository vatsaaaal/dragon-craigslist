import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Link,
  CircularProgress,
  Alert,
} from "@mui/material";

function Registration() {
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
      const response = await fetch("http://localhost:3000/users", {
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

        // Future redirection to Login page, once it exists
        // Uncomment this when Login page is available
        // window.location.href = '/login';
      } else {
        setErrorMessage("Failed to register user. Please try again.");
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

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        bgcolor: "white",
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: "50%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src="/src/assets/drexel.jpg"
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
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          flexDirection: "column",
        }}
      >
        <div
          className="dragon-mascot"
          style={{
            flexDirection: "column",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "40%",
          }}
        >
          <Box
            component="img"
            src="/src/assets/dragonMascot.png"
            alt="Dragon Logo"
            sx={{ width: 120, height: 120, mb: -1 }}
          />
          <Box
            component="img"
            src="/src/assets/book.jpg"
            alt="Dragon Logo"
            sx={{ width: 290, height: 110, mb: 2 }}
          />
        </div>
        <div className="titles">
          <Typography
            component="h1"
            variant="h4"
            color="primary"
            sx={{ mb: 1 }}
          >
            Become Our New Dragon Today!
          </Typography>
        </div>

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
            label="Set Password"
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

          <Box>
            <Link href="/" variant="body2" color="primary">
              Forgot Password?
            </Link>
          </Box>

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
      </Box>
    </Container>
  );
}

export default Registration;
