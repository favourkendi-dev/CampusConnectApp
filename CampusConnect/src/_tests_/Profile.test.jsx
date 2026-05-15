import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Profile from '../pages/Profile';

jest.mock('../src/context/AuthContext', () => ({
  useAuth: () => ({
    user: { 
      uid: 'test123', 
      displayName: 'Test User', 
      email: 'test@student.com',
      photoURL: 'https://example.com/photo.jpg'
    },
    userProfile: {
      displayName: 'Test User',
      bio: 'Computer Science student',
      university: 'Test University',
      major: 'Computer Science',
      year: '3rd Year',
      followers: [],
      following: [],
    },
    loading: false,
  }),
}));

jest.mock('../src/firebase/config', () => ({ db: {} }));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn().mockResolvedValue({
    exists: () => true,
    data: () => ({
      displayName: 'Test User',
      bio: 'Computer Science student',
      university: 'Test University',
      major: 'Computer Science',
      year: '3rd Year',
    }),
  }),
  updateDoc: jest.fn().mockResolvedValue({}),
}));

const renderProfile = () => {
  return render(
    <BrowserRouter>
      <Profile />
    </BrowserRouter>
  );
};

describe('Profile Page UX', () => {
  test('shows user profile information', async () => {
    renderProfile();
    await waitFor(() => {
      expect(screen.getByText(/test user/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/computer science student/i)).toBeInTheDocument();
    expect(screen.getByText(/test university/i)).toBeInTheDocument();
  });

  test('shows edit profile button', async () => {
    renderProfile();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument();
    });
  });

  test('shows profile stats', async () => {
    renderProfile();
    await waitFor(() => {
      expect(screen.getByText(/posts/i)).toBeInTheDocument();
      expect(screen.getByText(/followers/i)).toBeInTheDocument();
      expect(screen.getByText(/following/i)).toBeInTheDocument();
    });
  });

  test('shows user posts tab', async () => {
    renderProfile();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /posts/i })).toBeInTheDocument();
    });
  });

  test('shows saved items tab', async () => {
    renderProfile();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /saved/i })).toBeInTheDocument();
    });
  });
});