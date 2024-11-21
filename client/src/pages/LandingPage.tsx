import { Link } from 'react-router-dom';
import { AlertTriangle, Shield, Clock, MapPin } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1587574293340-e0011c4e8ecf?auto=format&fit=crop&q=80"
            alt="Emergency Response"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Report Incidents</span>
              <span className="block text-red-600">Save Lives</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Ajali! enables citizens to report accidents and emergencies in real-time, connecting them directly with first responders and authorities.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 md:text-lg"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-red-600 bg-white hover:bg-gray-50 md:text-lg"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-600 text-white">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Quick Reporting</h3>
              <p className="mt-2 text-base text-gray-500">
                Report incidents quickly and easily with our intuitive interface
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-600 text-white">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Precise Location</h3>
              <p className="mt-2 text-base text-gray-500">
                Automatically capture and share accurate location information
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-600 text-white">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Real-time Updates</h3>
              <p className="mt-2 text-base text-gray-500">
                Get instant updates on the status of your reported incidents
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}