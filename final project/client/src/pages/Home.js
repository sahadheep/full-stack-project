import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserFriends, FaSearch, FaHeart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import {
  HomeContainer,
  HeroSection,
  Title,
  Subtitle,
  ButtonGroup,
  Button,
  FeaturesGrid,
  FeatureCard,
  StatisticsSection,
  StatsGrid,
  StatCard
} from '../styles/homeStyles';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <HomeContainer>
      <HeroSection>
        <Title>
         Scaler <span>Updates</span>
        </Title>
        <Subtitle>
         Stay connected with your college updates! Get the latest news,
         connect with peers, and never miss important announcements.
        </Subtitle>
        <ButtonGroup>
          {!user ? (
            <>
              <Button className="primary" onClick={() => navigate('/register')}>
                Get Started
              </Button>
              <Button className="secondary" onClick={() => navigate('/login')}>
                Login
              </Button>
            </>
          ) : (
            <>
              <Button className="primary" onClick={() => navigate('/profiles')}>
                Discover Profiles
              </Button>
              <Button className="secondary" onClick={() => navigate('/connections')}>
                View Connections
              </Button>
            </>
          )}
        </ButtonGroup>
      </HeroSection>

      <FeaturesGrid>
        <FeatureCard>
          <FaUserFriends />
          <h3>Create Your Profile</h3>
          <p>Build your student profile and connect with your college network. Share your achievements and interests.</p>
        </FeatureCard>
        <FeatureCard>
          <FaSearch />
          <h3>Stay Informed</h3>
          <p>Get real-time updates about college events, announcements, and academic opportunities.</p>
        </FeatureCard>
        <FeatureCard>
          <FaHeart />
          <h3>Connect & Collaborate</h3>
          <p>Network with fellow students, join study groups, and collaborate on projects.</p>
        </FeatureCard>
      </FeaturesGrid>
    </HomeContainer>
  );
}
