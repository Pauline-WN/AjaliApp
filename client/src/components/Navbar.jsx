import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-red-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <AlertTriangle className="h-8 w-8" />
            <span className="text-xl font-bold">Ajali!</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-red-100">Dashboard</Link>
                {user.isAdmin && (
                  <Link to="/admin" className="hover:text-red-100">Admin</Link>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-red-100"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded-md"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}