import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaCheck, FaTimes, FaClock } from 'react-icons/fa';
import connectionService from '../services/connectionService';
import storage from '../utils/storageService';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h2`
  color: ${props => props.theme.colors.text};
  margin-bottom: 24px;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
`;

const Tab = styled.button`
  padding: 8px 16px;
  border: none;
  background: ${props => props.active ? props.theme.colors.primary : 'white'};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? props.theme.colors.primaryDark : props.theme.colors.background};
  }
`;

const ConnectionCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;

  ${props => {
    switch (props.variant) {
      case 'accept':
        return `
          background: ${props.theme.colors.success}15;
          color: ${props.theme.colors.success};
          &:hover {
            background: ${props.theme.colors.success};
            color: white;
          }
        `;
      case 'reject':
        return `
          background: ${props.theme.colors.error}15;
          color: ${props.theme.colors.error};
          &:hover {
            background: ${props.theme.colors.error};
            color: white;
          }
        `;
      default:
        return '';
    }
  }}
`;

const UserInfo = styled.div`
  flex: 1;
`;

const Name = styled.div`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const StatusBadge = styled.div`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  
  ${props => {
    switch (props.status) {
      case 'accepted':
        return `
          background: ${props.theme.colors.success}15;
          color: ${props.theme.colors.success};
        `;
      case 'rejected':
        return `
          background: ${props.theme.colors.error}15;
          color: ${props.theme.colors.error};
        `;
      default:
        return `
          background: ${props.theme.colors.warning}15;
          color: ${props.theme.colors.warning};
        `;
    }
  }}
`;

const NoConnections = styled.div`
  text-align: center;
  padding: 40px;
  color: ${props => props.theme.colors.gray};
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Loading = styled.div`
  text-align: center;
  padding: 40px;
  color: ${props => props.theme.colors.gray};
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  background: ${props => props.theme.colors.error}15;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 20px;
`;

export default function Connections() {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const currentUser = storage.getTokens()?.user;

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await connectionService.listConnections();
      setConnections(res.data?.data || []);
    } catch (err) {
      setError('Failed to load connections');
      setConnections([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (connectionId) => {
    try {
      setActionLoading(true);
      await connectionService.acceptRequest(connectionId);
      await loadConnections();
    } catch (err) {
      setError('Failed to accept connection request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (connectionId) => {
    try {
      setActionLoading(true);
      await connectionService.rejectRequest(connectionId);
      await loadConnections();
    } catch (err) {
      setError('Failed to reject connection request');
    } finally {
      setActionLoading(false);
    }
  };

  const pendingRequests = connections.filter(
    conn => conn.status === 'pending' && conn.recipient?._id === currentUser?._id
  );

  const sentRequests = connections.filter(
    conn => conn.status === 'pending' && conn.requester?._id === currentUser?._id
  );

  const acceptedConnections = connections.filter(
    conn => conn.status === 'accepted'
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <FaCheck />;
      case 'rejected':
        return <FaTimes />;
      default:
        return <FaClock />;
    }
  };

  if (loading) {
    return (
      <Container>
        <Title>My Connections</Title>
        <Loading>Loading connections...</Loading>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Title>My Connections</Title>
        <ErrorMessage>{error}</ErrorMessage>
        <NoConnections>
          Unable to load connections. Please try again later.
        </NoConnections>
      </Container>
    );
  }

  if (!connections.length) {
    return (
      <Container>
        <Title>My Connections</Title>
        <NoConnections>
          No connections yet. Browse profiles to connect with other users!
        </NoConnections>
      </Container>
    );
  }

  const renderConnections = () => {
    let connectionsToShow = [];
    switch (activeTab) {
      case 'pending':
        connectionsToShow = pendingRequests;
        break;
      case 'sent':
        connectionsToShow = sentRequests;
        break;
      case 'accepted':
        connectionsToShow = acceptedConnections;
        break;
      default:
        connectionsToShow = connections;
    }

    if (!connectionsToShow.length) {
      return (
        <NoConnections>
          {activeTab === 'pending' && 'No pending connection requests'}
          {activeTab === 'sent' && 'No connection requests sent'}
          {activeTab === 'accepted' && 'No accepted connections yet'}
        </NoConnections>
      );
    }

    return connectionsToShow.map(connection => {
      const isRequester = connection.requester?._id === currentUser?._id;
      const otherUser = isRequester ? connection.recipient : connection.requester;
      
      return (
        <ConnectionCard key={connection._id}>
          <UserInfo>
            <Name>{otherUser?.name || 'Unknown User'}</Name>
            <div style={{ fontSize: '14px', color: '#666' }}>
              {connection.status === 'accepted' ? (
                'Connected'
              ) : isRequester ? (
                'Connection request sent'
              ) : (
                'Wants to connect with you'
              )}
            </div>
          </UserInfo>
          {connection.status === 'pending' && !isRequester ? (
            <ActionButtons>
              <ActionButton
                variant="accept"
                onClick={() => handleAccept(connection._id)}
                disabled={actionLoading}
              >
                <FaCheck /> Accept
              </ActionButton>
              <ActionButton
                variant="reject"
                onClick={() => handleReject(connection._id)}
                disabled={actionLoading}
              >
                <FaTimes /> Reject
              </ActionButton>
            </ActionButtons>
          ) : (
            <StatusBadge status={connection.status}>
              {getStatusIcon(connection.status)}
              {connection.status.charAt(0).toUpperCase() + connection.status.slice(1)}
            </StatusBadge>
          )}
        </ConnectionCard>
      );
    });
  };

  return (
    <Container>
      <Title>My Connections</Title>
      
      <TabContainer>
        <Tab
          active={activeTab === 'pending'}
          onClick={() => setActiveTab('pending')}
        >
          Pending Requests {pendingRequests.length > 0 && `(${pendingRequests.length})`}
        </Tab>
        <Tab
          active={activeTab === 'sent'}
          onClick={() => setActiveTab('sent')}
        >
          Sent Requests {sentRequests.length > 0 && `(${sentRequests.length})`}
        </Tab>
        <Tab
          active={activeTab === 'accepted'}
          onClick={() => setActiveTab('accepted')}
        >
          Connected {acceptedConnections.length > 0 && `(${acceptedConnections.length})`}
        </Tab>
      </TabContainer>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {loading ? (
        <Loading>Loading connections...</Loading>
      ) : (
        renderConnections()
      )}
    </Container>
  );
}
