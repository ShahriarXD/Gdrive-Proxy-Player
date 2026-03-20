"use client";

import { CloudSunIcon, MapPinIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type LocationState = {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
};

type WeatherState = {
  temperature: number;
  label: string;
};

const weatherCodeMap: Record<number, string> = {
  0: "Clear",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Cloudy",
  45: "Fog",
  48: "Fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Showers",
  81: "Rain showers",
  82: "Heavy showers",
  95: "Thunderstorm",
};

function getWeatherLabel(code?: number) {
  if (code === undefined) {
    return "Weather offline";
  }

  return weatherCodeMap[code] ?? "Weather offline";
}

export function LocalDeskWidget() {
  const [location, setLocation] = useState<LocationState | null>(null);
  const [weather, setWeather] = useState<WeatherState | null>(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date());
    }, 60_000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadLocationAndWeather = async () => {
      try {
        const locationResponse = await fetch("https://ipwho.is/");
        const locationData = (await locationResponse.json()) as {
          success?: boolean;
          city?: string;
          country?: string;
          latitude?: number;
          longitude?: number;
        };

        if (
          cancelled ||
          !locationData.success ||
          typeof locationData.latitude !== "number" ||
          typeof locationData.longitude !== "number"
        ) {
          return;
        }

        const nextLocation = {
          city: locationData.city ?? "Dhaka",
          country: locationData.country ?? "Bangladesh",
          latitude: locationData.latitude,
          longitude: locationData.longitude,
        };

        setLocation(nextLocation);

        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${nextLocation.latitude}&longitude=${nextLocation.longitude}&current=temperature_2m,weather_code&timezone=auto`
        );
        const weatherData = (await weatherResponse.json()) as {
          current?: {
            temperature_2m?: number;
            weather_code?: number;
          };
        };

        if (cancelled || weatherData.current?.temperature_2m === undefined) {
          return;
        }

        setWeather({
          temperature: weatherData.current.temperature_2m,
          label: getWeatherLabel(weatherData.current.weather_code),
        });
      } catch {
        return;
      }
    };

    void loadLocationAndWeather();

    return () => {
      cancelled = true;
    };
  }, []);

  const formattedTime = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(now),
    [now]
  );

  return (
    <div className="glass-panel rounded-[1.4rem] px-4 py-3 text-sm text-slate-700">
      <div className="flex items-center gap-2 font-medium text-foreground">
        <CloudSunIcon className="size-4 text-cyan-500" />
        Desk status
      </div>
      <div className="mt-2 flex items-center gap-2 text-slate-500">
        <MapPinIcon className="size-4" />
        <span>{location ? `${location.city}, ${location.country}` : "Locating..."}</span>
      </div>
      <p className="mt-2 text-sm font-medium text-foreground">{formattedTime}</p>
      <p className="mt-1 text-slate-500">
        {weather ? `${Math.round(weather.temperature)}°C · ${weather.label}` : "Fetching weather..."}
      </p>
    </div>
  );
}
