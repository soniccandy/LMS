import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-emerald-700 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">Library Management System</Link>
      <div>
        {user ? (
          <>
            <Link to="/books" className="mr-4">Books</Link>
            <Link to="/members" className="mr-4">Members</Link>
            <Link to="/loans" className="mr-4">Loans</Link>
            <Link to="/profile" className="mr-4">Profile</Link>
            <button
              onClick={handleLogout}
              className="bg-white px-4 py-2 rounded hover:bg-gray-200 text-emerald-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4">Login</Link>
            <Link
              to="/register"
              className="bg-emerald-500 px-4 py-2 rounded hover:bg-emerald-600"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
