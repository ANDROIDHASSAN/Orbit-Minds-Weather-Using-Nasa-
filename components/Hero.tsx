
import React, { useState, useCallback } from 'react';
import { City } from '../types';

interface HeroProps {
  onCitySelect: (city: City) => void;
  searchCities: (query: string) => Promise<City[]>;
}

const Hero: React.FC<HeroProps> = ({ onCitySelect, searchCities }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<City[]>([]);

  const handleSearch = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 2) {
      const results = await searchCities(value);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  }, [searchCities]);

  const handleSelect = (city: City) => {
    setQuery('');
    setSuggestions([]);
    onCitySelect(city);
  };

  return (
    <div className="bg-black bg-opacity-40 p-6 rounded-lg shadow-2xl backdrop-blur-sm">
      <h2 className="text-3xl font-bold mb-4 text-blue-300">Multi-API Weather Intelligence</h2>
      <p className="mb-6 text-gray-300">Search any city in India for the most accurate, NASA-calibrated forecast.</p>
      <div className="relative">
        <div className="flex items-center bg-gray-800 rounded-lg shadow-inner">
           <i className="fas fa-search text-gray-400 pl-4"></i>
           <input
             type="text"
             value={query}
             onChange={handleSearch}
             placeholder="e.g., Mumbai, Bangalore..."
             className="w-full p-4 bg-transparent focus:outline-none"
           />
        </div>
        {suggestions.length > 0 && (
          <ul className="absolute z-10 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
            {suggestions.map((city, index) => (
              <li
                key={`${city.name}-${index}`}
                onClick={() => handleSelect(city)}
                className="px-4 py-3 cursor-pointer hover:bg-blue-600 transition-colors duration-200"
              >
                {city.name}, {city.state}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Hero;
