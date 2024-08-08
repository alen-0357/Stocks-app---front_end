import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  ButtonGroup,
} from '@mui/material';
import { ThumbUp, Comment, Delete } from '@mui/icons-material';
import { useUser } from '../UserContext';

const Fetchposts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState({});
  const [filter, setFilter] = useState('all');

  const { userId } = useUser();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/posts');
        const sortedPosts = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setPosts(sortedPosts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const fetchUserInfo = async (userId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/user/${userId}`);
      const email = response.data.email;
      const username = email.split('@')[0];
      return username;
    } catch (error) {
      console.error('Error fetching user information:', error);
      return '';
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const usersData = {};
      await Promise.all(posts.map(async (post) => {
        usersData[post.user_id] = await fetchUserInfo(post.user_id);
      }));
      setUsers(usersData);
    };

    if (posts.length > 0) {
      fetchUsers();
    }
  }, [posts]);

  // const handleLike = async (postId) => {
  //   const postIndex = posts.findIndex(post => post.id === postId);
  //   const updatedPosts = [...posts];
  //   updatedPosts[postIndex].likes = (updatedPosts[postIndex].likes || 0) + 1;
  //   setPosts(updatedPosts);

  //   try {
  //     const response = await axios.post(`http://127.0.0.1:5000/like_post/${postId}`);
  //     if (!response.data.success) {
  //       // Revert the optimistic update if the request fails
  //       updatedPosts[postIndex].likes -= 1;
  //       setPosts(updatedPosts);
  //     }
  //   } catch (error) {
  //     console.error('Error liking post:', error);
  //     // Revert the optimistic update if the request fails
  //     updatedPosts[postIndex].likes -= 1;
  //     setPosts(updatedPosts);
  //   }
  // };

  // const handleComment = async (postId, comment) => {
  //   const postIndex = posts.findIndex(post => post.id === postId);
  //   const updatedPosts = [...posts];
  //   const newComments = [...(updatedPosts[postIndex].comments || []), comment];
  //   updatedPosts[postIndex].comments = newComments;
  //   setPosts(updatedPosts);

  //   try {
  //     const response = await axios.post(`http://127.0.0.1:5000/comment_post/${postId}`, { comment });
  //     if (!response.data.success) {
  //       // Revert the optimistic update if the request fails
  //       updatedPosts[postIndex].comments = updatedPosts[postIndex].comments.filter(c => c !== comment);
  //       setPosts(updatedPosts);
  //     }
  //   } catch (error) {
  //     console.error('Error commenting on post:', error);
  //     // Revert the optimistic update if the request fails
  //     updatedPosts[postIndex].comments = updatedPosts[postIndex].comments.filter(c => c !== comment);
  //     setPosts(updatedPosts);
  //   }
  // };





  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) {
      return; // User cancelled the deletion
    }

    try {
      const response = await axios.delete(`http://127.0.0.1:5000/delete_post/${postId}`, {
        headers: {
          Authorization: userId,
        },
      });
      if (response.data.success) {
        setPosts(posts.filter(post => post.id !== postId));
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const filteredPosts = filter === 'my' ? posts.filter(post => post.user_id === userId) : posts;

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Posts
      </Typography>
      <ButtonGroup variant="contained" aria-label="outlined primary button group" style={{ marginBottom: '16px' }}>
        <Button
          onClick={() => setFilter('all')}
          variant={filter === 'all' ? 'contained' : 'outlined'}
        >
          All Posts
        </Button>
        <Button
          onClick={() => setFilter('my')}
          variant={filter === 'my' ? 'contained' : 'outlined'}
        >
          My Posts
        </Button>
      </ButtonGroup>

      {loading ? (
        <CircularProgress />
      ) : (
        <div>
          {filteredPosts.length === 0 ? (
            <Typography variant="body1">No posts available</Typography>
          ) : (
            <div>
              {filteredPosts.map((post) => {
                // console.log('Post ID:', post.id); 
                return (
                  <Card key={post.id} style={{ marginBottom: '16px' }}>
                    <CardHeader
                      title={users[post.user_id]}
                      subheader={new Date(post.timestamp).toLocaleString([], {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                      action={
                        filter === 'my' && userId === post.user_id && (
                          <IconButton onClick={() => handleDelete(post.id)}>
                            <Delete />
                          </IconButton>
                        )
                      }
                    />
                    <CardContent>
                      <Typography variant="body1">{post.content}</Typography>
                      {post.image_url && (
                        <img src={post.image_url} alt="Post Image" style={{ width: '100%', marginTop: '16px' }} />
                      )}
                      {/* <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                        <IconButton onClick={() => handleLike(post.id)}>
                          <ThumbUp color="primary" />
                        </IconButton>
                        <Typography variant="body2" style={{ marginRight: '16px' }}>{post.likes || 0}</Typography>
                        <IconButton>
                          <Comment />
                        </IconButton>
                        <Typography variant="body2">{post.comments ? post.comments.length : 0}</Typography>
                      </div> */}
                      {/* <div style={{ marginTop: '16px' }}>
                        {post.comments && post.comments.map((comment, index) => (
                          <Typography key={index} variant="body2" style={{ marginLeft: '16px' }}>- {comment}</Typography>
                        ))}
                        <TextField
                          variant="outlined"
                          margin="normal"
                          fullWidth
                          placeholder="Add a comment"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton>
                                  <Comment />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.target.value.trim()) {
                              handleComment(post.id, e.target.value);
                              e.target.value = '';
                            }
                          }}
                        />
                      </div> */}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Fetchposts;
