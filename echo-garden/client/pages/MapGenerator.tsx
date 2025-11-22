import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Dice5, Copy, Save, Share2 } from "lucide-react";
import { toast } from "sonner";

interface Tile {
  id: string;
  resource: "wood" | "brick" | "wheat" | "sheep" | "ore" | "desert" | "sea";
  number: number | null;
  port: "wood" | "brick" | "wheat" | "sheep" | "ore" | "3:1" | null;
}

const RESOURCES = [
  "wood",
  "brick",
  "wheat",
  "sheep",
  "ore",
  "desert",
] as const;

const RESOURCE_COLORS: Record<string, string> = {
  wood: "rgb(101, 150, 58)",
  brick: "rgb(204, 85, 51)",
  wheat: "rgb(224, 188, 76)",
  sheep: "rgb(144, 168, 100)",
  ore: "rgb(145, 151, 163)",
  desert: "rgb(183, 155, 110)",
  sea: "rgb(52, 152, 219)",
};

const RESOURCE_NAMES: Record<string, string> = {
  wood: "Forests",
  brick: "Hills",
  wheat: "Fields",
  sheep: "Pastures",
  ore: "Mountains",
  desert: "Desert",
};

const generateMap = (): Tile[] => {
  const tiles: Tile[] = [];
  const resourceDistribution = {
    wood: 4,
    brick: 3,
    wheat: 4,
    sheep: 4,
    ore: 3,
    desert: 1,
  };

  const numbers = [
    2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12,
  ];
  let numberIndex = 0;

  const getRandomResources = () => {
    const resources: string[] = [];
    for (const [resource, count] of Object.entries(resourceDistribution)) {
      for (let i = 0; i < count; i++) {
        resources.push(resource);
      }
    }
    return resources.sort(() => Math.random() - 0.5);
  };

  const randomResources = getRandomResources();
  const shuffledNumbers = [...numbers].sort(() => Math.random() - 0.5);

  randomResources.forEach((resource, index) => {
    tiles.push({
      id: `tile-${index}`,
      resource: resource as typeof RESOURCES[number],
      number:
        resource === "desert"
          ? null
          : parseInt(shuffledNumbers[numberIndex++] || "0"),
      port: null,
    });
  });

  return tiles;
};

interface SavedMap {
  id: string;
  name: string;
  tiles: Tile[];
  createdAt: string;
}

const HexTile = ({ tile, size = 80 }: { tile: Tile; size?: number }) => {
  const color = RESOURCE_COLORS[tile.resource];

  return (
    <div
      className="flex items-center justify-center flex-col cursor-pointer hover:opacity-80 transition-opacity"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        position: "relative",
      }}
    >
      <svg
        viewBox="0 0 100 100"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
        }}
      >
        <polygon
          points="50,0 93.3,25 93.3,75 50,100 6.7,75 6.7,25"
          fill={color}
          stroke="rgba(0, 0, 0, 0.2)"
          strokeWidth="2"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
          fontWeight: "bold",
          pointerEvents: "none",
        }}
      >
        {tile.number && <div style={{ fontSize: "20px" }}>{tile.number}</div>}
        <div
          style={{
            fontSize: "10px",
            opacity: 0.9,
            marginTop: tile.number ? "2px" : "0px",
          }}
        >
          {RESOURCE_NAMES[tile.resource]}
        </div>
      </div>
    </div>
  );
};

