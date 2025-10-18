import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import NotificationBell from '../common/NotificationBell';
import { FiMenu, FiX, FiSearch,  FiPlus, FiUser, FiLogOut, FiHeart, FiFileText, FiSun, FiMoon,FiBookmark, FiHome } from 'react-icons/fi';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="pro-nav sticky top-0 z-50">
      <div className="container">
        <div className="flex justify-between items-center h-16">
       
          <Link to="/" className="flex items-center space-x-3 group">
            
            <span className="text-xl font-bold pro-text-primary">PromptVerse</span>
          </Link>

       
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="pro-text-secondary hover:text-blue-600 dark:hover:text-white-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
            
            </Link>
            
            {isAuthenticated ? (
              <>
              
                <Link
                  to="/create"
                  className="flex items-center space-x-2 pro-text-secondary hover:text-blue-600 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <FiPlus className="w-4 h-4" />
                  <span>Create</span>
                </Link>
                <Link
                  to="/my-prompts"
                  className="flex items-center space-x-2 pro-text-secondary hover:text-blue-600 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <FiFileText className="w-4 h-4" />
                  <span>My Prompts</span>
                </Link>
                <Link
                  to="/liked"
                  className="flex items-center space-x-2 pro-text-secondary hover:text-blue-600 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <FiHeart className="w-4 h-4" />
                  <span>Liked</span>
                </Link>
                <Link
                  to="/bookmark"
                  className="flex items-center space-x-2 pro-text-secondary hover:text-blue-600 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <FiBookmark className="w-4 h-4" />
                  <span>BookMarked</span>
                </Link>
              </>
            ) : null}
          </div>

        
          <div className="hidden md:flex items-center space-x-4">
      
            {isAuthenticated && <NotificationBell />}
            
          
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md pro-text-secondary hover:text-blue-600 dark:hover:text-white transition-colors"
            >
              {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>

            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-3 pro-text-secondary hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm font-medium">
                      {user?.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span>{user?.username}</span>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 pro-card shadow-lg py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-4 py-2 text-sm pro-text-secondary hover:bg-gray-50  dark:hover:bg-gray-700 transition-colors"
                  >
                    <FiUser className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm pro-text-secondary hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/auth"
                  className="pro-btn-primary"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 p-2"
            >
              {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/create"
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiPlus className="w-4 h-4" />
                    <span>Create Prompt</span>
                  </Link>
                  <Link
                    to="/my-prompts"
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiFileText className="w-4 h-4" />
                    <span>My Prompts</span>
                  </Link>
                  <Link
                    to="/liked"
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiHeart className="w-4 h-4" />
                    <span>Liked Prompts</span>
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiUser className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 w-full text-left text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 