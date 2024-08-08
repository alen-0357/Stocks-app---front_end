import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useUser } from '../UserContext';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Box,
  Input
} from '@mui/material';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';

const storage = getStorage();


const Homeposting = () => {
    const [open, setOpen] = useState(false);
    const [postContent, setPostContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState(null);
    const [validationError, setValidationError] = useState('');
    const { userId } = useUser();
    const [imageFile, setImageFile] = useState(null);
    const imageInputRef = useRef(null);  // Reference to the file input

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const handleClearImage = () => {
    setImageFile(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';  // Reset the file input value
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadImageToFirebase = async (file) => {
    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const handlePostSubmit = async () => {
    if (postContent.trim().length === 0) {
      setValidationError('Nothing typed');
      return;
    }

    const wordCount = postContent.trim().split(/\s+/).length;
    if (wordCount < 3) {
      setValidationError('A minimum of 3 words is required to post');
      return;
    }

    setLoading(true);
    setLoadingMessage('Posting. Please wait...');
    setValidationError('');
    setError(null);

    try {
      let imageURL = '';
      if (imageFile) {
        imageURL = await uploadImageToFirebase(imageFile);
      }

      const response = await axios.post(
        'http://127.0.0.1:5000/upload_post',
        { content: postContent, image_url: imageURL },
        {
          headers: {
            Authorization: userId,
          },
        }
      );
      console.log('Post uploaded:', response.data);
      setPostContent('');
      setImageFile(null);
      handleClose();
      window.location.reload();
    } catch (error) {
      console.error('Error uploading post:', error);
      setError('Error uploading post. Please try again later.');
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };


  return (
    <div>
        <br/><br/>
        <Card style={{ width: '202%', marginLeft: '5px' }}>
            
        <CardActionArea onClick={handleClickOpen}>
          <CardContent>
            <Typography variant="h5" component="div">
              Create a new post...
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Create a Post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the content of your post below:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Post Content"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={10}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
           <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            inputRef={imageInputRef}  // Assigning the ref to the input
          />
             {imageFile && (
            <Box mt={2}>
              
              <Button variant="outlined" color="secondary" onClick={handleClearImage}>
                Clear Image
              </Button>
            </Box>
          )}
          
          {loading && <CircularProgress />}
          {loadingMessage && <Typography>{loadingMessage}</Typography>}
          {error && <Typography color="error">{error}</Typography>}
          {validationError && <Typography color="error">{validationError}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handlePostSubmit} color="primary" disabled={loading}>
            Post
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Homeposting;
