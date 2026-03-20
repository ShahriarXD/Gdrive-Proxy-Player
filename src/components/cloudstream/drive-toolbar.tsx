"use client";

import { SearchIcon, SlidersHorizontalIcon, VideoIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type DriveToolbarProps = {
  defaultQuery: string;
  videosOnly: boolean;
};

export function DriveToolbar({ defaultQuery, videosOnly }: DriveToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(defaultQuery);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setQuery(defaultQuery);
  }, [defaultQuery]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k") {
        return;
      }

      event.preventDefault();
      inputRef.current?.focus();
      inputRef.current?.select();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const updateSearch = (nextQuery: string, nextVideosOnly: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    const normalizedQuery = nextQuery.trim();

    if (normalizedQuery) {
      params.set("q", normalizedQuery);
      params.delete("folderId");
    } else {
      params.delete("q");
    }

    if (nextVideosOnly) {
      params.set("videos", "1");
    } else {
      params.delete("videos");
    }

    params.delete("videoId");
    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  };

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <form
        className="flex w-full max-w-3xl items-center gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          updateSearch(query, videosOnly);
        }}
      >
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-14 rounded-[1.4rem] pl-11 pr-20"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Quick open a Drive file or video"
            ref={inputRef}
            value={query}
          />
          <div className="glass-pill pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500 md:block">
            Command K
          </div>
        </div>
        <Button className="h-14 rounded-[1.4rem] px-6" type="submit" variant="secondary">
          Search
        </Button>
      </form>

      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        <Button
          className="min-w-34"
          onClick={() => updateSearch(query, !videosOnly)}
          variant={videosOnly ? "default" : "outline"}
        >
          <VideoIcon className="size-4" />
          {videosOnly ? "Videos only" : "Show videos"}
        </Button>
        <Button className="min-w-29" variant="outline">
          <SlidersHorizontalIcon className="size-4" />
          Filters
        </Button>
      </div>
    </div>
  );
}
