import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaTrash, FaUserPlus } from 'react-icons/fa';
import api from '../utils/apiClient';
import connectionService from '../services/connectionService';
import { useAuth } from '../context/AuthContext';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const CoverImage = styled.img`
  width: 100%;
  height: 360px;
  object-fit: cover;
`;

const ProfileContent = styled.div`
  padding: 24px;
`;

const ProfileName = styled.h2`
  margin: 0 0 16px;
  font-size: 24px;
  color: ${props => props.theme.colors.text};
`;

const ProfileInfo = styled.p`
  margin: 8px 0;
  color: ${props => props.theme.colors.gray};
  font-size: 16px;
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;

  ${props => props.primary && `
    background: ${props.theme.colors.primary};
    color: white;

    &:hover {
      background: ${props.theme.colors.primaryDark};
    }
  `}

  ${props => props.danger && `
    background: ${props.theme.colors.error};
    color: white;

    &:hover {
      background: #d32f2f;
    }
  `}
`;

export default function ProfileDetail() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    try {
      const res = await api.get(`/profiles/${id}`);
      setProfile(res.data.data);
    } catch (err) {
      // Handle error
    }
  };

  const sendRequest = async () => {
    setLoading(true);
    try {
      await connectionService.sendRequest(id);
      alert('Connection request sent successfully!');
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      try {
        await api.delete(`/profiles/${id}`);
        // Also logout the user since their profile is deleted
        auth.logout();
        navigate('/');
      } catch (err) {
        alert(err?.response?.data?.message || 'Failed to delete profile');
      }
    }
  };

  if (!profile) return <div>Loading...</div>;
  
  const isOwnProfile = auth?.user?._id === profile.userId?._id;

  return (
    <ProfileContainer>
      <ProfileCard>
        <CoverImage 
          src={profile.avatarUrl || 'https://picsum.photos/seed/' + profile._id + '/400'} 
          alt="Profile Cover"
        />
        <ProfileContent>
          <ProfileName>{profile.userId?.name}</ProfileName>
          <ProfileInfo>{profile.bio}</ProfileInfo>
          <ProfileInfo>
            {profile.age} • {profile.location?.city}, {profile.location?.country}
          </ProfileInfo>
          
          <ButtonGroup>
            {!isOwnProfile && auth?.accessToken && (
              <Button primary onClick={sendRequest} disabled={loading}>
                <FaUserPlus />
                {loading ? 'Sending...' : 'Send Connection Request'}
              </Button>
            )}
            
            {isOwnProfile && (
              <Button danger onClick={handleDeleteProfile}>
                <FaTrash />
                Delete Profile
              </Button>
            )}
          </ButtonGroup>
        </ProfileContent>
      </ProfileCard>
    </ProfileContainer>
  );
}
