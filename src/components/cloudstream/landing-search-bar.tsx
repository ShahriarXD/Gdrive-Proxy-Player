"use client";

import { SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";

type LandingSearchBarProps = {
  disabled?: boolean;
};

export function LandingSearchBar({ disabled = false }: LandingSearchBarProps) {
  return (
    <div className="glass-panel rounded-[1.7rem] p-2">
      <div className="flex items-center gap-3 rounded-[1.25rem] px-3 py-2">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-white/75 text-slate-500">
          <SearchIcon className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <Input
            className="h-12 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
            disabled={disabled}
            placeholder={
              disabled
                ? "Sign in to search your Drive instantly"
                : "Search your Drive and open a video directly"
            }
          />
        </div>
        <div className="glass-pill hidden rounded-full px-3 py-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-500 md:block">
          Command K
        </div>
      </div>
    </div>
  );
}
