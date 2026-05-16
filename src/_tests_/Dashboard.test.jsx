import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';

// Mock useAuth
jest.mock('../src/context/AuthContext', () => ({
  useAuth: () => ({
    user: { uid: 'test123', displayName: 'Test User', email: 'test@student.com' },
    userProfile: { displayName: 'Test User' },
    loading: false,
  }),
}));

// Mock firebase
jest.mock('../src/firebase/config', () => ({
  db: {},
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  onSnapshot: jest.fn(() => jest.fn()),
  getDocs: jest.fn().mockResolvedValue({ docs: [], size: 0 }),
  Timestamp: {
    fromDate: jest.fn(() => ({})),
  },
}));

const renderDashboard = () => {
  return render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  );
};

describe('Dashboard Page UX', () => {
  test('shows welcome message with user name', () => {
    renderDashboard();
    
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    expect(screen.getByText(/test user/i)).toBeInTheDocument();
  });

  test('shows stat cards', () => {
    renderDashboard();
    
    expect(screen.getByText(/your posts/i)).toBeInTheDocument();
    expect(screen.getByText(/total likes/i)).toBeInTheDocument();
    expect(screen.getByText(/comments/i)).toBeInTheDocument();
    expect(screen.getByText(/study groups/i)).toBeInTheDocument();
    expect(screen.getByText(/events/i)).toBeInTheDocument();
  });

  test('shows weekly activity chart', () => {
    renderDashboard();
    
    expect(screen.getByText(/weekly activity/i)).toBeInTheDocument();
  });

  test('shows quick actions', () => {
    renderDashboard();
    
    expect(screen.getByText(/quick actions/i)).toBeInTheDocument();
    expect(screen.getByText(/create post/i)).toBeInTheDocument();
    expect(screen.getByText(/join study group/i)).toBeInTheDocument();
  });

  test('shows go to feed button', () => {
    renderDashboard();
    
    expect(screen.getByRole('button', { name: /go to feed/i })).toBeInTheDocument();
  });
});