
import React from 'react';
import { City } from '../types';

interface MapViewProps {
  city: City;
  weatherCondition: string;
}

const MapView: React.FC<MapViewProps> = ({ city, weatherCondition }) => {
  const getOverlayEffect = () => {
    const condition = weatherCondition.toLowerCase();
    if (condition.includes('rain')) return 'bg-blue-900 bg-opacity-20';
    if (condition.includes('cloud')) return 'bg-gray-500 bg-opacity-20';
    if (condition.includes('sun') || condition.includes('clear')) return 'bg-yellow-300 bg-opacity-10';
    return 'bg-black bg-opacity-10';
  };
    
  return (
    <div className="bg-black bg-opacity-40 p-4 rounded-lg shadow-2xl backdrop-blur-sm h-96">
      <h3 className="text-xl font-semibold mb-4 text-blue-300">Map View</h3>
      <div className="relative w-full h-full rounded-lg overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('https://picsum.photos/seed/map/800/600')" }}>
        <div className={`absolute inset-0 ${getOverlayEffect()} transition-colors duration-500`}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex flex-col items-center animate-pulse">
                <div className="bg-blue-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg mb-2 z-10">
                    {city.name}
                </div>
                <i className="fas fa-map-marker-alt text-red-500 text-5xl drop-shadow-lg"></i>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
