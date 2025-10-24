import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const HomeContainer = styled.div`
  min-height: calc(100vh - 64px);
  padding: 0;
  position: relative;
  overflow: hidden;
`;

export const HeroSection = styled.div`
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.primary}11 0%,
    ${props => props.theme.colors.secondary}11 100%
  );
  padding: 80px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('https://picsum.photos/1920/1080') center/cover;
    opacity: 0.1;
    z-index: -1;
  }
`;

export const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1.5rem;
  animation: ${fadeIn} 1s ease-out;

  span {
    color: ${props => props.theme.colors.primary};
  }
`;

export const Subtitle = styled.p`
  font-size: 1.25rem;
  color: ${props => props.theme.colors.gray};
  max-width: 600px;
  margin: 0 auto 2rem;
  line-height: 1.6;
  animation: ${fadeIn} 1s ease-out 0.2s backwards;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  animation: ${fadeIn} 1s ease-out 0.4s backwards;
`;

export const Button = styled.button`
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }

  &.primary {
    background: ${props => props.theme.colors.primary};
    color: white;
    border: none;

    &:hover {
      background: ${props => props.theme.colors.primaryDark};
    }
  }

  &.secondary {
    background: white;
    color: ${props => props.theme.colors.primary};
    border: 2px solid ${props => props.theme.colors.primary};
  }
`;

export const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

export const FeatureCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  text-align: center;
  transition: transform 0.2s;
  animation: ${fadeIn} 1s ease-out 0.6s backwards;

  &:hover {
    transform: translateY(-4px);
  }

  h3 {
    color: ${props => props.theme.colors.text};
    margin: 1rem 0;
    font-size: 1.5rem;
  }

  p {
    color: ${props => props.theme.colors.gray};
    line-height: 1.6;
  }

  svg {
    font-size: 2.5rem;
    color: ${props => props.theme.colors.primary};
  }
`;

export const StatisticsSection = styled.div`
  background: ${props => props.theme.colors.lightGray};
  padding: 4rem 2rem;
  text-align: center;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
`;

export const StatCard = styled.div`
  animation: ${fadeIn} 1s ease-out 0.8s backwards;

  .number {
    font-size: 2.5rem;
    font-weight: 700;
    color: ${props => props.theme.colors.primary};
    margin-bottom: 0.5rem;
  }

  .label {
    color: ${props => props.theme.colors.gray};
    font-size: 1.1rem;
  }
`;