import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AuthContainer,
  AuthCard,
  AuthForm,
  Input,
  Button,
  ErrorMessage
} from '../styles/authStyles';
import styled from 'styled-components';

const LoginLink = styled(Link)`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  text-align: center;
  margin-top: 1rem;
  display: block;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await auth.register({ name, email, password });
      navigate('/create-profile');
    } catch (error) {
      setErr(error?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthCard>
        <h2>Create Account</h2>
        <AuthForm onSubmit={onSubmit}>
          <Input
            required
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={loading}
          />
          <Input
            required
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
          />
          <Input
            required
            type="password"
            placeholder="Password (min. 6 characters)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </Button>
          {err && <ErrorMessage>{err}</ErrorMessage>}
        </AuthForm>
        <LoginLink to="/login">
          Already have an account? Log in
        </LoginLink>
      </AuthCard>
    </AuthContainer>
  );
}
