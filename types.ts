
export interface City {
  name: string;
  state: string;
  country: string;
  lat: number;
  lon: number;
}

export enum WeatherAPISource {
  OpenWeatherMap = 'OpenWeatherMap',
  WeatherAPI = 'WeatherAPI.com',
  TomorrowIO = 'Tomorrow.io',
  NASA = 'NASA',
}

export interface RawWeatherData {
  source: WeatherAPISource;
  temperature: number;
  condition: string;
}

export interface HourlyData {
  time: string; // "14:00"
  temp: number;
  precipChance: number;
  condition: string;
}

export interface DailyData {
  date: string; // "2024-07-28"
  day: string; // "Sunday"
  maxTemp: number;
  minTemp: number;
  condition: string;
}

export interface FusedWeatherData {
  lastUpdated: string;
  confidence: number;
  rawSources: RawWeatherData[];
  current: {
    temperature: number;
    condition: string;
    wind: {
      speed: number;
      gusts: number;
      direction: string;
    };
    airQuality: {
      aqi: number;
      pm25: number;
      pm10: number;
      no2: number;
    };
    humidity: number;
    precipitation: number;
    sunrise: string;
    sunset: string;
    uvIndex: number;
    visibility: number;
  };
  hourly: HourlyData[];
  daily: DailyData[];
}

export interface EventForecast {
    date: string;
    city: City;
    confidence: number;
    avgTemp: number;
    precipChance: number;
    condition: string;
    windSpeed: number;
    humidity: number;
    uvIndex: number;
    sunrise: string;
    sunset: string;
    tempAnomaly: {
        value: number;
        description: string;
    };
}
