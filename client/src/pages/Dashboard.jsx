import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { MapPin, Clock, ThumbsUp, MessageCircle, Share2, AlertTriangle } from 'lucide-react';
import IncidentForm from '../components/IncidentForm';
import IncidentMap from '../components/IncidentMap';

export default function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('feed');
  const [showForm, setShowForm] = useState(false);

  const fetchIncidents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/incidents', {
        withCredentials: true
      });
      setIncidents(response.data);
    } catch (error) {
      toast.error('Failed to fetch incidents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'under investigation':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <span className="ml-2 text-xl font-semibold">Incident Feed</span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setView('feed')}
                className={`px-4 py-2 rounded-md ${
                  view === 'feed'
                    ? 'bg-red-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Feed
              </button>
              <button
                onClick={() => setView('map')}
                className={`px-4 py-2 rounded-md ${
                  view === 'map'
                    ? 'bg-red-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Map
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Create Post Button */}
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-white rounded-lg shadow p-4 mb-6 text-left hover:shadow-md transition-shadow"
        >
          <div className="flex items-center text-gray-500">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span>Report an incident...</span>
          </div>
        </button>

        {/* Create Post Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Report Incident</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <IncidentForm
                onSuccess={() => {
                  fetchIncidents();
                  setShowForm(false);
                  toast.success('Incident reported successfully');
                }}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          </div>
        ) : view === 'feed' ? (
          <div className="space-y-6">
            {incidents.map((incident) => (
              <div key={incident.id} className="bg-white rounded-lg shadow">
                {/* Post Header */}
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="bg-red-100 rounded-full p-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Incident Report</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{new Date(incident.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(incident.status)}`}>
                      {incident.status}
                    </span>
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-4">
                  <p className="text-gray-800 mb-4">{incident.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>
                      {incident.latitude.toFixed(4)}, {incident.longitude.toFixed(4)}
                    </span>
                  </div>
                </div>

                {/* Post Actions */}
                <div className="flex items-center justify-around p-4 border-t">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-red-600">
                    <ThumbsUp className="h-5 w-5" />
                    <span>Support</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-red-600">
                    <MessageCircle className="h-5 w-5" />
                    <span>Comment</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-red-600">
                    <Share2 className="h-5 w-5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <IncidentMap incidents={incidents} />
          </div>
        )}
      </div>
    </div>
  );
}