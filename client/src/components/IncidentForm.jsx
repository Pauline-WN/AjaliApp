import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Camera, Video, MapPin, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

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
  const [position, setPosition] = useState([-1.2921, 36.8219]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      id: uuidv4(),
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages([...images, ...newImages]);
  };

  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newVideos = files.map(file => ({
      id: uuidv4(),
      file,
      preview: URL.createObjectURL(file)
    }));
    setVideos([...videos, ...newVideos]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const removeVideo = (index) => {
    const newVideos = [...videos];
    URL.revokeObjectURL(newVideos[index].preview);
    newVideos.splice(index, 1);
    setVideos(newVideos);
  };

  const uploadMedia = async (incidentId, files, mediaType) => {
    const uploadPromises = files.map(async (media) => {
      const formData = new FormData();
      formData.append('file', media.file);
      
      try {
        await axios.post(
          `http://localhost:5000/incidents/${incidentId}/${mediaType}`,
          formData,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      } catch (error) {
        console.error(`Error uploading ${mediaType}:`, error);
        throw error;
      }
    });

    await Promise.all(uploadPromises);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First create the incident
      const response = await axios.post(
        'http://localhost:5000/incidents',
        {
          description,
          latitude: position[0],
          longitude: position[1],
          status: 'under investigation'
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const incidentId = response.data.id;

      // Upload images and videos if any
      if (images.length > 0) {
        await uploadMedia(incidentId, images, 'image');
      }

      if (videos.length > 0) {
        await uploadMedia(incidentId, videos, 'video');
      }

      // Clear form
      setDescription('');
      setImages([]);
      setVideos([]);
      
      // Notify success
      toast.success('Incident reported successfully');
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting incident:', error);
      toast.error(error.response?.data?.message || 'Failed to report incident');
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

      {/* Media Previews */}
      {(images.length > 0 || videos.length > 0) && (
        <div className="grid grid-cols-2 gap-4">
          {images.map((image, index) => (
            <div key={image.id} className="relative">
              <img
                src={image.preview}
                alt={`Upload ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          {videos.map((video, index) => (
            <div key={video.id} className="relative">
              <video
                src={video.preview}
                className="w-full h-32 object-cover rounded-lg"
                controls
              />
              <button
                type="button"
                onClick={() => removeVideo(index)}
                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

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
          <label className="cursor-pointer flex items-center space-x-2 text-gray-600 hover:text-red-600">
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />
            <Camera className="h-5 w-5" />
            <span>Photo</span>
          </label>
          <label className="cursor-pointer flex items-center space-x-2 text-gray-600 hover:text-red-600">
            <input
              type="file"
              accept="video/*"
              multiple
              className="hidden"
              onChange={handleVideoUpload}
            />
            <Video className="h-5 w-5" />
            <span>Video</span>
          </label>
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="h-5 w-5" />
            <span>Location set</span>
          </div>
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