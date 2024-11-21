import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import IncidentForm from '../components/IncidentForm';
import IncidentList from '../components/IncidentList';
import IncidentMap from '../components/IncidentMap';

export default function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list' or 'map'

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Report Incident</h2>
          <IncidentForm onSuccess={fetchIncidents} />
        </div>

        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Incidents</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setView('list')}
                className={`px-4 py-2 rounded-md ${
                  view === 'list'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setView('map')}
                className={`px-4 py-2 rounded-md ${
                  view === 'map'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Map View
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : view === 'list' ? (
            <IncidentList incidents={incidents} />
          ) : (
            <IncidentMap incidents={incidents} />
          )}
        </div>
      </div>
    </div>
  );
}