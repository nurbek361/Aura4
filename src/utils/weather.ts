/**
 * Live weather by device geolocation.
 * Uses Open-Meteo (no API key, CORS-friendly) for the forecast and
 * BigDataCloud's free reverse-geocoding endpoint for the city name.
 */
import { useEffect, useState } from 'react';
import { WeatherData } from '../types';
import { INITIAL_WEATHER } from '../data/mockData';

const CACHE_KEY = 'aura_live_weather';
const CACHE_TTL_MS = 20 * 60 * 1000; // 20 minutes

// WMO weather codes -> human-readable Russian condition
const WMO_CODE_MAP: Record<number, string> = {
  0: 'Ясно',
  1: 'Преимущественно ясно',
  2: 'Переменная облачность',
  3: 'Пасмурно',
  45: 'Туман',
  48: 'Изморозь',
  51: 'Небольшая морось',
  53: 'Морось',
  55: 'Сильная морось',
  61: 'Небольшой дождь',
  63: 'Дождь',
  65: 'Сильный дождь',
  71: 'Небольшой снег',
  73: 'Снег',
  75: 'Сильный снег',
  80: 'Ливень',
  81: 'Сильный ливень',
  82: 'Очень сильный ливень',
  95: 'Гроза',
  96: 'Гроза с градом',
  99: 'Сильная гроза с градом',
};

function adviceFor(tempC: number, code: number): string {
  if ([61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code)) {
    return 'На улице дождь/гроза — лучше перенести тренировку в помещение.';
  }
  if ([71, 73, 75].includes(code)) {
    return 'Снегопад — одевайтесь теплее, если планируете прогулку.';
  }
  if (tempC >= 28) {
    return 'Жарко — тренируйтесь утром или вечером и пейте больше воды.';
  }
  if (tempC <= 0) {
    return 'Холодно — разогрейтесь перед выходом и оденьтесь по погоде.';
  }
  return 'Хорошие условия для прогулки или тренировки на улице.';
}

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=ru`
    );
    if (res.ok) {
      const data = await res.json();
      return data.city || data.locality || data.principalSubdivision || 'Ваше местоположение';
    }
  } catch {
    // ignore, fall through
  }
  return 'Ваше местоположение';
}

export async function fetchLiveWeather(): Promise<WeatherData | null> {
  if (typeof navigator === 'undefined' || !('geolocation' in navigator)) return null;

  const position = await new Promise<GeolocationPosition | null>((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos),
      () => resolve(null),
      { timeout: 8000, maximumAge: 15 * 60 * 1000 }
    );
  });

  if (!position) return null;

  const { latitude, longitude } = position.coords;

  try {
    const [weatherRes, city] = await Promise.all([
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
      ),
      reverseGeocode(latitude, longitude),
    ]);

    if (!weatherRes.ok) return null;
    const data = await weatherRes.json();
    const current = data.current;
    if (!current) return null;

    const code = current.weather_code as number;
    const tempC = Math.round(current.temperature_2m);

    const result: WeatherData = {
      city,
      source: 'Open-Meteo • по геолокации',
      temperature: `${tempC >= 0 ? '+' : ''}${tempC}°C`,
      condition: WMO_CODE_MAP[code] || 'Переменная погода',
      humidity: `${Math.round(current.relative_humidity_2m)}%`,
      aqi: 'Н/д',
      windSpeed: `${Math.round(current.wind_speed_10m)} м/с`,
      workoutAdvice: adviceFor(tempC, code),
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify({ data: result, cachedAt: Date.now() }));
    return result;
  } catch (err) {
    console.warn('Live weather fetch failed:', err);
    return null;
  }
}

function readCache(): WeatherData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.cachedAt > CACHE_TTL_MS) return null;
    return parsed.data as WeatherData;
  } catch {
    return null;
  }
}

/**
 * React hook: returns the best-known weather (cached -> live -> fallback
 * mock) plus a flag for whether it's real geolocation-based data.
 */
export function useLiveWeather(): { weather: WeatherData; isLive: boolean; loading: boolean } {
  const [weather, setWeather] = useState<WeatherData>(() => readCache() || INITIAL_WEATHER);
  const [isLive, setIsLive] = useState<boolean>(() => Boolean(readCache()));
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const cached = readCache();
    if (cached) {
      setWeather(cached);
      setIsLive(true);
      return;
    }

    let cancelled = false;
    setLoading(true);
    fetchLiveWeather().then((live) => {
      if (cancelled) return;
      setLoading(false);
      if (live) {
        setWeather(live);
        setIsLive(true);
      }
      // if geolocation denied/failed, silently keep the fallback mock data
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { weather, isLive, loading };
}
