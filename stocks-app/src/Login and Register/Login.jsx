import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
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
  TextField,
  CssBaseline
} from '@mui/material';

// import { LockOutlined as LockOutlinedIcon, PersonOutline as PersonOutlineIcon } from '@mui/icons-material';
import {  Email as EmailIcon, LockOutlined as LockOutlinedIcon, Visibility, VisibilityOff } from '@mui/icons-material';

import firebase from 'firebase/compat/app'; // Update this line
import 'firebase/compat/auth'; // Update this line
import { useUser } from '../UserContext';
const firebaseConfig = {
  apiKey: "AIzaSyCk-Dh0YHSbvK5Fa1S5vKuqw530ZlXKSqY",
  authDomain: "stocks-9bc4d.firebaseapp.com",
  databaseURL: "https://stocks-9bc4d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "stocks-9bc4d",
  storageBucket: "stocks-9bc4d.appspot.com",
  messagingSenderId: "69823950496",
  appId: "1:69823950496:web:9e2810b87c3bc3c4c2e3c5",
  measurementId: "G-G6W0HZMQBJ"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const { setUser } = useUser();
  const [loggedInUserId, setLoggedInUserId] = useState('');
  const handleLogin = async () => {
    try {
      if (!email || !password) {
        setError('Please provide all credentials for Login.');
        return;
      }
      await firebase.auth().signInWithEmailAndPassword(email, password);
      setUser(loggedInUserId);
      navigate('/Home');
    } 
    catch (error) {
      // alert("Please enter Valid Credentials");
      setError('Invalid Credentials');
      // console.error('Error signing in:', error.message);
      // Handle login error here
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <br/><br/><br/><br/><br/><br/><br/><br/><br/>
      <CssBaseline />
      <Card>
        <CardContent>
          <Typography variant="h5">Login</Typography>
          <br/>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <br/>
              </Grid>
              {/* <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                
              </Grid> */}
              <Grid item xs={12}>
              <br/>
                <FormControl fullWidth>
                  <InputLabel>password</InputLabel>
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
            </Grid>
            <br/>
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleLogin}
            >
              Login
            </Button>
          </form>
          <br/>
          {error && <Typography color="error" variant="subtitle2">{error}</Typography>}
          <Grid container justifyContent="flex-end">
            <Grid item>
              {/* <Link to="/forgot-password">Forgot password?</Link> */}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <br/>
      <Grid container justifyContent="center">
        <Grid item>
          <Typography variant="body2">
            Don't have an account? <Link to="/Register">Sign Up</Link>
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;
