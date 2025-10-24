import styled from 'styled-components';

export const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 20px;
  background: ${props => props.theme.colors.background};
`;

export const AuthCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  h2 {
    color: ${props => props.theme.colors.primary};
    margin-bottom: 1.5rem;
    text-align: center;
    font-size: 1.8rem;
  }
`;

export const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    outline: none;
  }
`;

export const Button = styled.button`
  padding: 12px;
  border-radius: 8px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
  }

  &:disabled {
    background: #ccc;
  }
`;

export const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  text-align: center;
  margin-top: 0.5rem;
  font-size: 0.9rem;
`;

export const SuccessMessage = styled.div`
  color: ${props => props.theme.colors.success};
  text-align: center;
  margin-top: 0.5rem;
  font-size: 0.9rem;
`;