export default function MapGenerator() {
  const { user } = useAuth();
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [savedMaps, setSavedMaps] = useState<SavedMap[]>([]);
  const [mapName, setMapName] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);

  useEffect(() => {
    const newMap = generateMap();
    setTiles(newMap);
    loadSavedMaps();
  }, []);

  const loadSavedMaps = () => {
    if (!user) return;
    const saved = localStorage.getItem(`catan_maps_${user.id}`);
    if (saved) {
      try {
        setSavedMaps(JSON.parse(saved));
      } catch {
        setSavedMaps([]);
      }
    }
  };

  const handleGenerateNew = () => {
    const newMap = generateMap();
    setTiles(newMap);
    setMapName("");
  };

  const handleSaveMap = () => {
    if (!user) return;
    if (!mapName.trim()) {
      toast.error("Please enter a map name");
      return;
    }

    const newMap: SavedMap = {
      id: `map_${Date.now()}`,
      name: mapName,
      tiles,
      createdAt: new Date().toISOString(),
    };

    const updated = [...savedMaps, newMap];
    setSavedMaps(updated);
    localStorage.setItem(`catan_maps_${user.id}`, JSON.stringify(updated));
    toast.success("Map saved successfully!");
    setMapName("");
    setShowSaveModal(false);
  };

  const handleShare = () => {
    const mapData = btoa(JSON.stringify(tiles));
    const shareUrl = `${window.location.origin}/map/${mapData}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Map link copied to clipboard!");
  };

  const handleLoadMap = (map: SavedMap) => {
    setTiles(map.tiles);
    toast.success(`Loaded map: ${map.name}`);
  };

  const handleDeleteMap = (mapId: string) => {
    if (!user) return;
    const updated = savedMaps.filter((m) => m.id !== mapId);
    setSavedMaps(updated);
    localStorage.setItem(`catan_maps_${user.id}`, JSON.stringify(updated));
    toast.success("Map deleted");
  };

  // Catan standard layout: 3-4-5-4-3 tiles
  const tileRows = [
    tiles.slice(0, 3),
    tiles.slice(3, 7),
    tiles.slice(7, 12),
    tiles.slice(12, 16),
    tiles.slice(16, 19),
  ];

  const hexSize = 80;
  const hexHeight = hexSize * 0.866;
  const hexWidth = hexSize;

  return (
    <div className="min-h-screen bg-background pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Map Generator
          </h1>
          <p className="text-muted-foreground">
            Create and customize your Catan game boards
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Generator */}
          <div className="lg:col-span-2">
            {/* Board Display */}
            <div className="bg-card border border-border rounded-xl p-8 mb-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-foreground">Board</h2>
                <Button
                  onClick={handleGenerateNew}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground inline-flex items-center gap-2"
                >
                  <Dice5 className="w-4 h-4" />
                  Regenerate
                </Button>
              </div>

              {/* Hexagonal Grid Display */}
              <div
                className="mx-auto mb-8 flex flex-col items-center justify-center"
                style={{
                  width: "100%",
                  maxWidth: "600px",
                }}
              >
                {tileRows.map((row, rowIndex) => {
                  const isMiddleRow = rowIndex === 2;
                  const offsetWidth = isMiddleRow ? 0 : hexWidth / 4;

                  return (
                    <div
                      key={rowIndex}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginLeft: `${offsetWidth}px`,
                        marginTop: rowIndex === 0 ? 0 : `-${hexHeight * 0.5}px`,
                        gap: "2px",
                      }}
                    >
                      {row.map((tile) => (
                        <div key={tile.id}>
                          <HexTile tile={tile} size={hexSize} />
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">
                    Total Tiles
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {tiles.length}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">
                    Resources
                  </div>
                  <div className="text-2xl font-bold text-secondary">
                    {
                      new Set(
                        tiles
                          .filter((t) => t.resource !== "desert")
                          .map((t) => t.resource)
                      ).size
                    }
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">
                    Deserts
                  </div>
                  <div className="text-2xl font-bold text-accent">
                    {tiles.filter((t) => t.resource === "desert").length}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleShare}
                className="flex-1 bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/30 inline-flex items-center justify-center gap-2 rounded-lg"
              >
                <Share2 className="w-4 h-4" />
                Share Map
              </Button>
              <Button
                onClick={() => setShowSaveModal(true)}
                className="flex-1 bg-accent/20 hover:bg-accent/30 text-accent border border-accent/30 inline-flex items-center justify-center gap-2 rounded-lg"
              >
                <Save className="w-4 h-4" />
                Save Map
              </Button>
            </div>
          </div>

          {/* Sidebar - Saved Maps */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
              <h3 className="text-lg font-bold text-foreground mb-4">
                Your Maps
              </h3>

              {user ? (
                savedMaps.length > 0 ? (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {savedMaps.map((map) => (
                      <div
                        key={map.id}
                        className="p-3 bg-background border border-border rounded-lg hover:border-primary/50 transition-colors group"
                      >
                        <p className="font-medium text-foreground text-sm truncate">
                          {map.name}
                        </p>
                        <p className="text-xs text-muted-foreground mb-3">
                          {new Date(map.createdAt).toLocaleDateString()}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleLoadMap(map)}
                            className="flex-1 text-xs bg-primary/10 hover:bg-primary/20 text-primary rounded px-2 py-1 transition-colors"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => handleDeleteMap(map.id)}
                            className="flex-1 text-xs bg-destructive/10 hover:bg-destructive/20 text-destructive rounded px-2 py-1 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No saved maps yet. Generate and save one to get started!
                  </p>
                )
              ) : (
                <p className="text-sm text-muted-foreground">
                  Log in to save your favorite maps.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">
              Save This Map
            </h3>
            <input
              type="text"
              placeholder="Give your map a name..."
              value={mapName}
              onChange={(e) => setMapName(e.target.value)}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground mb-4"
            />
            <div className="flex gap-3">
              <Button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 bg-muted/50 hover:bg-muted text-foreground border border-border rounded-lg"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveMap}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
