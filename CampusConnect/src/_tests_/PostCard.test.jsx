import { render, screen, fireEvent } from '@testing-library/react';
import PostCard from '../components/social/PostCard';

const mockPost = {
  id: 'post1',
  content: 'This is a test post',
  userId: 'user1',
  userName: 'Test User',
  userPhotoURL: '',
  createdAt: new Date(),
  likes: [],
  likesCount: 0,
  commentsCount: 2,
  shares: 0,
  images: [],
};

const mockCurrentUser = { uid: 'user1', displayName: 'Test User' };

const renderPostCard = (props = {}) => {
  return render(
    <PostCard
      post={mockPost}
      currentUser={mockCurrentUser}
      onLike={jest.fn()}
      onUnlike={jest.fn()}
      onDelete={jest.fn()}
      onUpdate={jest.fn()}
      {...props}
    />
  );
};

describe('Post Card UX', () => {
  test('shows post content', () => {
    renderPostCard();
    expect(screen.getByText(/this is a test post/i)).toBeInTheDocument();
  });

  test('shows user name', () => {
    renderPostCard();
    expect(screen.getByText(/test user/i)).toBeInTheDocument();
  });

  test('shows like button', () => {
    renderPostCard();
    expect(screen.getByRole('button', { name: /like/i })).toBeInTheDocument();
  });

  test('shows comment count', () => {
    renderPostCard();
    expect(screen.getByText(/2/i)).toBeInTheDocument();
  });

  test('clicking like calls onLike', () => {
    const mockLike = jest.fn();
    renderPostCard({ onLike: mockLike });
    const likeBtn = screen.getByRole('button', { name: /like/i });
    fireEvent.click(likeBtn);
    expect(mockLike).toHaveBeenCalledWith('post1', 'user1');
  });

  test('shows edit button for own post', () => {
    renderPostCard();
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
  });

  test('shows delete button for own post', () => {
    renderPostCard();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  test('shows share button', () => {
    renderPostCard();
    expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
  });
});