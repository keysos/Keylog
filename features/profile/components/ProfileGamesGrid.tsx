"use client";

import { Button } from "@/components/ui/button";
import { mockGames } from "@/mocks/data/mockGames";
import { UserGame } from "@/types";
import Image from "next/image";
import { useState } from "react";

type ProfileGamesGridProps = {
  games: UserGame[];
};

const tabs = [
  { label: "completed", title: "Completed" },
  { label: "playing", title: "Playing" },
  { label: "dropped", title: "Dropped" },
  { label: "backlog", title: "Backlogged" },
];

const ProfileGamesGrid = ({ games }: ProfileGamesGridProps) => {
  const [activeTab, setActiveTab] = useState("completed");

  const filteredGames = games.filter(
    (userGame) => userGame.status === activeTab,
  );

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.label;

          return (
            <Button
              key={tab.label}
              variant={isActive ? "default" : "ghost"}
              onClick={() => setActiveTab(tab.label)}
              className="border border-border"
            >
              {tab.title}
            </Button>
          );
        })}
      </div>

      <div className="grid grid-cols-4 gap-1 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
        {filteredGames.map((userGame) => {
          const game = mockGames.find((game) => game.id === userGame.game_id);

          if (!game) return null;

          return (
            <div
              key={userGame.id}
              className="relative aspect-3/4 w-full max-w-30 rounded-sm border border-border"
            >
              <Image
                src={game.cover_url ?? ""}
                alt={game.title}
                fill
                className="rounded-sm object-cover"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileGamesGrid;
