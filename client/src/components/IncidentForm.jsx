import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { toast } from 'react-hot-toast';
import axios from 'axios';

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function IncidentForm({ onSuccess }) {
  const [description, setDescription] = useState('');
  const [position, setPosition] = useState([-1.2921, 36.8219]); // Default to Nairobi
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/incidents', {
        description,
        latitude: position[0],
        longitude: position[1],
      }, { withCredentials: true });

      toast.success('Incident reported successfully');
      setDescription('');
      onSuccess?.();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to report incident');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Incident Description
        </label>
        <textarea
          id="description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
          placeholder="Describe the incident..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Click on the map to set incident location
        </label>
        <div className="h-[300px] rounded-lg overflow-hidden">
          <MapContainer
            center={position}
            zoom={13}
            className="h-full w-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker position={position} setPosition={setPosition} />
          </MapContainer>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
      >
        {loading ? 'Reporting...' : 'Report Incident'}
      </button>
    </form>
  );
}