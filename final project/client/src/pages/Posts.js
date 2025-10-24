import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaHeart, FaRegHeart, FaComment, FaPaperclip, FaTrash, FaEllipsisV } from 'react-icons/fa';
import api from '../utils/apiClient';
import storage from '../utils/storageService';

const PostsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const CreatePost = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const PostForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const PostInput = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border: 1px solid ${props => props.theme.colors.lightGray};
  border-radius: 6px;
  resize: vertical;
  font-size: 16px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const PostTypeSelect = styled.select`
  padding: 10px;
  border: 1px solid ${props => props.theme.colors.lightGray};
  border-radius: 6px;
  font-size: 16px;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const TitleInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid ${props => props.theme.colors.lightGray};
  border-radius: 6px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const FileInput = styled.input`
  padding: 10px;
  border: 1px solid ${props => props.theme.colors.lightGray};
  border-radius: 6px;
  font-size: 14px;
  
  &::file-selector-button {
    padding: 8px 16px;
    margin-right: 16px;
    border: none;
    border-radius: 4px;
    background: ${props => props.theme.colors.primary};
    color: white;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: ${props => props.theme.colors.primaryDark};
    }
  }
`;

const PostCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  object-fit: cover;
`;

const PostInfo = styled.div`
  flex: 1;

  h3 {
    margin: 0;
    font-size: 16px;
    color: ${props => props.theme.colors.text};
  }

  span {
    font-size: 14px;
    color: ${props => props.theme.colors.gray};
  }
`;

const PostType = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  background: ${props => {
    switch (props.type) {
      case 'doubt': return '#FFE0E0';
      case 'announcement': return '#E0F7FF';
      case 'update': return '#E0FFE0';
      default: return '#F0F0F0';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'doubt': return '#D32F2F';
      case 'announcement': return '#0288D1';
      case 'update': return '#388E3C';
      default: return '#666666';
    }
  }};
`;

const PostContent = styled.div`
  margin-bottom: 15px;
  font-size: 16px;
  line-height: 1.5;
  white-space: pre-wrap;
`;

const PostActions = styled.div`
  display: flex;
  gap: 20px;
  padding-top: 15px;
  border-top: 1px solid ${props => props.theme.colors.lightGray};
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  color: ${props => props.theme.colors.gray};
  cursor: pointer;
  padding: 5px;
  font-size: 14px;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }

  svg {
    font-size: 16px;
  }
`;

const CommentSection = styled.div`
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid ${props => props.theme.colors.lightGray};
`;

const Comment = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;

  img {
    width: 32px;
    height: 32px;
    border-radius: 16px;
  }
`;

const CommentContent = styled.div`
  flex: 1;
  background: ${props => props.theme.colors.background};
  padding: 10px;
  border-radius: 8px;

  .name {
    font-weight: 500;
    margin-bottom: 4px;
  }

  .text {
    font-size: 14px;
  }
`;

const CommentForm = styled.form`
  display: flex;
  gap: 10px;
  margin-top: 15px;

  input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid ${props => props.theme.colors.lightGray};
    border-radius: 20px;
    font-size: 14px;

    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
    }
  }

  button {
    padding: 8px 16px;
    background: ${props => props.theme.colors.primary};
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;

    &:hover {
      background: ${props => props.theme.colors.primaryDark};
    }
  }
`;

const Button = styled.button`
  padding: 12px 20px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
  }

  &:disabled {
    background: ${props => props.theme.colors.lightGray};
    cursor: not-allowed;
  }
`;

const DeleteButton = styled(ActionButton)`
  color: ${props => props.theme.colors.error};
  margin-left: auto;
  
  &:hover {
    color: ${props => props.theme.colors.error};
    opacity: 0.8;
  }
`;

