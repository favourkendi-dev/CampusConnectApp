import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext as useAuth } from "../../context/AuthContext";
import { useAuth as useAuthActions } from '../../hooks/useAuth';
import { useState } from 'react';
import { Home, MessageCircle, User, Search, LogOut, Menu, X, Bell, Megaphone, Shield, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, userProfile, isAuthenticated } = useAuth();
  const { logout } = useAuthActions();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isAdmin = userProfile?.role === 'admin' || user?.email?.includes('admin');

  const navLinks = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/chat', icon: MessageCircle, label: 'Chat' },
    { to: '/explore', icon: Search, label: 'Explore' },
    { to: '/announcements', icon: Megaphone, label: 'Announcements' },
    { to: '/profile', icon: User, label: 'Profile' },
    ...(isAdmin ? [{ to: '/admin', icon: Shield, label: 'Admin' }] : []),
  ];

  const isActive = (path) => location.pathname === path;

  const getAvatarUrl = () => {
    if (user?.email === 'favourkendi0@gmail.com') {
      return '/CampusConnect/src/assets/favour.jpeg'; 
    }
    if (user?.photoURL) {
      return user.photoURL;
    }
    const name = user?.displayName || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4F46E5&color=fff&bold=true`;
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-indigo-600 hidden sm:block">
                Campus Connect
              </span>
            </Link>
          </div>

          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <button className="p-2 text-gray-500 hover:text-indigo-600 transition-colors relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="hidden md:flex items-center gap-3 ml-2 border-l pl-4 border-gray-100">
                  <img
                    src={getAvatarUrl()}
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover border-2 border-indigo-100 shadow-sm"
                    onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${user?.displayName || 'U'}&background=4F46E5&color=fff`;
                    }}
                  />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-rose-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-indigo-600"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && isAuthenticated && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-inner">
          <div className="px-4 pt-4 pb-3 space-y-1">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-50 mb-2">
              <img
                src={getAvatarUrl()}
                alt="Profile"
                className="w-12 h-12 rounded-full border-2 border-indigo-100"
              />
              <div>
                <p className="font-bold text-gray-900">{user?.displayName || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium ${
                  isActive(link.to)
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}

            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="flex w-full items-center gap-3 px-3 py-3 text-base font-medium text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;