import React, { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaSearch, FaUserCircle, FaNewspaper } from 'react-icons/fa';
import api from '../utils/apiClient';
import { debounce } from 'lodash';

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 20px;
  padding-left: 40px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primaryLight};
  }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.gray};
`;

const ResultsContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin-top: 8px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
`;

const ResultItem = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${props => props.theme.colors.background};
  }

  .icon {
    color: ${props => props.theme.colors.primary};
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .details {
    flex: 1;
    min-width: 0;

    h4 {
      margin: 0;
      color: ${props => props.theme.colors.text};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    p {
      margin: 4px 0 0;
      color: ${props => props.theme.colors.gray};
      font-size: 0.9rem;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }

  .type {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.gray};
    flex-shrink: 0;
  }
`;

const TypeFilter = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
`;

const FilterButton = styled.button`
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.active ? props.theme.colors.primary : 'white'};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: ${props => props.active ? props.theme.colors.primaryDark : props.theme.colors.background};
  }
`;

export default function Search({ onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [type, setType] = useState('all');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const performSearch = useCallback(
    debounce(async (searchQuery) => {
      if (!searchQuery.trim()) {
        setResults(null);
        return;
      }

      try {
        setLoading(true);
        console.log('Performing search with query:', searchQuery); // Debug log
        const response = await api.get('/search', {
          params: { 
            query: searchQuery, 
            type,
            page: 1,
            limit: 10
          }
        });
        console.log('Search response:', response.data); // Debug log
        console.log('Search response:', response.data); // Debug log
        if (response.data && response.data.data) {
          setResults(response.data.data);
        } else {
          console.error('Invalid response format:', response.data);
          setResults({ profiles: [], posts: [], total: 0 });
        }
      } catch (error) {
        console.error('Search error:', error.response || error);
        setResults(null);
      } finally {
        setLoading(false);
      }
    }, 300),
    [type]
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    performSearch(value);
  };

  const handleResultClick = (result, resultType) => {
    if (resultType === 'profile') {
      navigate(`/profiles/${result.userId._id}`);
    } else {
      navigate(`/posts/${result._id}`);
    }
    if (onClose) onClose();
  };

  const renderResultItem = (item, type) => {
    if (type === 'profile') {
      return (
        <ResultItem key={item._id} onClick={() => handleResultClick(item, 'profile')}>
          <FaUserCircle className="icon" />
          <div className="details">
            <h4>{item.userId?.name || 'Unknown User'}</h4>
            <p>{item.bio?.substring(0, 100) || 'No bio available'}</p>
          </div>
          <span className="type">Profile</span>
        </ResultItem>
      );
    }
    return (
      <ResultItem key={item._id} onClick={() => handleResultClick(item, 'post')}>
        <FaNewspaper className="icon" />
        <div className="details">
          <h4>{item.title || 'Untitled Post'}</h4>
          <p>{(item.content || '').substring(0, 100)}...</p>
        </div>
        <span className="type">Post</span>
      </ResultItem>
    );
  };

  return (
    <SearchContainer>
      <TypeFilter>
        <FilterButton active={type === 'all'} onClick={() => setType('all')}>
          All
        </FilterButton>
        <FilterButton active={type === 'profiles'} onClick={() => setType('profiles')}>
          Profiles
        </FilterButton>
        <FilterButton active={type === 'posts'} onClick={() => setType('posts')}>
          Posts
        </FilterButton>
      </TypeFilter>
      <div style={{ position: 'relative' }}>
        <SearchIcon style={{ 
          color: loading ? props => props.theme.colors.primary : props => props.theme.colors.gray,
          animation: loading ? 'spin 1s linear infinite' : 'none'
        }} />
        <SearchInput
          type="text"
          placeholder="Search profiles and posts..."
          value={query}
          onChange={handleInputChange}
        />
      </div>
      {query.trim() !== '' && (
        <ResultsContainer>
          {loading ? (
            <ResultItem style={{ justifyContent: 'center' }}>
              <div className="details" style={{ textAlign: 'center' }}>
                <p>Searching...</p>
              </div>
            </ResultItem>
          ) : results ? (
            <>
              {results.profiles?.map(profile => renderResultItem(profile, 'profile'))}
              {results.posts?.map(post => renderResultItem(post, 'post'))}
              {results.total === 0 && (
                <ResultItem style={{ justifyContent: 'center' }}>
                  <div className="details" style={{ textAlign: 'center' }}>
                    <p>No results found for "{query}"</p>
                  </div>
                </ResultItem>
              )}
            </>
          ) : (
            <ResultItem style={{ justifyContent: 'center' }}>
              <div className="details" style={{ textAlign: 'center' }}>
                <p>An error occurred while searching. Please try again.</p>
              </div>
            </ResultItem>
          )}
        </ResultsContainer>
      )}
      <style>
        {`
          @keyframes spin {
            0% { transform: translateY(-50%) rotate(0deg); }
            100% { transform: translateY(-50%) rotate(360deg); }
          }
        `}
      </style>
    </SearchContainer>
  );
}