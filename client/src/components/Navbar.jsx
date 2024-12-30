import { useState } from 'react';
import { useAuth } from '../store/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { GoX } from 'react-icons/go';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, logout, isDoctor ,isPatient} = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false); // Close mobile menu on logout
  };

  const handleChoice = (userType) => {
    navigate(`/login?userType=${userType}`);
    setIsModalOpen(false);
    setIsMenuOpen(false);
  };

  // Logged in user menu
  const UserMenu = () => (
    <Menu as="div" className="relative">
      <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white">
        <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full">
          <span className="font-medium text-gray-600">DP</span>
        </div>
      </MenuButton>
      <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg">
        <MenuItem>
          <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Your Profile
          </Link>
        </MenuItem>
        {isPatient() && (
          <MenuItem>
            <Link to="/wallet" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Wallet
            </Link>
          </MenuItem>
        )}
        <MenuItem>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Sign out
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );

  // Login button for non-logged in users
  const LoginButton = () => (
    <button
      onClick={() => setIsModalOpen(true)}
      className="text-white bg-indigo-600 px-4 py-2 rounded-md shadow hover:bg-indigo-500 transition"
    >
      Login
    </button>
  );

  return (
    <nav className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-md fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {isLoggedIn && isDoctor() ? (
          <>
            <Link to="/doctor-dashboard" className="text-white text-2xl font-bold">
              Doctor<span className="text-indigo-500">App</span>
            </Link>
          </>
        ) : (
          <Link to="/" className="text-white text-2xl font-bold">
            Doctor<span className="text-indigo-500">App</span>
          </Link>
        )}

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {isLoggedIn ? <UserMenu /> : <LoginButton />}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800">
          <div className="flex flex-col items-center space-y-4 py-4">
            {isLoggedIn ? (
              <>
                <Link to="/profile" className="text-white hover:text-gray-200">
                  Your Profile
                </Link>
                {isPatient() && (
                  <Link to="/wallet" className="text-white hover:text-gray-200">
                    Wallet
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-white bg-indigo-600 px-4 py-2 rounded-md shadow hover:bg-indigo-500"
                >
                  Sign out
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-white bg-indigo-600 px-4 py-2 rounded-md shadow hover:bg-indigo-500"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}

      {/* Login Modal */}
      {isModalOpen && !isLoggedIn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full m-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <GoX size={20} />
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Login as
            </h3>
            <div className="space-y-4">
              <button
                onClick={() => handleChoice('doctor')}
                className="w-full py-3 px-6 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-lg shadow-lg"
              >
                Doctor
              </button>
              <button
                onClick={() => handleChoice('patient')}
                className="w-full py-3 px-6 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-lg"
              >
                Patient
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;