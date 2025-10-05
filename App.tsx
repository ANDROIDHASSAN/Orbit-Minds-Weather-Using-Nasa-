
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { City, FusedWeatherData, EventForecast } from './types';
import { searchCities, getWeatherForCity, getEventForecast } from './services/weatherService';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WeatherDashboard from './components/WeatherDashboard';
import EventPlanner from './components/EventPlanner';
import MapView from './components/MapView';

// Mock process.env
const process = {
  env: {
    API_KEY: 'YOUR_GEMINI_API_KEY_HERE', // Replace with your actual key if running locally
  }
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'event'>('dashboard');
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [weatherData, setWeatherData] = useState<FusedWeatherData | null>(null);
  const [eventForecast, setEventForecast] = useState<EventForecast | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

  const generateSummary = useCallback(async (data: FusedWeatherData | EventForecast, type: 'current' | 'event') => {
    if (!ai) {
      if (type === 'current') return "AI summary unavailable. Light showers expected this afternoon.";
      else return "AI summary unavailable. Plan for a mix of sun and clouds for your event.";
    }
    
    setIsLoading(true);
    try {
      const prompt = type === 'current'
        ? `Generate a short, human-readable weather summary for ${selectedCity?.name}. Data: ${JSON.stringify(data)}. Mention key events like rain, high wind, or significant temperature changes.`
        : `Generate a short, human-readable weather forecast for an event in ${selectedCity?.name} on ${ (data as EventForecast).date }. Data: ${JSON.stringify(data)}. Provide actionable advice.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setSummary(response.text);
    } catch (e) {
      console.error("Error generating summary:", e);
      setSummary("Could not generate AI summary.");
    } finally {
      setIsLoading(false);
    }
  }, [ai, selectedCity]);

  const handleCitySelect = useCallback(async (city: City) => {
    setSelectedCity(city);
    setCurrentView('dashboard');
    setIsLoading(true);
    setError(null);
    setWeatherData(null);
    setSummary('');

    try {
      const data = await getWeatherForCity(city);
      setWeatherData(data);
      await generateSummary(data, 'current');
    } catch (e) {
      setError("Failed to fetch weather data.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [generateSummary]);

  const handleEventSearch = useCallback(async (city: City, date: string) => {
    setSelectedCity(city);
    setIsLoading(true);
    setError(null);
    setEventForecast(null);
    setSummary('');
    try {
      const data = await getEventForecast(city, date);
      setEventForecast(data);
      await generateSummary(data, 'event');
    } catch (e) {
      setError("Failed to fetch event forecast.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [generateSummary]);
  
  const getBackgroundImage = () => {
    const weatherCondition = weatherData?.current?.condition.toLowerCase() || 'clear';
    if (weatherCondition.includes('rain') || weatherCondition.includes('shower')) {
      return 'https://picsum.photos/seed/rain/1920/1080';
    }
    if (weatherCondition.includes('cloud')) {
      return 'https://picsum.photos/seed/cloudy/1920/1080';
    }
    if (weatherCondition.includes('snow')) {
      return 'https://picsum.photos/seed/snow/1920/1080';
    }
     if (weatherCondition.includes('sun') || weatherCondition.includes('clear')) {
      return 'https://picsum.photos/seed/sunny/1920/1080';
    }
    return 'https://picsum.photos/seed/weather/1920/1080';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans transition-colors duration-500" style={{ backgroundImage: `url(${selectedCity ? getBackgroundImage() : 'https://picsum.photos/seed/earth/1920/1080'})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div className="min-h-screen bg-black bg-opacity-60 backdrop-blur-sm">
        <Navbar currentView={currentView} setCurrentView={setCurrentView} />
        <main className="container mx-auto p-4 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
              {currentView === 'dashboard' ? (
                <Hero onCitySelect={handleCitySelect} searchCities={searchCities} />
              ) : (
                <EventPlanner onEventSearch={handleEventSearch} searchCities={searchCities} />
              )}
               {selectedCity && <MapView city={selectedCity} weatherCondition={weatherData?.current.condition || ''} />}
            </div>
            <div className="lg:col-span-2">
              {isLoading && (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}
              {error && <div className="text-red-500 text-center">{error}</div>}
              
              {!isLoading && !error && currentView === 'dashboard' && weatherData && selectedCity && (
                <WeatherDashboard weatherData={weatherData} city={selectedCity} summary={summary} />
              )}
              
              {!isLoading && !error && currentView === 'event' && eventForecast && selectedCity && (
                 <EventPlanner 
                    onEventSearch={handleEventSearch} 
                    searchCities={searchCities}
                    eventForecast={eventForecast}
                    summary={summary}
                    city={selectedCity}
                 />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
