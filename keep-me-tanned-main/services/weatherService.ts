import { WeatherData } from '../types';

export const fetchWeatherData = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&wind_speed_unit=ms`
    );

    if (!response.ok) {
      throw new Error('Weather fetch failed');
    }

    const data = await response.json();
    
    return {
      temperature: data.current.temperature_2m,
      uvIndex: data.current.uv_index,
      weatherCode: data.current.weather_code,
      daily: {
        time: data.daily.time,
        weatherCode: data.daily.weather_code,
        maxTemp: data.daily.temperature_2m_max,
        minTemp: data.daily.temperature_2m_min,
      }
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    // Fallback data if API fails to prevent app crash
    return {
      temperature: 20,
      uvIndex: 5,
      weatherCode: 0,
    };
  }
};