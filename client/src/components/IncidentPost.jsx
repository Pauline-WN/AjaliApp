import { useState } from 'react';
import { MapPin, Clock, ThumbsUp, MessageCircle, Share2, AlertTriangle, Send, Image as ImageIcon, Video } from 'lucide-react';

export default function IncidentPost({ incident }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);

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

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      setComments([...comments, { text: comment, timestamp: new Date() }]);
      setComment('');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'Incident Report',
        text: incident.description,
        url: window.location.href,
      });
    } catch (error) {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const getMediaUrl = (url) => {
    return `http://localhost:5000${url}`;
  };

  return (
    <div className="bg-white rounded-lg shadow">
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
        
        {/* Media Grid */}
        {(incident.images?.length > 0 || incident.videos?.length > 0) && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {incident.images?.map((image, index) => (
              <div
                key={`image-${index}`}
                className="relative cursor-pointer aspect-video bg-gray-100 rounded-lg overflow-hidden"
                onClick={() => setSelectedMedia({ type: 'image', url: getMediaUrl(image.image_url) })}
              >
                <img
                  src={getMediaUrl(image.image_url)}
                  alt={`Evidence ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 rounded-full p-1">
                  <ImageIcon className="h-4 w-4 text-white" />
                </div>
              </div>
            ))}
            {incident.videos?.map((video, index) => (
              <div
                key={`video-${index}`}
                className="relative cursor-pointer aspect-video bg-gray-100 rounded-lg overflow-hidden"
                onClick={() => setSelectedMedia({ type: 'video', url: getMediaUrl(video.video_url) })}
              >
                <video
                  src={getMediaUrl(video.video_url)}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 rounded-full p-1">
                  <Video className="h-4 w-4 text-white" />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-1" />
          <span>
            {incident.latitude.toFixed(4)}, {incident.longitude.toFixed(4)}
          </span>
        </div>
      </div>

      {/* Media Modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <div className="max-w-4xl max-h-[90vh] w-full">
            {selectedMedia.type === 'image' ? (
              <img
                src={selectedMedia.url}
                alt="Evidence"
                className="w-full h-full object-contain"
              />
            ) : (
              <video
                src={selectedMedia.url}
                controls
                className="w-full h-full"
                autoPlay
              />
            )}
          </div>
        </div>
      )}

      {/* Interaction Stats */}
      {(likesCount > 0 || comments.length > 0) && (
        <div className="px-4 py-2 border-t">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {likesCount > 0 && (
              <div className="flex items-center">
                <ThumbsUp className="h-4 w-4 mr-1 text-red-600" />
                <span>{likesCount}</span>
              </div>
            )}
            {comments.length > 0 && (
              <button 
                onClick={() => setShowComments(!showComments)}
                className="hover:text-gray-700"
              >
                {comments.length} comments
              </button>
            )}
          </div>
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-around p-4 border-t">
        <button 
          onClick={handleLike}
          className={`flex items-center space-x-2 ${
            isLiked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
          }`}
        >
          <ThumbsUp className="h-5 w-5" />
          <span>Support</span>
        </button>
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 text-gray-600 hover:text-red-600"
        >
          <MessageCircle className="h-5 w-5" />
          <span>Comment</span>
        </button>
        <button 
          onClick={handleShare}
          className="flex items-center space-x-2 text-gray-600 hover:text-red-600"
        >
          <Share2 className="h-5 w-5" />
          <span>Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="p-4 border-t space-y-4">
          {/* Comment List */}
          <div className="space-y-3">
            {comments.map((comment, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="bg-gray-100 rounded-full p-2">
                  <AlertTriangle className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1 bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-800">{comment.text}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {comment.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Comment Input */}
          <form onSubmit={handleComment} className="flex items-center space-x-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="p-2 text-red-600 hover:text-red-700"
              disabled={!comment.trim()}
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}