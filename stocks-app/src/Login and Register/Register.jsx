import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  Grid,
  InputAdornment,
  IconButton,
  Input,
  InputLabel,
  Typography,
} from '@mui/material';
import { Email as EmailIcon, LockOutlined as LockOutlinedIcon, Visibility, VisibilityOff } from '@mui/icons-material';

import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '../firebase.config'; // Import auth and createUserWithEmailAndPassword

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  
  const handleRegister = async () => {
    try {
        if (!email || !password || !repeatPassword) {
          setError('Please provide all credentials for registering.');
          return;
        }
    
      if (password !== repeatPassword) {
        setError('Passwords do not match. Make sure you typed password correctly.');
        return;
      }
      
      if (!/@gmail.com/.test(email)) {
        setError('Make sure you give the right G-mail id');
        return;
      }


      // Add your custom password validations
      if (!/^[A-Z]/.test(password)) {
        setError('Password should start with a capital letter');
        return;
      }

      if (!/\d/.test(password)) {
        setError('Password should contain numerical characters');
        return;
      }

      if (password.length <= 5) {
        setError('Password should have more than 5 characters');
        return;
      }

      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        setError('Password should contain at least one special character');
        return;
      }

      // Add a check for an existing password (replace with your logic)
      const isPasswordTaken = await checkIfPasswordIsTaken(password);
      if (isPasswordTaken) {
        setError('Password is already taken');
        return;
      }

      // Continue with registration if all validations pass
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Registered Successfully!");
      navigate('/', { replace: true });
    } catch (error) {
      setError('Invalid Credentials');
    }
  };

  const checkIfPasswordIsTaken = async (password) => {
    // Replace this with your logic to check if the password is already taken
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true; // Password is taken
    } catch (error) {
      return false; // Password is not taken
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="xs">
        <br/><br/><br/><br/><br/><br/><br/>
      <Card>
        <CardContent>
          <Typography variant="h5">Register</Typography>
          <br/>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>G-mail</InputLabel>
                  <Input
                    fullWidth
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
              <br/>
                <FormControl fullWidth>
                  <InputLabel>Password</InputLabel>
                  <Input
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                    startAdornment={
                      <InputAdornment position="start">
                        <LockOutlinedIcon />
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
              <br/>
                <FormControl fullWidth>
                  <InputLabel>Repeat password</InputLabel>
                  <Input
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                    startAdornment={
                      <InputAdornment position="start">
                        <LockOutlinedIcon />
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Grid>
            </Grid>
            {error && <Typography color="error" variant="subtitle2">{error}</Typography>}
            <br/>
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="success"
              onClick={handleRegister}
            >
              Create Account
            </Button>
          </form>
          <Grid container justifyContent="flex-end">
            
            <Grid item>
            <br/>
              <Link to="/">Already have an account? Login</Link>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Register;
