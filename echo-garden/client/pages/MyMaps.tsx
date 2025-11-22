import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus, Trash2, Copy } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Tile {
  id: string;
  resource: "wood" | "brick" | "wheat" | "sheep" | "ore" | "desert" | "sea";
  number: number | null;
  port: "wood" | "brick" | "wheat" | "sheep" | "ore" | "3:1" | null;
}

interface SavedMap {
  id: string;
  name: string;
  tiles: Tile[];
  createdAt: string;
}

export default function MyMaps() {
  const { user } = useAuth();
  const [maps, setMaps] = useState<SavedMap[]>([]);

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`catan_maps_${user.id}`);
      if (saved) {
        try {
          setMaps(JSON.parse(saved));
        } catch {
          setMaps([]);
        }
      }
    }
  }, [user]);

  const handleDelete = (mapId: string) => {
    if (!user) return;
    const updated = maps.filter((m) => m.id !== mapId);
    setMaps(updated);
    localStorage.setItem(`catan_maps_${user.id}`, JSON.stringify(updated));
    toast.success("Map deleted");
  };

  const handleShare = (mapId: string) => {
    const map = maps.find((m) => m.id === mapId);
    if (map) {
      const mapData = btoa(JSON.stringify(map.tiles));
      const shareUrl = `${window.location.origin}/map/${mapData}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success("Map link copied!");
    }
  };

  const handleLoad = (map: SavedMap) => {
    localStorage.setItem("current_map", JSON.stringify(map));
    toast.success(`Loaded: ${map.name}`);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              My Maps
            </h1>
            <p className="text-muted-foreground">
              Manage your saved Catan game boards
            </p>
          </div>
          <Link to="/generator">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create New Map
            </Button>
          </Link>
        </div>

        {/* Maps Grid */}
        {maps.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {maps.map((map) => (
              <div
                key={map.id}
                className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors group"
              >
                {/* Map Preview */}
                <div className="bg-background p-4 border-b border-border">
                  <div className="grid grid-cols-5 gap-1 mb-4">
                    {map.tiles.slice(0, 10).map((tile) => (
                      <div
                        key={tile.id}
                        className={`aspect-square rounded text-center flex items-center justify-center text-white text-xs font-bold bg-primary/40`}
                      >
                        {tile.number}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {map.tiles.length} tiles
                  </p>
                </div>

                {/* Map Info */}
                <div className="p-4">
                  <h3 className="font-bold text-foreground mb-1 truncate">
                    {map.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    {new Date(map.createdAt).toLocaleDateString()}
                  </p>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleLoad(map)}
                      className="text-xs bg-primary/10 hover:bg-primary/20 text-primary rounded px-3 py-2 transition-colors"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => handleShare(map.id)}
                      className="text-xs bg-secondary/10 hover:bg-secondary/20 text-secondary rounded px-3 py-2 transition-colors inline-flex items-center justify-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      Share
                    </button>
                    <button
                      onClick={() => handleDelete(map.id)}
                      className="col-span-2 text-xs bg-destructive/10 hover:bg-destructive/20 text-destructive rounded px-3 py-2 transition-colors inline-flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-foreground mb-3">
              No maps yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Create your first Catan map to get started
            </p>
            <Link to="/generator">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Create Your First Map
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
