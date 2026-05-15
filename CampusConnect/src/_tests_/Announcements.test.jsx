import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Announcements from '../pages/Announcements';

jest.mock('../src/context/AuthContext', () => ({
  useAuth: () => ({
    user: { uid: 'test123', displayName: 'Test User' },
    userProfile: { role: 'student' },
  }),
}));

jest.mock('../src/firebase/config', () => ({ db: {} }));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  onSnapshot: jest.fn((q, callback) => {
    callback({
      docs: [
        { 
          id: 'ann1', 
          data: () => ({ 
            title: 'Exam Schedule Update', 
            content: 'Final exams start next week',
            createdAt: { toDate: () => new Date() },
            priority: 'high'
          }) 
        },
        { 
          id: 'ann2', 
          data: () => ({ 
            title: 'Campus Event', 
            content: 'Join us for the annual festival',
            createdAt: { toDate: () => new Date() },
            priority: 'normal'
          }) 
        },
      ],
    });
    return jest.fn();
  }),
}));

const renderAnnouncements = () => {
  return render(
    <BrowserRouter>
      <Announcements />
    </BrowserRouter>
  );
};

describe('Announcements Page UX', () => {
  test('shows page title', () => {
    renderAnnouncements();
    expect(screen.getByText(/announcements/i)).toBeInTheDocument();
  });

  test('shows announcement cards', async () => {
    renderAnnouncements();
    await waitFor(() => {
      expect(screen.getByText(/exam schedule update/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/final exams start next week/i)).toBeInTheDocument();
  });

  test('shows priority badge for high priority', async () => {
    renderAnnouncements();
    await waitFor(() => {
      expect(screen.getByText(/high/i)).toBeInTheDocument();
    });
  });

  test('shows timestamp on announcements', async () => {
    renderAnnouncements();
    await waitFor(() => {
      expect(screen.getByText(/just now|ago/i)).toBeInTheDocument();
    });
  });
});