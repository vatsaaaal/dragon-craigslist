import React from  'react';
import { 
    TextField, 
    Button, 
    Typography, 
    Container,
    Checkbox,
    FormControlLabel,
    Box,
    Link
} from '@mui/material';



function Registration() {
    let [registerFormData, setRegisterFormData] = React.useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        verifyPassword: ''
    })



    const handleRegistrationSubmit = (event) => {
        event.preventDefault();
        console.log("Submitted Form: ", registerFormData);
    }

    const handleChangeInputs = (event) => {
        const {name, value} = event.target;
        setRegisterFormData(prevData => ({
            ...prevData,
            [name] : value
        }))
    }


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
                border: '1px solid black',
                overflow: 'hidden' // Hide vertical and horizontal scrollbars
            }}>
                <Box sx={{
                    width: '50%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',

                }}>
                    <img src='/src/assets/drexel.jpg' alt='Drexel Bridge'
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />

                </Box>
                <Box sx={{
                    width: '50%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'white'
                }}>
                    <div className='dragon-mascot' 
                        style={{
                            flexDirection: 'column', 
                            display: 'flex', 
                            alignItems: 'center',
                            border: '1px solid black',
                            width: '40%'
                            }}>
                        <Box
                            component="img"
                            src="/src/assets/dragonMascot.png"
                            alt="Dragon Logo"
                            sx={{ width: 100, height: 100 }}
                        />
                        <Box
                            component="img"
                            src='/src/assets/book.jpg'
                            alt="Dragon Logo"
                            sx={{ width: 100, height: 100 }}
                        />

                    
                    </div>

                    <div className='titles'>
                        <Typography component="h1" variant="h4" color="primary" sx={{ mb: 1 }}>
                                Become Our New Dragon Today!
                        </Typography>
                    </div>

                    <Box component='form' sx={{ width: '100%', border: '1px solid black' }} onSubmit={handleRegistrationSubmit}>
                        {/*First and Last Name*/}
                        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                            <TextField required  variant="outlined" 
                                name="firstName" 
                                label="First Name"  
                                value={registerFormData.firstName}
                                onChange={handleChangeInputs}
                            />
                            <TextField required  variant="outlined" 
                                name="lastName" 
                                label="Last Name" 
                                value={registerFormData.lastName}
                                onChange={handleChangeInputs}
                            />
                        </Box>

                        <TextField fullWidth required variant="outlined" 
                            name='email' 
                            type="email" 
                            label="Dragon Email"
                            value={registerFormData.email}
                            onChange={handleChangeInputs}
                        />
                        <TextField fullWidth variant="outlined" 
                            name='phoneNumber' 
                            label="Phone Number (Optinal)" 
                            value={registerFormData.phoneNumber}
                            onChange={handleChangeInputs}
                        />
                        <TextField 
                            fullWidth type="password" required variant='outlined' 
                            name='password' 
                            label="Set Password" 
                            value={registerFormData.password}
                            onChange={handleChangeInputs}
                        />
                        <TextField 
                            fullWidth 
                            type="password" 
                            required 
                            variant='outlined' 
                            name='verifyPassword' 
                            label="Verify Password" 
                            value={registerFormData.verifyPassword}
                            onChange={handleChangeInputs}
                        />


                        <Box>
                            <Link href="/" variant="body2" color="primary">
                                Forgot Password?
                            </Link>
                        </Box>

                        <Button type='submit' fullWidth color="primary">
                            Register
                        </Button>
                    </Box>
                </Box>
        </Container>
    );
}

export default Registration;