import React, { useState } from "react";
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

export default function SignIn() {
  let [isLoading, setLoading] = useState(false);
  let [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChangeInputs = (event) => {
    const { name, value } = event.target;
    setLoginFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogInSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginFormData),
        credentials: "include",
      });

      if (response.ok) {
        window.location.href = "/";
      } else {
        setErrorMessage("Invalid email or password. Please try again.");
      }
    } catch (error) {
      console.error("Unable to LogIn:", error);
      setErrorMessage("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
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
              maxWidth: "440px", // Limit form width
              padding: "0 20px",
            }}
          >
            {/* Dragon Mascot */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 4,
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
                alt="Dragon Book"
                sx={{ width: 290, height: 110, mb: 2 }}
              />
            </Box>

            {/* Title */}
            <Typography
              component="h1"
              variant="h4"
              color="primary"
              sx={{ mb: 4, textAlign: "center" }}
            >
              Login to your Dragon Account!
            </Typography>

            {/* Form */}
            <Box
              component="form"
              sx={{ width: "100%" }}
              onSubmit={handleLogInSubmit}
            >
              {errorMessage && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errorMessage}
                </Alert>
              )}
              <TextField
                fullWidth
                required
                variant="outlined"
                name="email"
                type="email"
                label="Dragon Email"
                value={loginFormData.email}
                onChange={handleChangeInputs}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                required
                variant="outlined"
                name="password"
                type="password"
                label="Password"
                value={loginFormData.password}
                onChange={handleChangeInputs}
                sx={{ mb: 2 }}
              />

              <Box sx={{ mb: 2 }}>
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
                sx={{ py: 1.5, mb: 3 }}
              >
                {isLoading ? <CircularProgress size={24} /> : "LOGIN"}
              </Button>

              <Typography align="center">
                Need Dragon Account?{" "}
                <Link
                  component={RouterLink}
                  to="/register"
                  color="primary"
                  sx={{ ml: 1 }}
                >
                  SIGN UP
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
