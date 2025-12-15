import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SkinType, SunAdvice, Song, BeachLocation } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Tanning Advice ---
export const getSunBathingAdvice = async (
  uvIndex: number,
  skinType: string
): Promise<SunAdvice> => {
  const model = "gemini-2.5-flash";
  
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      safeMinutes: { type: Type.INTEGER, description: "Maximum safe sun exposure time in minutes" },
      spfRecommendation: { type: Type.INTEGER, description: "Recommended SPF value" },
      advice: { type: Type.STRING, description: "Short, friendly advice in Swedish (max 15 words)" },
    },
    required: ["safeMinutes", "spfRecommendation", "advice"],
  };

  const prompt = `
    Kontext: Appen "Keep Me Tanned".
    Data: UV-index ${uvIndex}, Hudtyp ${skinType}.
    Uppgift: Ge säkerhetsråd för solning. Var försiktig.
    Språk: Svenska.
  `;

  try {
    const result = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const text = result.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text) as SunAdvice;
  } catch (error) {
    console.error("Gemini advice error:", error);
    return {
      safeMinutes: 15,
      spfRecommendation: 30,
      advice: "Tekniskt fel. Ta det säkert och använd hög solskyddsfaktor!",
    };
  }
};

// --- Playlist Generator ---
export const generateSpotifyPlaylist = async (vibe: string): Promise<Song[]> => {
  const model = "gemini-2.5-flash";

  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        artist: { type: Type.STRING },
        vibe: { type: Type.STRING },
      },
      required: ["title", "artist", "vibe"],
    },
  };

  const prompt = `
    Skapa en kurerad lista på 5 riktiga låtar baserat på användarens vibe: "${vibe}".
    Fokusera på populära låtar som finns på Spotify.
    Svara endast med JSON.
  `;

  try {
    const result = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const text = result.text;
    if (!text) return [];
    return JSON.parse(text) as Song[];
  } catch (error) {
    console.error("Gemini playlist error:", error);
    return [];
  }
};

// --- Beach Finder ---
export const findNearbyBeaches = async (lat: number, lon: number): Promise<BeachLocation[]> => {
  const model = "gemini-2.5-flash";
  
  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        lat: { type: Type.NUMBER },
        lon: { type: Type.NUMBER },
        description: { type: Type.STRING, description: "Kort beskrivning på Svenska" },
      },
      required: ["name", "lat", "lon", "description"],
    },
  };

  const prompt = `
    Din uppgift är att hitta 3 FAKTISKA och VERKLIGA offentliga badplatser, stränder eller parker som lämpar sig för solning i närheten av koordinaterna: Latitude ${lat}, Longitude ${lon}.

    VIKTIGT:
    1. Du får INTE hitta på platser.
    2. Platserna måste vara riktiga geografiska platser som finns på Google Maps.
    3. Returnera de exakta koordinaterna för dessa platser om du känner till dem. Om du är osäker, välj en mycket välkänd plats i närheten.
    4. Om det är mitt i en stad utan stränder, välj populära parker där folk solar.

    Svara endast med JSON enligt schemat.
  `;

  try {
    const result = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const text = result.text;
    if (!text) return [];
    return JSON.parse(text) as BeachLocation[];
  } catch (error) {
    console.error("Gemini beach error:", error);
    return [];
  }
};