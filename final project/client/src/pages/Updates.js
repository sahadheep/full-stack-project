import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaUser, FaHeart, FaComment } from 'react-icons/fa';
import api from '../utils/apiClient';
import storage from '../utils/storageService';

const UpdatesContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Post = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 20px;
  margin-bottom: 20px;
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: white;
`;

const UserInfo = styled.div`
  flex: 1;
  h4 {
    margin: 0;
    color: ${props => props.theme.colors.text};
  }
  p {
    margin: 4px 0 0;
    font-size: 0.9rem;
    color: ${props => props.theme.colors.gray};
  }
`;

const PostContent = styled.div`
  margin-bottom: 15px;
  h3 {
    margin: 0 0 10px;
    color: ${props => props.theme.colors.text};
  }
  p {
    margin: 0;
    color: ${props => props.theme.colors.textLight};
    line-height: 1.6;
  }
`;

const PostActions = styled.div`
  display: flex;
  gap: 20px;
  padding-top: 15px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: ${props => props.theme.colors.gray};
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s;
  font-size: 0.9rem;

  &:hover {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.primary};
  }

  &.active {
    color: ${props => props.theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    font-size: 1.1rem;
  }
`;

function Updates() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liking, setLiking] = useState(null);
  const currentUser = storage.getTokens()?.user;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/posts', {
          params: { type: 'update' }
        });
        setPosts(response.data.data || []);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err?.response?.data?.message || 'Failed to load updates');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
    // Set up polling to fetch new posts every 30 seconds
    const interval = setInterval(fetchPosts, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLike = async (postId) => {
    if (liking || !currentUser) return;
    
    try {
      setLiking(postId);
      await api.post(`/posts/${postId}/like`);
      const response = await api.get('/posts', {
        params: { type: 'update' }
      });
      setPosts(response.data.data || []);
    } catch (err) {
      setError('Failed to like the post');
    } finally {
      setLiking(null);
    }
  };

  const handleComment = async (postId) => {
    const content = prompt('Enter your comment:');
    if (!content || !currentUser) return;

    try {
      await api.post(`/posts/${postId}/comments`, { content });
      const response = await api.get('/posts', {
        params: { type: 'update' }
      });
      setPosts(response.data.data || []);
    } catch (err) {
      setError('Failed to add comment');
    }
  };

  if (loading) return (
    <UpdatesContainer>
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div className="loading-spinner" style={{
          width: '40px',
          height: '40px',
          margin: '0 auto 1rem',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <h3>Loading updates...</h3>
      </div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </UpdatesContainer>
  );
  
  if (error) return (
    <UpdatesContainer>
      <div style={{ 
        textAlign: 'center', 
        padding: '3rem',
        background: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          color: '#dc3545',
          fontSize: '3rem',
          marginBottom: '1rem'
        }}>⚠️</div>
        <h2 style={{ marginBottom: '1rem', color: '#343a40' }}>Oops! Something went wrong</h2>
        <p style={{ color: '#6c757d', marginBottom: '1.5rem' }}>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            background: props => props.theme.colors.primary,
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'background 0.2s',
          }}
        >
          Try Again
        </button>
      </div>
    </UpdatesContainer>
  );

  return (
    <UpdatesContainer>
      <h2>Recent Updates</h2>
      {posts.filter(post => post.type === 'update').map(post => (
        <Post key={post._id}>
          <PostHeader>
            <Avatar>
              {post.userId?.avatarUrl ? (
                <img 
                  src={post.userId.avatarUrl} 
                  alt={post.userId.name} 
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <FaUser />
              )}
            </Avatar>
            <UserInfo>
              <h4>{post.userId?.name || 'Unknown User'}</h4>
              <p>{new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString()}</p>
            </UserInfo>
          </PostHeader>
          <PostContent>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            {post.attachments?.length > 0 && (
              <div style={{ marginTop: '10px', display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                {post.attachments.map((url, index) => (
                  <img 
                    key={index}
                    src={url}
                    alt={`Attachment ${index + 1}`}
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                ))}
              </div>
            )}
          </PostContent>
          <PostActions>
            <ActionButton 
              onClick={() => handleLike(post._id)}
              disabled={liking === post._id}
              className={post.likes?.includes(currentUser?._id) ? 'active' : ''}
            >
              <FaHeart /> {post.likes?.length || 0} Likes
            </ActionButton>
            <ActionButton onClick={() => handleComment(post._id)}>
              <FaComment /> {post.comments?.length || 0} Comments
            </ActionButton>
          </PostActions>
          {post.comments && post.comments.length > 0 && (
            <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
              {post.comments.map(comment => (
                <div key={comment._id} style={{ marginBottom: '10px', fontSize: '0.9em' }}>
                  <strong>{comment.userId.name}: </strong>
                  {comment.content}
                </div>
              ))}
            </div>
          )}
        </Post>
      ))}
      {posts.length === 0 && !loading && !error && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h3>No updates yet</h3>
          <p>Stay tuned for the latest updates!</p>
        </div>
      )}
    </UpdatesContainer>
  );
}

export default Updates;