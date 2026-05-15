import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Home from '../pages/Home';

// Mock useAuth
jest.mock('../src/context/AuthContext', () => ({
  ...jest.requireActual('../src/context/AuthContext'),
  useAuth: () => ({
    user: { uid: 'test123', displayName: 'Test User', email: 'test@student.com' },
    logout: jest.fn(),
  }),
}));

// Mock usePosts
jest.mock('../src/hooks/useFirestore', () => ({
  usePosts: () => ({
    posts: [],
    loading: false,
    createPost: jest.fn(),
    likePost: jest.fn(),
    unlikePost: jest.fn(),
    deletePost: jest.fn(),
    updatePost: jest.fn(),
  }),
}));

const renderHome = () => {
  return render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );
};

describe('Home Page UX', () => {
  test('shows sidebar with user info', () => {
    renderHome();
    
    expect(screen.getByText(/test user/i)).toBeInTheDocument();
    expect(screen.getByText(/posts/i)).toBeInTheDocument();
  });

  test('shows create post input', () => {
    renderHome();
    
    expect(screen.getByPlaceholderText(/what's on your mind/i)).toBeInTheDocument();
  });

  test('shows filter tabs', () => {
    renderHome();
    
    expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /academic/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /social/i })).toBeInTheDocument();
  });

  test('shows active now count', () => {
    renderHome();
    
    expect(screen.getByText(/active now/i)).toBeInTheDocument();
    expect(screen.getByText(/students online/i)).toBeInTheDocument();
  });

  test('shows empty state when no posts', () => {
    renderHome();
    
    expect(screen.getByText(/no posts yet/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create post/i })).toBeInTheDocument();
  });

  test('search input is visible', () => {
    renderHome();
    
    expect(screen.getByPlaceholderText(/search posts/i)).toBeInTheDocument();
  });
});