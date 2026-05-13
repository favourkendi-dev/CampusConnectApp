import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserProfile, useUserPosts } from '../hooks/useFirestore';
import ProfileCard from '../components/profile/ProfileCard';
import PostCard from '../components/social/PostCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { usePosts } from '../hooks/useFirestore';

const Profile = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const isOwnProfile = !userId || userId === user?.uid;
  const targetUserId = userId || user?.uid;

  const { profile, loading: profileLoading, followUser, unfollowUser } = useUserProfile(targetUserId);
  const { posts, loading: postsLoading } = useUserPosts(targetUserId);
  const { likePost, unlikePost, deletePost } = usePosts();

  const isFollowing = profile?.followers?.includes(user?.uid);

  if (profileLoading) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <ProfileCard
        profile={profile}
        isOwn={isOwnProfile}
        isFollowing={isFollowing}
        onFollow={() => followUser(user?.uid, targetUserId)}
        onUnfollow={() => unfollowUser(user?.uid, targetUserId)}
      />

      <div className="mt-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {isOwnProfile ? 'My Posts' : `${profile?.displayName}'s Posts`}
        </h2>
        
        {postsLoading ? (
          <LoadingSpinner />
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <p className="text-gray-500">No posts yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={likePost}
                onUnlike={unlikePost}
                onDelete={deletePost}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;