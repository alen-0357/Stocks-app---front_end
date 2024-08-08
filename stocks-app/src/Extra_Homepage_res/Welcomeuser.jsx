import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Button,
  Box,
  Modal,
  Grid,
  Avatar,
} from '@mui/material';
import { useUser } from '../UserContext';
import { motion } from 'framer-motion';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import './Fetchuserr.css'; // Import the CSS file
import Adddeposit from '../components/add_deposit';

import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase.config';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Fetchuser = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const { userId } = useUser();
  const [oopen, setOopen] = useState(false);
  const handleOpen = () => setOopen(true);
  const handleClose = () => setOopen(false);
  const [error, setError] = useState(null);
  const [depositedFunds, setDepositedFunds] = useState(0);

  useEffect(() => {
    if (userId) {
      fetchDepositedFunds();
    }
  }, [userId]);

  const fetchDepositedFunds = async () => {
    try {
      const q = query(collection(db, 'deposits'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      let totalFunds = 0;
      querySnapshot.forEach((doc) => {
        totalFunds += parseFloat(doc.data().Fund);
      });
      setDepositedFunds(totalFunds);
    } catch (error) {
      console.error('Error fetching deposited funds:', error);
      setError('Error fetching deposited funds. Please try again later.');
    }
  };

  useEffect(() => {
    const fetchUserInfo = async (userId) => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/user/${userId}`);
        const email = response.data.email;
        const username = email.split('@')[0];
        setUsername(username);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user information:', error);
        setLoading(false);
      }
    };

    fetchUserInfo(userId);
  }, [userId]);

  if (!userId) {
    return <p>Loading...</p>;
  }

  return (
    <Card sx={{ maxWidth: 1300, margin: 'auto', mt: 4, p: 2, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <CardHeader
              title={
                loading ? (
                  <CircularProgress size={24} />
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="animated-text"
                  >
                    <Typography variant="h5" fontWeight="bold" color="primary">
                      Welcome back, {username}!
                    </Typography>
                  </motion.div>
                )
              }
            />
            <Box display="flex" justifyContent="left" mt={2}>
            &nbsp;
            &nbsp;
            &nbsp;
            &nbsp;
            &nbsp;

              <Button
                variant="contained"
                color="success"
                endIcon={<AddCircleIcon />}
                onClick={handleOpen}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#4caf50',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  borderRadius: '78px',
                }}
              >
                Deposit Fund
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card variant="outlined" style={{ minWidth: 275, padding: '16px', borderRadius: '16px', backgroundColor: '#f5f5f5' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: '#4caf50', marginRight: '8px' }}>
                    <AccountBalanceWalletIcon />
                  </Avatar>
                  <Typography variant="h5" component="div">
                    Total Deposited Funds
                  </Typography>
                </Box>
                {loading && <CircularProgress />}
                {error && <Typography color="error">{error}</Typography>}
                {!loading && !error && (
                  <Typography variant="h4" component="div" fontWeight="bold" color="secondary">
                    {depositedFunds} INR
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </CardContent>
      <Modal
        open={oopen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Adddeposit closeEvent={handleClose} />
        </Box>
      </Modal>
    </Card>
  );
};

export default Fetchuser;
