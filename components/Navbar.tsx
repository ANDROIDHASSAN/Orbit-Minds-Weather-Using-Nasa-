
import React from 'react';

interface NavbarProps {
  currentView: 'dashboard' | 'event';
  setCurrentView: (view: 'dashboard' | 'event') => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView }) => {
  const activeClasses = 'bg-blue-600 text-white';
  const inactiveClasses = 'bg-gray-700 hover:bg-gray-600';

  return (
    <nav className="bg-black bg-opacity-30 backdrop-blur-md p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <i className="fas fa-satellite-dish text-3xl text-blue-400"></i>
          <h1 className="text-2xl font-bold tracking-wider">TerraCast</h1>
        </div>
        <div className="flex space-x-2 rounded-lg p-1 bg-gray-800">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-300 ${currentView === 'dashboard' ? activeClasses : inactiveClasses}`}
          >
            <i className="fas fa-tachometer-alt mr-2"></i>Dashboard
          </button>
          <button 
            onClick={() => setCurrentView('event')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-300 ${currentView === 'event' ? activeClasses : inactiveClasses}`}
          >
            <i className="fas fa-calendar-alt mr-2"></i>Plan Event
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
