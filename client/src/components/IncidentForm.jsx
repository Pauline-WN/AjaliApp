import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Camera, Video, MapPin } from 'lucide-react';
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

      setDescription('');
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting incident:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe the incident..."
        className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
        rows={4}
        required
      />

      <div className="h-[200px] rounded-lg overflow-hidden border border-gray-200">
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

      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <button
            type="button"
            className="flex items-center space-x-2 text-gray-600 hover:text-red-600"
          >
            <Camera className="h-5 w-5" />
            <span>Photo</span>
          </button>
          <button
            type="button"
            className="flex items-center space-x-2 text-gray-600 hover:text-red-600"
          >
            <Video className="h-5 w-5" />
            <span>Video</span>
          </button>
          <button
            type="button"
            className="flex items-center space-x-2 text-gray-600 hover:text-red-600"
          >
            <MapPin className="h-5 w-5" />
            <span>Location</span>
          </button>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Reporting...' : 'Report Incident'}
        </button>
      </div>
    </form>
  );
}