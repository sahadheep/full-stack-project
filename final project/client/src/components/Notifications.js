import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaBell, FaEnvelope, FaEnvelopeOpen } from 'react-icons/fa';
import api from '../utils/apiClient';
import storage from '../utils/storageService';
import { notificationSound } from '../assets/notification-sound';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const NotificationContainer = styled.div`
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 1000;
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
`;

const NotificationBell = styled.div`
  position: relative;
  cursor: pointer;
  padding: 10px;
  transition: transform 0.3s ease;
  background: ${props => props.isOpen ? props.theme.colors.background : 'transparent'};
  border-radius: 50%;

  &:hover {
    transform: scale(1.1);
    background: ${props => props.theme.colors.background};
  }
  
  .count {
    position: absolute;
    top: -5px;
    right: -5px;
    background: ${props => props.theme.colors.error};
    color: white;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: ${props => props.hasNew ? pulse : 'none'} 2s infinite;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }

  svg {
    color: ${props => props.hasNew || props.isOpen ? props.theme.colors.primary : props.theme.colors.gray};
    transition: all 0.3s ease;
    font-size: 24px;
  }
`;

const NotificationPanel = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: -10px;
  width: 320px;
  max-height: 400px;
  overflow-y: auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.3s ease;

  &:before {
    content: '';
    position: absolute;
    top: -6px;
    right: 24px;
    width: 12px;
    height: 12px;
    background: white;
    transform: rotate(45deg);
    box-shadow: -2px -2px 5px rgba(0,0,0,0.04);
  }
`;

const NotificationHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NotificationList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  padding: 8px;
`;

const NotificationItem = styled.div`
  padding: 12px;
  border-radius: 8px;
  background: ${props => props.theme.colors.background};
  margin-bottom: 8px;
  animation: ${slideIn} 0.3s ease-out;
  transition: all 0.2s;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    background: ${props => `${props.theme.colors.background}99`};
  }

  .title {
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: ${props => props.theme.colors.text};
  }

  .time {
    font-size: 0.8rem;
    color: ${props => props.theme.colors.gray};
  }

  .actions {
    display: flex;
    gap: 0.8rem;
    margin-top: 0.8rem;
  }
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &.accept {
    background: ${props => props.theme.colors.primary};
    color: white;

    &:hover {
      background: ${props => props.theme.colors.primaryDark};
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  }

  &.reject {
    background: white;
    color: ${props => props.theme.colors.error};
    border: 1px solid ${props => props.theme.colors.border};

    &:hover {
      background: ${props => `${props.theme.colors.error}10`};
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export default function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [count, setCount] = useState(0);
  const [hasNew, setHasNew] = useState(false);
  const audioRef = useRef(new Audio(notificationSound));
  const prevCountRef = useRef(count);

  useEffect(() => {
    // Load initial notifications
    loadNotifications();
    // Poll for new notifications every 15 seconds
    const interval = setInterval(loadNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (count > prevCountRef.current) {
      setHasNew(true);
      audioRef.current.play().catch(err => console.log('Audio play failed:', err));
      
      // Show browser notification if supported
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('New Connection Request', {
          body: 'You have a new connection request!',
          icon: '/favicon.ico'
        });
      }
    }
    prevCountRef.current = count;
  }, [count]);

  const loadNotifications = async () => {
    try {
      const res = await api.get('/connections?status=pending');
      const currentUserId = storage.getTokens()?.user?._id || localStorage.getItem('userId');
      const list = (res.data.data || []).filter(conn => {
        const recipientId = conn?.recipient?._id || conn?.recipient;
        return recipientId && currentUserId && recipientId.toString() === currentUserId.toString();
      });
      setNotifications(list);
      setCount(list.length);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await api.post(`/connections/${id}/${action}`);
      await loadNotifications();
      setIsOpen(count > 1); // Close panel if no more notifications
    } catch (err) {
      console.error(`Failed to ${action} connection:`, err);
    }
  };

  if (count === 0) return null;

  // Request notification permission
  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <NotificationContainer>
      <NotificationBell 
        onClick={() => { setIsOpen(!isOpen); setHasNew(false); }} 
        hasNew={hasNew}
        isOpen={isOpen}
      >
        {isOpen ? (
          <FaEnvelopeOpen />
        ) : (
          <FaEnvelope />
        )}
        {count > 0 && <div className="count">{count}</div>}
      </NotificationBell>

      <NotificationPanel isOpen={isOpen}>
        <NotificationHeader>
          <span>Connection Requests</span>
          <span>{count} {count === 1 ? 'request' : 'requests'}</span>
        </NotificationHeader>
        <NotificationList>
          {notifications.map(notification => (
            <NotificationItem key={notification._id}>
              <div className="title">
                {notification.requester?.name || notification.requester || 'Someone'} wants to connect
              </div>
              <div className="time">
                {new Date(notification.createdAt).toLocaleDateString()} at {new Date(notification.createdAt).toLocaleTimeString()}
              </div>
              <div className="actions">
                <ActionButton
                  className="accept"
                  onClick={() => handleAction(notification._id, 'accept')}
                >
                  Accept
                </ActionButton>
                <ActionButton
                  className="reject"
                  onClick={() => handleAction(notification._id, 'reject')}
                >
                  Decline
                </ActionButton>
              </div>
            </NotificationItem>
          ))}
          {notifications.length === 0 && (
            <div style={{ 
              padding: '20px', 
              textAlign: 'center',
              color: props => props.theme.colors.gray 
            }}>
              No pending requests
            </div>
          )}
        </NotificationList>
      </NotificationPanel>
    </NotificationContainer>
  );
}