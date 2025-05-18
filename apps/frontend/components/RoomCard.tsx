import React from 'react';
import { ExternalLink, Users } from 'lucide-react';

interface RoomProps {
  room: {
    id: number;
    slug: string;
    crreatedAt: string;
    adminId: string;
  };
  onJoin: (roomId: number) => void;
}

const RoomCard: React.FC<RoomProps> = ({ room, onJoin }) => {
  // Format the creation date to be more readable
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      }).format(date);
    } catch (e) {
      return 'Recently';
    }
  };

  return (
    <div className="p-4 group hover:bg-white/5 transition-all duration-200">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <span className="absolute w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-white/10">
              {room.slug.charAt(0).toUpperCase()}
            </div>
          </div>
          <div>
            <h3 className="font-medium text-white group-hover:text-blue-300 transition-colors duration-200">{room.slug}</h3>
            <p className="text-xs text-blue-100/50">Created {formatDate(room.crreatedAt)}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 border border-white/10 flex items-center justify-center text-xs">
              <Users className="w-3.5 h-3.5 text-blue-300" />
            </div>
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 border border-white/10 flex items-center justify-center text-xs">
              <span className="text-blue-300">3</span>
            </div>
          </div> */}
          <button
            onClick={() => onJoin(room.id)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 border border-blue-500/20 cursor-pointer transition-colors duration-200"
          >
            <span>Join</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;