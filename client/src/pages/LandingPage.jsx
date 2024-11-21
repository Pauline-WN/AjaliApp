import { Link } from 'react-router-dom';
import { AlertTriangle, Shield, Clock, MapPin, Users, Bell, CheckCircle, Phone } from 'lucide-react';

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
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Why Choose Ajali!</h2>
            <p className="mt-4 text-lg text-gray-500">Our platform is designed to make emergency reporting quick, easy, and effective.</p>
          </div>
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

      {/* How It Works Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-500">Simple steps to report and track incidents</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="relative">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-600 text-white">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Create Account</h3>
                <p className="mt-2 text-base text-gray-500 text-center">
                  Sign up for a free account to start reporting incidents
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-600 text-white">
                  <Bell className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Report Incident</h3>
                <p className="mt-2 text-base text-gray-500 text-center">
                  Provide incident details and location information
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-600 text-white">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Authority Review</h3>
                <p className="mt-2 text-base text-gray-500 text-center">
                  Authorities verify and respond to the incident
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-600 text-white">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Resolution</h3>
                <p className="mt-2 text-base text-gray-500 text-center">
                  Track the incident status until resolution
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-red-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-red-100">Join us in making our communities safer.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-red-600 bg-white hover:bg-red-50"
              >
                Get Started
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-700 hover:bg-red-800"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Emergency Contacts</h2>
            <p className="mt-4 text-lg text-gray-500">For immediate assistance, contact emergency services</p>
            <div className="mt-8 flex justify-center space-x-8">
              <div className="flex items-center">
                <Phone className="h-6 w-6 text-red-600 mr-2" />
                <span className="text-xl font-semibold">999</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-6 w-6 text-red-600 mr-2" />
                <span className="text-xl font-semibold">112</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}