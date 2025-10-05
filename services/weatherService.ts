
import { City, FusedWeatherData, EventForecast, WeatherAPISource, RawWeatherData, HourlyData, DailyData } from '../types';
import { INDIAN_CITIES } from '../constants';

// Fuzzy search for cities
export const searchCities = async (query: string): Promise<City[]> => {
  if (!query) return [];
  const lowerCaseQuery = query.toLowerCase();
  return INDIAN_CITIES.filter(city =>
    city.name.toLowerCase().includes(lowerCaseQuery) ||
    city.state.toLowerCase().includes(lowerCaseQuery)
  ).slice(0, 5);
};

// Mock data generation
const generateMockData = (city: City): FusedWeatherData => {
  const baseTemp = 20 + (city.lat > 20 ? 5 : 0) + (Math.random() * 10);
  const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Thunderstorm', 'Haze'];
  const currentCondition = conditions[Math.floor(Math.random() * conditions.length)];

  const rawSources: RawWeatherData[] = [
    { source: WeatherAPISource.OpenWeatherMap, temperature: Math.round(baseTemp + (Math.random() * 2 - 1)), condition: currentCondition },
    { source: WeatherAPISource.WeatherAPI, temperature: Math.round(baseTemp + (Math.random() * 2 - 1)), condition: conditions[Math.floor(Math.random() * conditions.length)] },
    { source: WeatherAPISource.TomorrowIO, temperature: Math.round(baseTemp + (Math.random() * 2 - 1)), condition: conditions[Math.floor(Math.random() * conditions.length)] },
    { source: WeatherAPISource.NASA, temperature: Math.round(baseTemp + (Math.random() * 0.5 - 0.25)), condition: currentCondition },
  ];

  const fusedTemp = Math.round(rawSources.reduce((sum, s) => sum + s.temperature, 0) / rawSources.length);
  
  const hourly: HourlyData[] = Array.from({ length: 24 }, (_, i) => {
    const hour = new Date();
    hour.setHours(hour.getHours() + i);
    return {
      time: hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      temp: Math.round(fusedTemp - Math.sin(i / 12 * Math.PI) * 5 + (Math.random() * 2 - 1)),
      precipChance: Math.max(0, Math.min(100, Math.round(currentCondition.includes('Rain') ? 40 + Math.random() * 40 : Math.random() * 30 - 10))),
      condition: conditions[Math.floor(Math.random() * conditions.length)]
    };
  });
  
  const daily: DailyData[] = Array.from({ length: 10 }, (_, i) => {
     const date = new Date();
     date.setDate(date.getDate() + i);
     const dayTemp = fusedTemp + (Math.random() * 4 - 2);
     return {
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'long' }),
        maxTemp: Math.round(dayTemp + 4),
        minTemp: Math.round(dayTemp - 4),
        condition: conditions[Math.floor(Math.random() * conditions.length)]
     };
  });

  return {
    lastUpdated: new Date().toLocaleTimeString(),
    confidence: 85 + Math.round(Math.random() * 10),
    rawSources,
    current: {
      temperature: fusedTemp,
      condition: currentCondition,
      wind: {
        speed: 5 + Math.round(Math.random() * 15),
        gusts: 15 + Math.round(Math.random() * 20),
        direction: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
      },
      airQuality: {
        aqi: 20 + Math.round(Math.random() * 150),
        pm25: 15 + Math.round(Math.random() * 100),
        pm10: 20 + Math.round(Math.random() * 120),
        no2: 10 + Math.round(Math.random() * 50),
      },
      humidity: 40 + Math.round(Math.random() * 50),
      precipitation: currentCondition.includes('Rain') ? Math.round(Math.random() * 10) : 0,
      sunrise: "06:05 AM",
      sunset: "07:15 PM",
      uvIndex: 3 + Math.round(Math.random() * 8),
      visibility: 5 + Math.round(Math.random() * 10),
    },
    hourly,
    daily,
  };
};


export const getWeatherForCity = async (city: City): Promise<FusedWeatherData> => {
  // Simulate network delay
  await new Promise(res => setTimeout(res, 500 + Math.random() * 500));
  return generateMockData(city);
};

export const getEventForecast = async (city: City, date: string): Promise<EventForecast> => {
  // Simulate network delay
  await new Promise(res => setTimeout(res, 500 + Math.random() * 500));
  const baseTemp = 15 + (city.lat > 20 ? 5 : 0) + (Math.random() * 15);
  const conditions = ['Sunny', 'Clear Skies', 'Chance of Showers', 'Overcast', 'Windy'];
  
  return {
    date: new Date(date).toDateString(),
    city,
    confidence: 60 + Math.floor(Math.random() * 25),
    avgTemp: Math.round(baseTemp),
    precipChance: Math.floor(Math.random() * 40),
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    windSpeed: 10 + Math.floor(Math.random() * 15),
    humidity: 30 + Math.floor(Math.random() * 60),
    uvIndex: 2 + Math.floor(Math.random() * 7),
    sunrise: "06:15 AM",
    sunset: "07:00 PM",
    tempAnomaly: {
        value: Math.round((Math.random() * 4 - 2) * 10) / 10,
        description: Math.random() > 0.5 ? "Warmer than average" : "Cooler than average"
    }
  };
};
