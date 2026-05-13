import { MapPin, GraduationCap, Calendar, Users, UserPlus, UserCheck } from 'lucide-react';
import { useState } from 'react';

const ProfileCard = ({ profile, isOwn, onFollow, onUnfollow, isFollowing }) => {
  const [localFollowing, setLocalFollowing] = useState(isFollowing);

  const handleFollow = async () => {
    if (localFollowing) {
      await onUnfollow();
      setLocalFollowing(false);
    } else {
      await onFollow();
      setLocalFollowing(true);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Cover Image */}
      <div className="h-32 bg-gradient-to-r from-primary-600 to-primary-400"></div>
      
      {/* Profile Info */}
      <div className="px-6 pb-6">
        <div className="relative -mt-12 mb-4">
          <img
            src={profile?.photoURL || `https://ui-avatars.com/api/?name=${profile?.displayName}&background=4F46E5&color=fff&size=128`}
            alt={profile?.displayName}
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
          />
        </div>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{profile?.displayName}</h1>
            <p className="text-gray-500">{profile?.email}</p>
          </div>
          
          {!isOwn && (
            <button
              onClick={handleFollow}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                localFollowing
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {localFollowing ? (
                <>
                  <UserCheck className="w-4 h-4" />
                  Following
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Follow
                </>
              )}
            </button>
          )}
        </div>

        {profile?.bio && (
          <p className="mt-3 text-gray-700">{profile.bio}</p>
        )}

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
          {profile?.university && (
            <div className="flex items-center gap-1">
              <GraduationCap className="w-4 h-4" />
              <span>{profile.university}</span>
            </div>
          )}
          {profile?.major && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{profile.major}</span>
            </div>
          )}
          {profile?.year && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Class of {profile.year}</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-6 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{profile?.followers?.length || 0}</p>
            <p className="text-xs text-gray-500">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{profile?.following?.length || 0}</p>
            <p className="text-xs text-gray-500">Following</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{profile?.postsCount || 0}</p>
            <p className="text-xs text-gray-500">Posts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;