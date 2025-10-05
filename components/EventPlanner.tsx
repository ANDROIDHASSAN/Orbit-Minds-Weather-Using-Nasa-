
import React, { useState, useCallback } from 'react';
import { City, EventForecast } from '../types';
import { getWeatherIcon } from '../constants';

interface EventPlannerProps {
  onEventSearch: (city: City, date: string) => void;
  searchCities: (query: string) => Promise<City[]>;
  eventForecast?: EventForecast | null;
  summary?: string;
  city?: City;
}

const EventPlanner: React.FC<EventPlannerProps> = ({ onEventSearch, searchCities, eventForecast, summary, city }) => {
  const [query, setQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<City | null>(city || null);
  const [date, setDate] = useState<string>(new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]);
  const [suggestions, setSuggestions] = useState<City[]>([]);

  const handleSearchChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedCity(null);
    if (value.length > 2) {
      const results = await searchCities(value);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  }, [searchCities]);

  const handleCitySelect = (city: City) => {
    setQuery(city.name);
    setSelectedCity(city);
    setSuggestions([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCity && date) {
      onEventSearch(selectedCity, date);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-black bg-opacity-40 p-6 rounded-lg shadow-2xl backdrop-blur-sm">
        <h2 className="text-3xl font-bold mb-4 text-blue-300">Plan an Event</h2>
        <p className="mb-6 text-gray-300">Get a long-range, NASA-calibrated forecast for your future event.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="flex items-center bg-gray-800 rounded-lg shadow-inner">
              <i className="fas fa-search text-gray-400 pl-4"></i>
              <input
                type="text"
                value={query}
                onChange={handleSearchChange}
                placeholder="Search for a city..."
                className="w-full p-4 bg-transparent focus:outline-none"
              />
            </div>
            {suggestions.length > 0 && (
              <ul className="absolute z-10 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                {suggestions.map((city) => (
                  <li
                    key={city.name}
                    onClick={() => handleCitySelect(city)}
                    className="px-4 py-3 cursor-pointer hover:bg-blue-600 transition-colors duration-200"
                  >
                    {city.name}, {city.state}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
              className="w-full p-4 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button type="submit" disabled={!selectedCity || !date} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors">
            Get Event Forecast
          </button>
        </form>
      </div>

      {eventForecast && (
        <div className="bg-black bg-opacity-60 p-6 rounded-lg shadow-2xl backdrop-blur-md animate-fade-in">
          <h3 className="text-2xl font-bold">Forecast for {eventForecast.city.name}</h3>
          <p className="text-lg text-gray-300 mb-4">{eventForecast.date}</p>

          <div className="text-center mb-6">
             <div className="text-7xl mb-2">{getWeatherIcon(eventForecast.condition)}</div>
             <p className="text-4xl font-bold">{eventForecast.avgTemp}°C</p>
             <p className="text-xl text-gray-300">{eventForecast.condition}</p>
          </div>

          <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg mb-6">
            <h4 className="font-semibold text-blue-300">AI Summary</h4>
            <p className="text-gray-200">{summary}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
            <div className="bg-gray-800 p-3 rounded-lg">
                <p className="text-sm text-gray-400">Confidence</p>
                <p className="text-2xl font-bold text-green-400">{eventForecast.confidence}%</p>
            </div>
             <div className="bg-gray-800 p-3 rounded-lg">
                <p className="text-sm text-gray-400">Precipitation</p>
                <p className="text-2xl font-bold">{eventForecast.precipChance}%</p>
            </div>
             <div className="bg-gray-800 p-3 rounded-lg">
                <p className="text-sm text-gray-400">Wind</p>
                <p className="text-2xl font-bold">{eventForecast.windSpeed} km/h</p>
            </div>
             <div className="bg-gray-800 p-3 rounded-lg">
                <p className="text-sm text-gray-400">Humidity</p>
                <p className="text-2xl font-bold">{eventForecast.humidity}%</p>
            </div>
             <div className="bg-gray-800 p-3 rounded-lg">
                <p className="text-sm text-gray-400">UV Index</p>
                <p className="text-2xl font-bold">{eventForecast.uvIndex}</p>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
                <p className="text-sm text-gray-400">Temp Anomaly</p>
                <p className={`text-2xl font-bold ${eventForecast.tempAnomaly.value > 0 ? 'text-red-400' : 'text-blue-400'}`}>
                    {eventForecast.tempAnomaly.value > 0 ? '+' : ''}{eventForecast.tempAnomaly.value}°C
                </p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default EventPlanner;

