import { MapPin, Clock, AlertCircle } from 'lucide-react';

export default function IncidentList({ incidents, onStatusChange }) {
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
    <div className="space-y-4">
      {incidents.map((incident) => (
        <div key={incident.id} className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="text-gray-900">{incident.description}</p>
              
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                <span>
                  {incident.latitude.toFixed(4)}, {incident.longitude.toFixed(4)}
                </span>
              </div>

              <div className="mt-1 flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>
                  {new Date(incident.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="ml-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(incident.status)}`}>
                {incident.status}
              </span>
            </div>
          </div>

          {onStatusChange && (
            <div className="mt-4 flex gap-2">
              <select
                value={incident.status}
                onChange={(e) => onStatusChange(incident.id, e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
              >
                <option value="under investigation">Under Investigation</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          )}
        </div>
      ))}

      {incidents.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No incidents</h3>
          <p className="mt-1 text-sm text-gray-500">
            No incidents have been reported yet.
          </p>
        </div>
      )}
    </div>
  );
}