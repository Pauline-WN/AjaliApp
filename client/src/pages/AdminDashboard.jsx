import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import IncidentList from '../components/IncidentList';

export default function AdminDashboard() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/incidents/${id}`, {
        status
      }, { withCredentials: true });
      
      toast.success('Status updated successfully');
      fetchIncidents();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">All Incidents</h2>
      
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <IncidentList 
          incidents={incidents}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}