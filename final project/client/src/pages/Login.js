import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const Form = styled.form`max-width:400px; margin:0 auto; display:flex; flex-direction:column; gap:8px;`;
const Input = styled.input`padding:8px; border-radius:6px; border:1px solid #ddd;`;
<p>
  Don’t have an account? <a href="/register">Sign Up</a>
</p>
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const auth = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      await auth.login({ email, password });
      navigate('/profiles');
    } catch (error) {
      setErr(error?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="card">
      <h2>Login</h2>
      <Form onSubmit={onSubmit}>
        <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" style={{padding:8, borderRadius:6, background:'#2C6BED', color:'#fff', border:'none'}}>Login</button>
        {err && <div style={{color:'red'}}>{err}</div>}
      </Form>
    </div>
  );
}
