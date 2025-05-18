import React from 'react';
import { Plus, PenTool } from 'lucide-react';
import Loader from './Loader';

interface CreateRoomCardProps {
  roomName: string;
  setRoomName: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  error: string;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

const CreateRoomCard: React.FC<CreateRoomCardProps> = ({
  roomName,
  setRoomName,
  loading,
  error,
  onSubmit
}) => {
  return (
    <section className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden flex flex-col">
      <div className="p-6 border-b border-white/10 flex items-center gap-3">
        <div className="p-2 bg-purple-600/20 rounded-lg">
          <Plus className="w-5 h-5 text-purple-400" />
        </div>
        <h2 className="text-xl font-semibold tracking-tight">Create New Room</h2>
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex-grow">
          <form className="space-y-5" onSubmit={onSubmit}>
            <div>
              <label htmlFor="roomName" className="block text-sm font-medium text-blue-100/80 mb-1.5">
                Room Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="roomName"
                  placeholder="e.g., Weekly Design Meeting"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all text-white placeholder-blue-200/30"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <PenTool className="h-5 w-5 text-blue-300/50" />
                </div>
              </div>
            </div>

            {error && (
              <div className="py-3 px-4 rounded-lg bg-red-400/10 border border-red-400/20 text-red-300 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !roomName.trim()}
              className="w-full relative overflow-hidden group py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-white font-medium flex items-center justify-center"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-blue-400/0 group-hover:via-blue-400/20 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000"></span>
              <span className="flex items-center gap-2">
                {loading ? (
                  <>
                    <Loader />
                    <span>Creating Room...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>Create New Room</span>
                  </>
                )}
              </span>
            </button>
          </form>
        </div>
        
        <div className="mt-6 pt-6 border-t border-white/5">
          <div className="flex items-start gap-3">
            <div className="p-2 shrink-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
              <div className="w-6 h-6 flex items-center justify-center text-blue-300 animation-pulse">
                💡
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-100">Pro Tip</h4>
              <p className="text-xs text-blue-100/60 mt-1">
                Create separate rooms for different projects to keep your collaborative workspace organized.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateRoomCard;