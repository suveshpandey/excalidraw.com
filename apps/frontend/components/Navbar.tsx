import React from 'react';
import { MousePointerSquareDashed, LogOutIcon, Settings, User } from 'lucide-react';

interface NavbarProps {
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  return (
    <header className="py-4">
      <nav className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-lg opacity-20 rounded-full"></div>
            <MousePointerSquareDashed className="h-8 w-8 text-blue-400 relative z-10" />
          </div>
          <span className="ml-3 font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200 cursor-pointer">
            Excaliboard
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="p-2.5 text-blue-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all duration-200 cursor-pointer">
            <User className="h-5 w-5" />
          </button>
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-white/5 hover:bg-white/10 rounded-full transition-all duration-200 cursor-pointer border border-white/10"
          >
            <span>Logout</span>
            <LogOutIcon className="h-4 w-4" />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;