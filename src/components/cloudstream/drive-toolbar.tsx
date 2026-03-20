"use client";

import { SearchIcon, SlidersHorizontalIcon, VideoIcon } from "lucide-react";
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
        className="flex w-full max-w-3xl items-center gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          updateSearch(query, videosOnly);
        }}
      >
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-14 rounded-[1.4rem] pl-11"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search folder or file"
            value={query}
          />
        </div>
        <Button className="h-14 rounded-[1.4rem] px-6" type="submit" variant="secondary">
          Search
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <Button onClick={() => updateSearch(query, !videosOnly)} variant={videosOnly ? "default" : "outline"}>
          <VideoIcon className="size-4" />
          {videosOnly ? "Videos only" : "Show videos"}
        </Button>
        <Button variant="outline">
          <SlidersHorizontalIcon className="size-4" />
          Filters
        </Button>
      </div>
    </div>
  );
}
