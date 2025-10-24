import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../utils/apiClient';

const FormContainer = styled.div`
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Title = styled.h2`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 24px;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 4px;

  &::after {
    content: ${props => props.required ? '"*"' : '""'};
    color: ${props => props.theme.colors.error};
  }
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid ${props => props.theme.colors.lightGray};
  border-radius: 6px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid ${props => props.theme.colors.lightGray};
  border-radius: 6px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid ${props => props.theme.colors.lightGray};
  border-radius: 6px;
  font-size: 16px;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Button = styled.button`
  padding: 12px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
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

const ImagePreview = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 60px;
  margin: 10px 0;
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  font-size: 14px;
  margin-top: 4px;
  background: ${props => `${props.theme.colors.error}10`};
  padding: 12px;
  border-radius: 6px;
  border: 1px solid ${props => `${props.theme.colors.error}30`};
  white-space: pre-line;
`;

export default function ProfileForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [formData, setFormData] = useState({
    bio: '',
    age: '',
    gender: '',
    batch: '',
    course: '',
    currentModule: '',
    graduationYear: '',
    college: '',
    role: 'student',
    skills: '',
    github: '',
    linkedin: '',
    twitter: '',
    avatar: null
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, avatar: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const requiredFields = ['bio', 'age', 'gender', 'batch', 'course', 'graduationYear', 'college'];
    const errors = [];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
      }
    });

    if (formData.age && (formData.age < 18 || formData.age > 100)) {
      errors.push('Age must be between 18 and 100');
    }

    if (formData.graduationYear && (formData.graduationYear < 2000 || formData.graduationYear > 2030)) {
      errors.push('Graduation year must be between 2000 and 2030');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join('\n'));
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Handle special fields
      if (formData.skills) {
        const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
        formDataToSend.append('skills', JSON.stringify(skillsArray));
      }

      // Handle social links
      ['github', 'linkedin', 'twitter'].forEach(field => {
        if (formData[field] && !formData[field].startsWith('https://')) {
          formData[field] = `https://${formData[field]}`;
        }
      });

      // Add all other fields
      Object.keys(formData).forEach(key => {
        if (key !== 'skills' && formData[key] !== null && formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await api.post('/profiles', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data && response.data.status === 'success') {
        navigate('/profiles');
      } else {
        throw new Error(response.data?.message || 'Failed to create profile');
      }
    } catch (err) {
      console.error('Profile creation error:', err);
      setError(err?.response?.data?.message || err.message || 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <FormContainer>
      <Title>Complete Your Profile</Title>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Profile Picture</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {previewUrl && <ImagePreview src={previewUrl} alt="Preview" />}
        </FormGroup>

        <FormGroup>
          <Label required>Bio</Label>
          <TextArea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
            required
          />
        </FormGroup>

        <FormGroup>
          <Label required>Age</Label>
          <Input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min="18"
            max="100"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label required>Gender</Label>
          <Select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Role</Label>
          <Select name="role" value={formData.role} onChange={handleChange}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="alumni">Alumni</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label required>Batch</Label>
          <Input
            name="batch"
            value={formData.batch}
            onChange={handleChange}
            placeholder="e.g., 2023-24"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label required>Course</Label>
          <Input
            name="course"
            value={formData.course}
            onChange={handleChange}
            placeholder="e.g., Data Structures & Algorithms"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Current Module</Label>
          <Input
            name="currentModule"
            value={formData.currentModule}
            onChange={handleChange}
            placeholder="e.g., Advanced DSA"
          />
        </FormGroup>

        <FormGroup>
          <Label required>Graduation Year</Label>
          <Input
            type="number"
            name="graduationYear"
            value={formData.graduationYear}
            onChange={handleChange}
            min="2000"
            max="2030"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label required>College</Label>
          <Input
            name="college"
            value={formData.college}
            onChange={handleChange}
            placeholder="Your college name"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Skills (comma-separated)</Label>
          <Input
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g., Java, Python, React"
          />
        </FormGroup>

        <FormGroup>
          <Label>GitHub Profile</Label>
          <Input
            name="github"
            value={formData.github}
            onChange={handleChange}
            placeholder="https://github.com/username"
          />
        </FormGroup>

        <FormGroup>
          <Label>LinkedIn Profile</Label>
          <Input
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/username"
          />
        </FormGroup>

        <FormGroup>
          <Label>Twitter Profile</Label>
          <Input
            name="twitter"
            value={formData.twitter}
            onChange={handleChange}
            placeholder="https://twitter.com/username"
          />
        </FormGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating Profile...' : 'Save Profile'}
        </Button>
      </Form>
    </FormContainer>
  );
}