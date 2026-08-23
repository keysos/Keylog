"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { mockGames } from "@/mocks/data/mockGames";
import { mockListGames } from "@/mocks/data/mockListGames";
import { mockLists } from "@/mocks/data/mockLists";
import Image from "next/image";
import { useState } from "react";

const ProfileLists = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [listName, setListName] = useState("");

  function handleCreateList() {
    if (!listName.trim()) return;

    console.log("Creating list:", listName);

    setListName("");
    setIsOpen(false);
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <Button onClick={() => setIsOpen(true)}>Create List</Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create List</DialogTitle>

            <DialogDescription>
              Give your new game list a name.
            </DialogDescription>
          </DialogHeader>

          <Input
            placeholder="List name"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>

            <Button onClick={handleCreateList} disabled={!listName.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        {mockLists.map((list) => {
          const listGames = mockListGames.filter(
            (listGame) => listGame.list_id === list.id,
          );

          const games = listGames
            .map((listGame) =>
              mockGames.find((game) => game.id === listGame.game_id),
            )
            .filter((game) => game !== undefined);

          const visibleGames = games.slice(0, 4);

          const imageWidth = 96;

          return (
            <div
              key={list.id}
              className="rounded-sm border border-border bg-card p-4"
            >
              <div className="relative h-32 w-full">
                {visibleGames.map((game, index) => {
                  const count = visibleGames.length;

                  const progress = count > 1 ? index / (count - 1) : 0.5;

                  return (
                    <div
                      key={game.id}
                      className="absolute top-0 aspect-3/4 w-24 overflow-hidden rounded-md"
                      style={{
                        left:
                          count === 1
                            ? `calc(50% - ${imageWidth / 2}px)`
                            : `calc(${progress * 100}% - ${
                                progress * imageWidth
                              }px)`,
                        zIndex: count - index,
                      }}
                    >
                      <Image
                        src={game.cover_url ?? ""}
                        alt={game.title}
                        fill
                        className="border border-border object-cover"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 flex justify-between font-medium">
                <p>{list.name}</p>
                <p className="font-normal text-muted-foreground">
                  {games.length} Games
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileLists;
