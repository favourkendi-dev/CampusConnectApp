import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Login from '../pages/Login';

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Login Page UX', () => {
  test('shows login form with email and password fields', () => {
    renderLogin();
    
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('shows error message when fields are empty', async () => {
    renderLogin();
    
    const submitBtn = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitBtn);
    
    await waitFor(() => {
      expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument();
    });
  });

  test('shows loading state during login', async () => {
    renderLogin();
    
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@student.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    const submitBtn = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitBtn);
    
    expect(screen.getByText(/signing in/i)).toBeInTheDocument();
  });

  test('toggles password visibility', () => {
    renderLogin();
    
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const toggleBtn = screen.getByRole('button', { name: /show password/i });
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  test('shows Google sign-in button', () => {
    renderLogin();
    expect(screen.getByRole('button', { name: /google/i })).toBeInTheDocument();
  });
});