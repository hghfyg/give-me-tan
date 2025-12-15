export interface WeatherData {
  temperature: number;
  uvIndex: number;
  weatherCode: number;
  daily?: {
    time: string[];
    weatherCode: number[];
    maxTemp: number[];
    minTemp: number[];
  };
}

export enum SkinType {
  TYPE_1 = "I - Bränner sig alltid",
  TYPE_2 = "II - Bränner sig oftast",
  TYPE_3 = "III - Bränner sig ibland",
  TYPE_4 = "IV - Bränner sig sällan",
  TYPE_5 = "V - Bränner sig mycket sällan",
  TYPE_6 = "VI - Bränner sig aldrig",
}

export interface SunAdvice {
  safeMinutes: number;
  spfRecommendation: number;
  advice: string;
}

export interface Song {
  title: string;
  artist: string;
  vibe: string;
}

export interface BeachLocation {
  name: string;
  lat: number;
  lon: number;
  description: string;
}

export interface GeoLocation {
  lat: number;
  lon: number;
}

export interface SunSession {
  id: string;
  date: string;
  durationMinutes: number;
  uvIndex: number;
  location: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  skinType: SkinType;
  history: SunSession[];
}