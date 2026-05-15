import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreatePost from '../components/social/CreatePost';

const mockSubmit = jest.fn();

const renderCreatePost = () => {
  return render(<CreatePost onSubmit={mockSubmit} />);
};

describe('Create Post UX', () => {
  test('shows text input area', () => {
    renderCreatePost();
    expect(screen.getByPlaceholderText(/what's on your mind/i)).toBeInTheDocument();
  });

  test('shows image upload button', () => {
    renderCreatePost();
    expect(screen.getByRole('button', { name: /image/i })).toBeInTheDocument();
  });

  test('shows category selector', () => {
    renderCreatePost();
    expect(screen.getByText(/category/i)).toBeInTheDocument();
  });

  test('submit button disabled when empty', () => {
    renderCreatePost();
    const submitBtn = screen.getByRole('button', { name: /post/i });
    expect(submitBtn).toBeDisabled();
  });

  test('typing enables submit button', () => {
    renderCreatePost();
    const input = screen.getByPlaceholderText(/what's on your mind/i);
    fireEvent.change(input, { target: { value: 'Hello campus!' } });
    const submitBtn = screen.getByRole('button', { name: /post/i });
    expect(submitBtn).not.toBeDisabled();
  });

  test('submitting calls onSubmit with post data', async () => {
    renderCreatePost();
    const input = screen.getByPlaceholderText(/what's on your mind/i);
    fireEvent.change(input, { target: { value: 'Hello campus!' } });
    const submitBtn = screen.getByRole('button', { name: /post/i });
    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ content: 'Hello campus!' })
      );
    });
  });

  test('shows character count', () => {
    renderCreatePost();
    const input = screen.getByPlaceholderText(/what's on your mind/i);
    fireEvent.change(input, { target: { value: 'Hello' } });
    expect(screen.getByText(/5\/500/i)).toBeInTheDocument();
  });
});