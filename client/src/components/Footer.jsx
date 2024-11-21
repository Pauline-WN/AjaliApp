import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <span className="text-xl font-bold text-gray-900">Ajali!</span>
            </Link>
            <p className="mt-2 text-sm text-gray-500">
              Making emergency response faster and more efficient across Kenya.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Quick Links</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/register" className="text-base text-gray-500 hover:text-gray-900">
                  Report Incident
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-base text-gray-500 hover:text-gray-900">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Emergency</h3>
            <ul className="mt-4 space-y-4">
              <li className="text-base text-gray-500">
                Police: <span className="font-semibold">999</span>
              </li>
              <li className="text-base text-gray-500">
                Ambulance: <span className="font-semibold">112</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Contact</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="mailto:support@ajali.com" className="text-base text-gray-500 hover:text-gray-900">
                  support@ajali.com
                </a>
              </li>
              <li className="text-base text-gray-500">
                Nairobi, Kenya
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-base text-gray-400 text-center">
            © {new Date().getFullYear()} Ajali! All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}