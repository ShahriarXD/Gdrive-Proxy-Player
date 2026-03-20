"use client";

import { CloudSunIcon, MapPinIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import type { DeskStatus } from "@/lib/desk-status";

type LocalDeskWidgetProps = {
  initialStatus: DeskStatus;
};

export function LocalDeskWidget({ initialStatus }: LocalDeskWidgetProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date());
    }, 60_000);

    return () => window.clearInterval(interval);
  }, []);

  const formattedTime = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: initialStatus.timezone,
      }).format(now),
    [initialStatus.timezone, now]
  );

  return (
    <div className="glass-panel rounded-[1.4rem] px-4 py-3 text-sm text-slate-700">
      <div className="flex items-center gap-2 font-medium text-foreground">
        <CloudSunIcon className="size-4 text-cyan-500" />
        Desk status
      </div>
      <div className="mt-2 flex items-center gap-2 text-slate-500">
        <MapPinIcon className="size-4" />
        <span>{`${initialStatus.city}, ${initialStatus.country}`}</span>
      </div>
      <p className="mt-2 text-sm font-medium text-foreground">{formattedTime}</p>
      <p className="mt-1 text-slate-500">
        {typeof initialStatus.temperature === "number"
          ? `${Math.round(initialStatus.temperature)}°C · ${initialStatus.weatherLabel}`
          : initialStatus.weatherLabel}
      </p>
    </div>
  );
}
