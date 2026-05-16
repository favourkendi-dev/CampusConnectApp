import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

// Mock useAuth
jest.mock('../src/context/AuthContext', () => ({
  useAuthContext: () => ({
    user: { uid: 'test123', displayName: 'Test User', email: 'test@student.com' },
    userProfile: { role: 'student' },
    isAuthenticated: true,
    logout: jest.fn(),
  }),
}));

jest.mock('../src/hooks/useAuth', () => ({
  useAuth: () => ({
    logout: jest.fn(),
  }),
}));

const renderNavbar = () => {
  return render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );
};

describe('Navbar UX', () => {
  test('shows all navigation links', () => {
    renderNavbar();
    
    expect(screen.getByText(/home/i)).toBeInTheDocument();
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/chat/i)).toBeInTheDocument();
    expect(screen.getByText(/explore/i)).toBeInTheDocument();
  });

  test('shows user profile image', () => {
    renderNavbar();
    
    expect(screen.getByAltText(/profile/i)).toBeInTheDocument();
  });

  test('shows notification bell', () => {
    renderNavbar();
    
    expect(screen.getByRole('button', { name: /notifications/i })).toBeInTheDocument();
  });

  test('mobile menu toggle works', () => {
    renderNavbar();
    
    const menuBtn = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(menuBtn);
    
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });

  test('active link is highlighted', () => {
    renderNavbar();
    
    const homeLink = screen.getByText(/home/i).closest('a');
    expect(homeLink).toHaveClass('bg-indigo-50');
  });
});