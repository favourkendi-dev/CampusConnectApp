import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Chat from '../pages/Chat';

// Mock useAuth
jest.mock('../src/context/AuthContext', () => ({
  useAuth: () => ({
    user: { uid: 'test123', displayName: 'Test User' },
  }),
}));

// Mock useChat
jest.mock('../src/hooks/useChat', () => ({
  useChat: () => ({
    conversations: [],
    messages: [],
    activeConversation: null,
    setActiveConversation: jest.fn(),
    loading: false,
    startConversation: jest.fn().mockResolvedValue({ success: true, id: 'conv123' }),
    sendMessage: jest.fn().mockResolvedValue({ success: true }),
  }),
}));

// Mock firebase
jest.mock('../src/firebase/config', () => ({
  db: {},
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn().mockResolvedValue({
    docs: [
      { id: 'user1', data: () => ({ displayName: 'Alice', email: 'alice@student.com', isOnline: true }) },
      { id: 'user2', data: () => ({ displayName: 'Bob', email: 'bob@student.com', isOnline: false }) },
    ],
  }),
  doc: jest.fn(),
  onSnapshot: jest.fn(() => jest.fn()),
}));

const renderChat = () => {
  return render(
    <BrowserRouter>
      <Chat />
    </BrowserRouter>
  );
};

describe('Chat Page UX', () => {
  test('shows user list with search', async () => {
    renderChat();
    
    await waitFor(() => {
      expect(screen.getByText(/messages/i)).toBeInTheDocument();
    });
    
    expect(screen.getByPlaceholderText(/search students/i)).toBeInTheDocument();
  });

  test('shows online/offline status', async () => {
    renderChat();
    
    await waitFor(() => {
      expect(screen.getByText(/alice/i)).toBeInTheDocument();
    });
    
    expect(screen.getByText(/online/i)).toBeInTheDocument();
  });

  test('shows empty chat state', async () => {
    renderChat();
    
    await waitFor(() => {
      expect(screen.getByText(/select a conversation/i)).toBeInTheDocument();
    });
  });

  test('clicking user starts conversation', async () => {
    renderChat();
    
    await waitFor(() => {
      expect(screen.getByText(/alice/i)).toBeInTheDocument();
    });
    
    const userBtn = screen.getByText(/alice/i).closest('button');
    fireEvent.click(userBtn);
    
    // Should show chat window after click
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/type a message/i)).toBeInTheDocument();
    });
  });

  test('message input and send button visible', async () => {
    renderChat();
    
    await waitFor(() => {
      expect(screen.getByText(/alice/i)).toBeInTheDocument();
    });
    
    const userBtn = screen.getByText(/alice/i).closest('button');
    fireEvent.click(userBtn);
    
    const input = screen.getByPlaceholderText(/type a message/i);
    const sendBtn = screen.getByRole('button', { name: /send/i });
    
    expect(input).toBeInTheDocument();
    expect(sendBtn).toBeInTheDocument();
  });
});