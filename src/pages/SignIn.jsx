import React, {useState} from 'react';
import { 
    TextField, 
    Button, 
    Typography, 
    Container,
    Box,
    Link,
    CircularProgress,
    useTheme
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';





export default function SignIn() {
    let [isLoading, setLoading] = useState(false);
    let [loginFormData, setLoginFormData] = useState({
        email: '',
        password: ''
    })

    const handleChangeInputs = (event) => {
        const {name, value} = event.target;
        setLoginFormData(prevData => ({
            ...prevData,
            [name] : value
        }))
    }

    const handleLogInSubmit = (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            console.log("Submitted Form: ", loginFormData);
        } catch(error) {
            console.error("Unable to LogIn: ", error);
        } finally {
            setLoading(false);
        }
    }

    const theme = useTheme();

    return (
        <Container
        disableGutters
        maxWidth={false}
        sx={{
            bgcolor: 'white',
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
        }}
        >
        <Box sx={{ width: '100%', height: '100%', display: 'flex' }}>
            <Box
            sx={{
                width: '50%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                [theme.breakpoints.down('md')]: {
                width: '100%',
                height: 'auto',
                },
            }}
            >
            <img
                src='/src/assets/drexel.jpg'
                alt='Drexel Bridge'
                style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                }}
            />
            </Box>

            <Box
            sx={{
                width: '50%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                flexDirection: 'column',
                [theme.breakpoints.down('md')]: {
                width: '100%',
                padding: theme.spacing(2),
                height: 'auto',
                },
            }}
            >
            <div
                className='dragon-mascot'
                style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40%',
                flexDirection: 'column',
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
                src='/src/assets/book.jpg'
                alt="Dragon Book"
                sx={{ width: 290, height: 110, mb: 2 }}
                />
            </div>

            <div className='titles'>
                <Typography component="h1" variant="h4" color="primary" sx={{ mb: 1 }}>
                Login to your Dragon Account!
                </Typography>
            </div>

            <Box
                component="form"
                sx={{ width: '70%', padding: 2 }}
                onSubmit={handleLogInSubmit}
            >
                <TextField
                fullWidth
                required
                variant="outlined"
                name='email'
                type="email"
                label="Dragon Email"
                value={loginFormData.email}
                onChange={handleChangeInputs}
                sx={{ marginBottom: 2, borderColor: 'black' }}
                />
                <TextField
                fullWidth
                required
                variant="outlined"
                name='password'
                type='password'
                label="Password"
                value={loginFormData.password}
                onChange={handleChangeInputs}
                sx={{ marginBottom: 2, borderColor: 'black' }}
                />

                <Box sx={{ marginBottom: 2 }}>
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
                sx={{ py: 1.5, marginTop: 2 }}
                >
                {isLoading ? <CircularProgress /> : 'LogIn'}
                </Button>
            </Box>
            <Box>
                <Typography>
                    Need Dragon Account?
                    <Link component={RouterLink} to='/register' color='primary'>
                        SIGN UP
                    </Link>
                </Typography>
            </Box>
            </Box>
        </Box>
        </Container>
    );
}