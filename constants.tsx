
import React from 'react';
import { City } from './types';

export const INDIAN_CITIES: City[] = [
  { name: 'Mumbai', state: 'Maharashtra', country: 'India', lat: 19.0760, lon: 72.8777 },
  { name: 'Delhi', state: 'Delhi', country: 'India', lat: 28.7041, lon: 77.1025 },
  { name: 'Bangalore', state: 'Karnataka', country: 'India', lat: 12.9716, lon: 77.5946 },
  { name: 'Hyderabad', state: 'Telangana', country: 'India', lat: 17.3850, lon: 78.4867 },
  { name: 'Ahmedabad', state: 'Gujarat', country: 'India', lat: 23.0225, lon: 72.5714 },
  { name: 'Chennai', state: 'Tamil Nadu', country: 'India', lat: 13.0827, lon: 80.2707 },
  { name: 'Kolkata', state: 'West Bengal', country: 'India', lat: 22.5726, lon: 88.3639 },
  { name: 'Surat', state: 'Gujarat', country: 'India', lat: 21.1702, lon: 72.8311 },
  { name: 'Pune', state: 'Maharashtra', country: 'India', lat: 18.5204, lon: 73.8567 },
  { name: 'Jaipur', state: 'Rajasthan', country: 'India', lat: 26.9124, lon: 75.7873 },
  { name: 'Lucknow', state: 'Uttar Pradesh', country: 'India', lat: 26.8467, lon: 80.9462 },
  { name: 'Kanpur', state: 'Uttar Pradesh', country: 'India', lat: 26.4499, lon: 80.3319 },
  { name: 'Nagpur', state: 'Maharashtra', country: 'India', lat: 21.1458, lon: 79.0882 },
  { name: 'Indore', state: 'Madhya Pradesh', country: 'India', lat: 22.7196, lon: 75.8577 },
  { name: 'Thane', state: 'Maharashtra', country: 'India', lat: 19.2183, lon: 72.9781 },
  { name: 'Bhopal', state: 'Madhya Pradesh', country: 'India', lat: 23.2599, lon: 77.4126 },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', country: 'India', lat: 17.6868, lon: 83.2185 },
  { name: 'Patna', state: 'Bihar', country: 'India', lat: 25.5941, lon: 85.1376 },
  { name: 'Vadodara', state: 'Gujarat', country: 'India', lat: 22.3072, lon: 73.1812 },
  { name: 'Ghaziabad', state: 'Uttar Pradesh', country: 'India', lat: 28.6692, lon: 77.4538 },
];

export const getWeatherIcon = (condition: string): React.ReactElement => {
  const lowerCondition = condition.toLowerCase();
  if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle') || lowerCondition.includes('shower')) {
    return <i className="fas fa-cloud-showers-heavy text-blue-400"></i>;
  }
  if (lowerCondition.includes('thunderstorm')) {
    return <i className="fas fa-bolt text-yellow-400"></i>;
  }
  if (lowerCondition.includes('snow')) {
    return <i className="fas fa-snowflake text-white"></i>;
  }
  if (lowerCondition.includes('cloudy') || lowerCondition.includes('overcast')) {
    return <i className="fas fa-cloud text-gray-400"></i>;
  }
   if (lowerCondition.includes('partly cloudy') || lowerCondition.includes('few clouds')) {
    return <i className="fas fa-cloud-sun text-gray-300"></i>;
  }
  if (lowerCondition.includes('mist') || lowerCondition.includes('fog') || lowerCondition.includes('haze')) {
    return <i className="fas fa-smog text-gray-500"></i>;
  }
  if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) {
    return <i className="fas fa-sun text-yellow-400"></i>;
  }
  return <i className="fas fa-question-circle text-gray-500"></i>;
};
