import { headers } from "next/headers";

export type DeskStatus = {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  temperature: number | null;
  weatherLabel: string;
  timezone?: string;
};

const DHAKA_FALLBACK: DeskStatus = {
  city: "Dhaka",
  country: "Bangladesh",
  latitude: 23.8103,
  longitude: 90.4125,
  temperature: null,
  weatherLabel: "Weather offline",
  timezone: "Asia/Dhaka",
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

function getPublicIp(candidate: string | null) {
  if (!candidate) {
    return null;
  }

  const value = candidate.split(",")[0]?.trim() ?? "";

  if (
    !value ||
    value === "::1" ||
    value === "127.0.0.1" ||
    value.startsWith("10.") ||
    value.startsWith("192.168.") ||
    value.startsWith("172.16.") ||
    value.startsWith("172.17.") ||
    value.startsWith("172.18.") ||
    value.startsWith("172.19.") ||
    value.startsWith("172.2") ||
    value.startsWith("fd") ||
    value.startsWith("fe80")
  ) {
    return null;
  }

  return value;
}

async function getLocationBase() {
  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for");
  const realIp = requestHeaders.get("x-real-ip");
  const ip = getPublicIp(forwardedFor) ?? getPublicIp(realIp);

  try {
    const locationUrl = ip ? `https://ipwho.is/${ip}` : "https://ipwho.is/";
    const locationResponse = await fetch(locationUrl, {
      cache: "no-store",
      next: { revalidate: 0 },
    });
    const locationData = (await locationResponse.json()) as {
      success?: boolean;
      city?: string;
      country?: string;
      latitude?: number;
      longitude?: number;
      timezone?: { id?: string };
    };

    if (
      !locationData.success ||
      typeof locationData.latitude !== "number" ||
      typeof locationData.longitude !== "number"
    ) {
      return DHAKA_FALLBACK;
    }

    return {
      city: locationData.city ?? DHAKA_FALLBACK.city,
      country: locationData.country ?? DHAKA_FALLBACK.country,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      temperature: null,
      weatherLabel: "Weather offline",
      timezone: locationData.timezone?.id ?? DHAKA_FALLBACK.timezone,
    } satisfies DeskStatus;
  } catch {
    return DHAKA_FALLBACK;
  }
}

export async function getDeskStatus(): Promise<DeskStatus> {
  const base = await getLocationBase();

  try {
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${base.latitude}&longitude=${base.longitude}&current=temperature_2m,weather_code&timezone=auto`,
      {
        cache: "no-store",
        next: { revalidate: 0 },
      }
    );
    const weatherData = (await weatherResponse.json()) as {
      timezone?: string;
      current?: {
        temperature_2m?: number;
        weather_code?: number;
      };
    };

    return {
      ...base,
      temperature:
        typeof weatherData.current?.temperature_2m === "number"
          ? weatherData.current.temperature_2m
          : base.temperature,
      weatherLabel: getWeatherLabel(weatherData.current?.weather_code),
      timezone: weatherData.timezone ?? base.timezone,
    };
  } catch {
    return base;
  }
}
