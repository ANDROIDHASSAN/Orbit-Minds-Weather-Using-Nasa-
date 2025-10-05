
import React from 'react';
import { City, FusedWeatherData, HourlyData, DailyData } from '../types';
import { getWeatherIcon } from '../constants';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

interface InfoCardProps {
  icon: string;
  title: string;
  value: string | number;
  unit?: string;
  children?: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, value, unit, children }) => (
  <div className="bg-black bg-opacity-40 p-4 rounded-lg flex flex-col justify-between">
    <div>
      <div className="flex items-center text-gray-400 mb-2">
        <i className={`fas ${icon} mr-2`}></i>
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <div className="text-2xl font-bold">
        {value} <span className="text-lg font-normal text-gray-300">{unit}</span>
      </div>
    </div>
    {children && <div className="mt-2">{children}</div>}
  </div>
);

interface WeatherDashboardProps {
  weatherData: FusedWeatherData;
  city: City;
  summary: string;
}

const WeatherDashboard: React.FC<WeatherDashboardProps> = ({ weatherData, city, summary }) => {
  const { current, hourly, daily, rawSources, confidence, lastUpdated } = weatherData;

  const chartData = hourly.slice(0, 12).map(h => ({
      name: h.time.substring(0, 5),
      Temperature: h.temp,
      'Precipitation (%)': h.precipChance,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-black bg-opacity-40 p-4 rounded-lg shadow-2xl backdrop-blur-sm">
        <h2 className="text-3xl font-bold">{city.name}, {city.state}</h2>
        <p className="text-gray-400">Last updated: {lastUpdated}</p>
      </div>

      {/* Main Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-black bg-opacity-40 p-6 rounded-lg flex flex-col items-center justify-center text-center">
            <div className="text-8xl">{getWeatherIcon(current.condition)}</div>
            <p className="text-5xl font-bold">{current.temperature}°C</p>
            <p className="text-xl text-gray-300">{current.condition}</p>
        </div>
        <div className="md:col-span-2 bg-black bg-opacity-40 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2 text-blue-300">TerraCast Summary</h3>
            <p className="text-gray-200 mb-4">{summary}</p>
             <div className="flex justify-between items-center border-t border-gray-700 pt-4">
                <div>
                    <span className="text-gray-400">Confidence Score:</span>
                    <span className="text-2xl font-bold ml-2 text-green-400">{confidence}%</span>
                </div>
                <div className="text-right">
                    <p className="text-gray-400">Raw Data Sources:</p>
                    <div className="flex space-x-4">
                    {rawSources.map(s => (
                        <div key={s.source} className="text-sm">
                            <span className="font-semibold">{s.source.replace('.com', '')}: </span>
                            <span>{s.temperature}°C</span>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
      
      {/* Hourly Forecast Chart */}
      <div className="bg-black bg-opacity-40 p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Hourly Forecast (Next 12 Hours)</h3>
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                <XAxis dataKey="name" stroke="#A0AEC0" />
                <YAxis yAxisId="left" stroke="#A0AEC0" label={{ value: '°C', angle: -90, position: 'insideLeft', fill: '#A0AEC0' }} />
                <YAxis yAxisId="right" orientation="right" stroke="#63B3ED" label={{ value: '%', angle: -90, position: 'insideRight', fill: '#63B3ED' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="Temperature" stroke="#F6E05E" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="Precipitation (%)" stroke="#63B3ED" strokeWidth={2} />
            </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <InfoCard icon="fa-wind" title="Wind" value={current.wind.speed} unit="km/h">
            <p className="text-sm text-gray-400">Gusts: {current.wind.gusts} km/h</p>
            <p className="text-sm text-gray-400">Direction: {current.wind.direction}</p>
        </InfoCard>
        <InfoCard icon="fa-smog" title="Air Quality" value={current.airQuality.aqi} unit="AQI">
            <p className="text-xs text-gray-400">PM2.5: {current.airQuality.pm25}</p>
        </InfoCard>
        <InfoCard icon="fa-tint" title="Humidity" value={current.humidity} unit="%" />
        <InfoCard icon="fa-sun" title="UV Index" value={current.uvIndex} />
        <InfoCard icon="fa-cloud-rain" title="Precipitation" value={current.precipitation} unit="mm" />
        <InfoCard icon="fa-eye" title="Visibility" value={current.visibility} unit="km" />
        <InfoCard icon="fa-sunrise" title="Sunrise" value={current.sunrise} />
        <InfoCard icon="fa-sunset" title="Sunset" value={current.sunset} />
      </div>

      {/* Daily Forecast */}
      <div className="bg-black bg-opacity-40 p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">10-Day Forecast</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {daily.map(day => (
                <div key={day.date} className="text-center bg-gray-800 bg-opacity-50 p-3 rounded-lg">
                    <p className="font-semibold">{day.day.substring(0,3)}</p>
                    <div className="text-3xl my-2">{getWeatherIcon(day.condition)}</div>
                    <p>{day.maxTemp}° / {day.minTemp}°</p>
                </div>
            ))}
        </div>
      </div>

    </div>
  );
};

export default WeatherDashboard;
