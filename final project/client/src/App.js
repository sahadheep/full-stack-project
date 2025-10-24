import React, { useState, useRef, useEffect } from 'react';
import Search from './components/Search';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfileForm from './pages/ProfileForm';
import Notifications from './components/Notifications';
import ProfileList from './pages/ProfileList';
import ProfileDetail from './pages/ProfileDetail';
import Connections from './pages/Connections';
import Posts from './pages/Posts';
import Updates from './pages/Updates';
import ProtectedRoute from './components/ProtectedRoute';
import styled from 'styled-components';
import { FaHome, FaUsers, FaUserFriends, FaNewspaper, FaBell, FaUserCircle, FaCog, FaSignOutAlt } from 'react-icons/fa';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
`;

const Nav = styled.nav`
  background: white;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const SearchWrapper = styled.div`
  flex: 1;
  max-width: 600px;
  margin: 0 1rem;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.background};
  }

  &.active {
    color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.background};
  }

  svg {
    font-size: 1.2rem;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AuthButton = styled(Link)`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;

  &.login {
    color: ${props => props.theme.colors.primary};
    border: 1px solid ${props => props.theme.colors.primary};

    &:hover {
      background: ${props => props.theme.colors.background};
    }
  }

  &.register {
    background: ${props => props.theme.colors.primary};
    color: white;

    &:hover {
      background: ${props => props.theme.colors.primaryDark};
    }
  }
`;

const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border: none;
  background: none;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.background};
  }

  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }

  svg {
    width: 32px;
    height: 32px;
    color: ${props => props.theme.colors.primary};
  }
`;

const ProfileMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  min-width: 200px;
  overflow: hidden;
  z-index: 1000;
`;

const ProfileMenuItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.background};
  }

  &.danger {
    color: ${props => props.theme.colors.error};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ProfileMenuHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  text-align: center;

  h4 {
    margin: 8px 0 4px;
    color: ${props => props.theme.colors.text};
  }

  p {
    margin: 0;
    font-size: 14px;
    color: ${props => props.theme.colors.gray};
  }
`;

const ProfileMenuContainer = styled.div`
  position: relative;
`;

function App() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowProfileMenu(false);
    logout();
  };

  return (
    <Container>
      <Nav>
        <NavLinks>
          <NavLink to="/" className={pathname === '/' ? 'active' : ''}>
            <FaHome /> Home
          </NavLink>
          <NavLink to="/updates" className={pathname === '/updates' ? 'active' : ''}>
            <FaBell /> Updates
          </NavLink>
          <NavLink to="/posts" className={pathname === '/posts' ? 'active' : ''}>
            <FaNewspaper /> Posts
          </NavLink>
          <NavLink to="/profiles" className={pathname === '/profiles' ? 'active' : ''}>
            <FaUsers /> Profiles
          </NavLink>
          <NavLink to="/connections" className={pathname === '/connections' ? 'active' : ''}>
            <FaUserFriends /> Connections
          </NavLink>
        </NavLinks>
        <SearchWrapper>
          <Search />
        </SearchWrapper>

        <AuthButtons>
          {user ? (
            <>
              <Notifications />
              <ProfileMenuContainer ref={profileMenuRef}>
                <ProfileButton onClick={() => setShowProfileMenu(!showProfileMenu)}>
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} />
                  ) : (
                    <FaUserCircle />
                  )}
                </ProfileButton>
                {showProfileMenu && (
                  <ProfileMenu>
                    <ProfileMenuHeader>
                      <h4>{user.name}</h4>
                      <p>{user.email}</p>
                    </ProfileMenuHeader>
                    <ProfileMenuItem to={`/profiles/${user._id}`}>
                      <FaUserCircle /> View Profile
                    </ProfileMenuItem>
                    <ProfileMenuItem to="/create-profile">
                      <FaCog /> Edit Profile
                    </ProfileMenuItem>
                    <ProfileMenuItem as="button" onClick={handleLogout} className="danger">
                      <FaSignOutAlt /> Logout
                    </ProfileMenuItem>
                  </ProfileMenu>
                )}
              </ProfileMenuContainer>
            </>
          ) : (
            <>
              <AuthButton to="/login" className="login">Login</AuthButton>
              <AuthButton to="/register" className="register">Sign Up</AuthButton>
            </>
          )}
        </AuthButtons>
      </Nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-profile" element={
          <ProtectedRoute>
            <ProfileForm />
          </ProtectedRoute>
        } />
        <Route path="/posts" element={
          <ProtectedRoute>
            <Posts />
          </ProtectedRoute>
        } />
        <Route path="/profiles" element={<ProfileList />} />
        <Route path="/profiles/:id" element={<ProfileDetail />} />
        <Route path="/connections" element={
          <ProtectedRoute>
            <Connections />
          </ProtectedRoute>
        } />
        <Route path="/updates" element={<Updates />} />
      </Routes>
    </Container>
  );
}

export default App;
