import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default function IncidentMap({ incidents }) {
  const defaultCenter = [-1.2921, 36.8219]; // Nairobi coordinates

  return (
    <div className="h-[400px] rounded-lg overflow-hidden shadow-md">
      <MapContainer
        center={defaultCenter}
        zoom={12}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {incidents.map((incident) => (
          <Marker
            key={incident.id}
            position={[incident.latitude, incident.longitude]}
          >
            <Popup>
              <div className="p-2">
                <p className="font-medium">{incident.description}</p>
                <p className="text-sm text-gray-500">
                  Status: {incident.status}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}