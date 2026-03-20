"use client";

import { SearchIcon, VideoIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

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

  const updateSearch = (nextQuery: string, nextVideosOnly: boolean) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextQuery) {
      params.set("q", nextQuery);
    } else {
      params.delete("q");
    }

    if (nextVideosOnly) {
      params.set("videos", "1");
    } else {
      params.delete("videos");
    }

    params.delete("videoId");
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <form
        className="flex w-full max-w-2xl items-center gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          updateSearch(query, videosOnly);
        }}
      >
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-11"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search in the current view"
            value={query}
          />
        </div>
        <Button type="submit" variant="outline">
          Search
        </Button>
      </form>

      <Button
        onClick={() => updateSearch(query, !videosOnly)}
        variant={videosOnly ? "default" : "outline"}
      >
        <VideoIcon className="size-4" />
        {videosOnly ? "Showing videos only" : "Show only videos"}
      </Button>
    </div>
  );
}