const PostMenu = styled.div`
  position: relative;
  margin-left: auto;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  padding: 5px;
  cursor: pointer;
  color: ${props => props.theme.colors.gray};
  
  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

const MenuDropdown = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 10;
  min-width: 120px;
  
  button {
    width: 100%;
    padding: 8px 16px;
    text-align: left;
    border: none;
    background: none;
    cursor: pointer;
    
    &:hover {
      background: ${props => props.theme.colors.background};
    }
    
    &.delete {
      color: ${props => props.theme.colors.error};
    }
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  padding: 12px;
  margin: 10px 0;
  background: #fff2f2;
  border-radius: 6px;
`;

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ 
    title: '', 
    content: '', 
    type: 'update',
    attachments: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [menuOpen, setMenuOpen] = useState(null);
  const currentUser = storage.getTokens()?.user;

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const res = await api.get('/posts');
      setPosts(res.data.data || []);
    } catch (err) {
      setError('Failed to load posts');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', newPost.title);
      formData.append('content', newPost.content);
      formData.append('type', newPost.type);
      
      if (newPost.attachments.length) {
        newPost.attachments.forEach(file => {
          formData.append('attachments', file);
        });
      }

      await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setNewPost({ 
        title: '', 
        content: '', 
        type: 'update',
        attachments: []
      });
      
      await loadPosts();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await api.post(`/posts/${postId}/like`);
      await loadPosts();
    } catch (err) {
      setError('Failed to like post');
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/posts/${postId}`);
        await loadPosts();
        setMenuOpen(null);
      } catch (err) {
        setError('Failed to delete post');
      }
    }
  };

  const handleComment = async (postId, content) => {
    try {
      await api.post(`/posts/${postId}/comments`, { content });
      await loadPosts();
    } catch (err) {
      setError('Failed to add comment');
    }
  };

  return (
    <PostsContainer>
      <CreatePost>
        <h2 style={{ marginBottom: '20px' }}>Create a New Post</h2>
        <PostForm onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Post Type</Label>
            <PostTypeSelect
              value={newPost.type}
              onChange={(e) => setNewPost(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="update">Update</option>
              <option value="doubt">Doubt</option>
              <option value="announcement">Announcement</option>
            </PostTypeSelect>
          </FormGroup>

          <FormGroup>
            <Label>Title</Label>
            <TitleInput
              placeholder="Enter a title for your post"
              value={newPost.title}
              onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Content</Label>
            <PostInput
              placeholder="What's on your mind?"
              value={newPost.content}
              onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Attachments (optional)</Label>
            <FileInput
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setNewPost(prev => ({
                ...prev,
                attachments: Array.from(e.target.files)
              }))}
            />
          </FormGroup>

          <Button type="submit" disabled={loading}>
            {loading ? 'Posting...' : 'Create Post'}
          </Button>
        </PostForm>
      </CreatePost>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {posts.map(post => (
        <PostCard key={post._id}>
          <PostHeader>
            <Avatar
              src={post.userId.avatarUrl || `https://picsum.photos/seed/${post.userId._id}/40`}
              alt={post.userId.name}
            />
            <PostInfo>
              <h3>{post.userId.name}</h3>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </PostInfo>
            <PostType type={post.type}>{post.type}</PostType>
            {post.userId._id === currentUser?._id && (
              <PostMenu>
                <MenuButton onClick={() => setMenuOpen(menuOpen === post._id ? null : post._id)}>
                  <FaEllipsisV />
                </MenuButton>
                {menuOpen === post._id && (
                  <MenuDropdown>
                    <button className="delete" onClick={() => handleDelete(post._id)}>
                      <FaTrash style={{ marginRight: '8px' }} /> Delete
                    </button>
                  </MenuDropdown>
                )}
              </PostMenu>
            )}
          </PostHeader>

          <h2>{post.title}</h2>
          <PostContent>{post.content}</PostContent>

          {post.attachments?.length > 0 && (
            <div style={{ marginBottom: 15 }}>
              {post.attachments.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Attachment ${i + 1}`}
                  style={{ maxWidth: '100%', borderRadius: 8, marginBottom: 10 }}
                />
              ))}
            </div>
          )}

          <PostActions>
            <ActionButton onClick={() => handleLike(post._id)}>
              {post.likes.includes(currentUser?._id) ? <FaHeart color="#ff4444" /> : <FaRegHeart />}
              {post.likes.length} Likes
            </ActionButton>
            <ActionButton>
              <FaComment />
              {post.comments.length} Comments
            </ActionButton>
          </PostActions>

          <CommentSection>
            {post.comments.map(comment => (
              <Comment key={comment._id}>
                <img
                  src={comment.userId.avatarUrl || `https://picsum.photos/seed/${comment.userId._id}/32`}
                  alt={comment.userId.name}
                />
                <CommentContent>
                  <div className="name">{comment.userId.name}</div>
                  <div className="text">{comment.content}</div>
                </CommentContent>
              </Comment>
            ))}
            <CommentForm onSubmit={(e) => {
              e.preventDefault();
              const content = e.target.comment.value;
              if (content) {
                handleComment(post._id, content);
                e.target.comment.value = '';
              }
            }}>
              <input name="comment" placeholder="Write a comment..." />
              <button type="submit">Send</button>
            </CommentForm>
          </CommentSection>
        </PostCard>
      ))}
    </PostsContainer>
  );
}