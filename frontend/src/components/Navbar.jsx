import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-emerald-700 text-white p-4">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Library Management System
        </Link>
        {/* Hamburger Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            {/* Icon for menu open/close */}
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>
        {/* Desktop Navigation Links */}
        <div className="hidden md:flex md:items-center md:space-x-4">
          {user ? (
            <>
              <Link to="/books">Books</Link>
              <Link to="/members">Members</Link>
              <Link to="/loans">Loans</Link>
              <Link to="/profile">Profile</Link>
              <button
                onClick={handleLogout}
                className="bg-white px-4 py-2 rounded hover:bg-gray-200 text-emerald-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link
                to="/register"
                className="bg-emerald-500 px-4 py-2 rounded hover:bg-emerald-600"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
      {/* Mobile Navigation Links */}
      {isOpen && (
        <div className="md:hidden">
          {user ? (
            <>
              <Link to="/books" className="block px-2 py-1">
                Books
              </Link>
              <Link to="/members" className="block px-2 py-1">
                Members
              </Link>
              <Link to="/loans" className="block px-2 py-1">
                Loans
              </Link>
              <Link to="/profile" className="block px-2 py-1">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-2 py-1 bg-white text-emerald-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block px-2 py-1">
                Login
              </Link>
              <Link to="/register" className="block px-2 py-1 bg-emerald-500">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
