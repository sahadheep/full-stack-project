import React, { useEffect, useState } from 'react';
import api from '../utils/apiClient';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import connectionService from '../services/connectionService';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ProfileInfo = styled.div`
  padding: 16px;
`;

const Name = styled.h3`
  margin: 0 0 8px 0;
  color: ${props => props.theme.colors.text};
`;

const Details = styled.p`
  margin: 0 0 16px 0;
  color: ${props => props.theme.colors.gray};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  padding: 0 16px 16px;
`;

const ViewButton = styled(Link)`
  flex: 1;
  padding: 8px 16px;
  text-align: center;
  text-decoration: none;
  color: ${props => props.theme.colors.primary};
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
  }
`;

const ConnectButton = styled.button`
  flex: 1;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: ${props => props.theme.colors.primary};
  color: white;
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

export default function ProfileList() {
  const [profiles, setProfiles] = useState([]);
  const [pendingConnections, setPendingConnections] = useState(new Set());
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    // Load profiles
    api.get('/profiles')
      .then(res => {
        if (mounted) setProfiles(res.data.data.profiles || []);
      })
      .catch((err) => {
        if (mounted) setError(err?.message || 'Failed to load profiles');
      });

    // Load existing connection requests
    api.get('/connections?status=pending')
      .then(res => {
        if (mounted) {
          const pending = new Set();
          (res.data.data || []).forEach(conn => {
            // store recipient id if current user sent request, else store requester id
            const otherId = conn.recipient?._id || conn.recipient;
            pending.add(otherId);
          });
          setPendingConnections(pending);
        }
      })
      .catch(() => {});

    return () => { mounted = false; };
  }, []);

  const [connecting, setConnecting] = useState(null);

  const [toast, setToast] = useState(null);

  // Show toast message
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleConnect = async (recipientId) => {
    if (!recipientId) {
      showToast('Invalid user profile', 'error');
      return;
    }

    try {
      setConnecting(recipientId);
      setError(null);
      const response = await connectionService.sendRequest(recipientId);
      
      if (response.status === 'success') {
        setPendingConnections(prev => new Set([...prev, recipientId]));
        showToast('Connection request sent successfully!');
      } else {
        throw new Error(response.message || 'Failed to send request');
      }
    } catch (err) {
      console.error('Connection request error:', err);
      showToast(err.message || 'Failed to send connection request', 'error');
      // Remove from pending if request failed
      setPendingConnections(prev => {
        const newSet = new Set(prev);
        newSet.delete(recipientId);
        return newSet;
      });
    } finally {
      setConnecting(null);
    }
  };

  if (error) {
    return <div style={{ color: 'red', padding: '20px' }}>{error}</div>;
  }

  return (
    <div>
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: toast.type === 'error' ? '#f44336' : '#4caf50',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '4px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            zIndex: 1000,
            animation: 'slideIn 0.3s ease-out'
          }}
        >
          {toast.message}
        </div>
      )}
      <style>
        {`
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}
      </style>
      <h2 style={{ padding: '20px 20px 0' }}>Discover Profiles</h2>
      <Grid>
        {profiles.map(p => (
          <ProfileCard key={p._id}>
            <ProfileImage
              src={p.avatarUrl || `https://picsum.photos/seed/${p._id}/200`}
              alt={p.userId?.name}
            />
            <ProfileInfo>
              <Name>{p.userId?.name || 'No Name'}</Name>
              <Details>
                {p.age && `${p.age} years`}
                {p.age && p.location?.city && ' • '}
                {p.location?.city}
              </Details>
            </ProfileInfo>
            <ButtonGroup>
              <ViewButton to={`/profiles/${p.userId?._id}`}>View Profile</ViewButton>
              <ConnectButton
                onClick={() => handleConnect(p.userId?._id)}
                disabled={connecting === p.userId?._id || pendingConnections.has(p.userId?._id)}
              >
                {connecting === p.userId?._id ? 'Sending...' : 
                 pendingConnections.has(p.userId?._id) ? 'Requested' : 'Connect'}
              </ConnectButton>
            </ButtonGroup>
          </ProfileCard>
        ))}
      </Grid>
    </div>
  );
}
