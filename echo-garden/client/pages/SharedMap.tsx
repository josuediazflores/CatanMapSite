import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface Tile {
  id: string;
  resource: "wood" | "brick" | "wheat" | "sheep" | "ore" | "desert" | "sea";
  number: number | null;
  port: "wood" | "brick" | "wheat" | "sheep" | "ore" | "3:1" | null;
}

const RESOURCE_COLORS: Record<string, string> = {
  wood: "bg-catan-wood",
  brick: "bg-catan-brick",
  wheat: "bg-catan-wheat",
  sheep: "bg-catan-sheep",
  ore: "bg-catan-ore",
  desert: "bg-catan-desert",
  sea: "bg-catan-sea",
};

export default function SharedMap() {
  const { mapData } = useParams<{ mapData: string }>();
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (mapData) {
      try {
        const decoded = JSON.parse(atob(mapData));
        setTiles(decoded);
      } catch {
        setError(true);
      }
    } else {
      setError(true);
    }
  }, [mapData]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Invalid Map Link
          </h1>
          <p className="text-muted-foreground mb-6">
            The map link you're trying to access is invalid or expired.
          </p>
          <Link to="/">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-20">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-card border border-border rounded-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Shared Catan Map
            </h1>
            <p className="text-muted-foreground mb-6">
              This map has been shared with you
            </p>
            <Button
              onClick={handleCopyLink}
              className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 inline-flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy Link
            </Button>
          </div>

          {/* Map Display */}
          <div className="grid grid-cols-6 gap-2 max-w-2xl mx-auto mb-8 p-6 bg-background rounded-lg border border-border">
            {tiles.map((tile) => (
              <div
                key={tile.id}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center ${
                  RESOURCE_COLORS[tile.resource]
                } border-2 border-black/10 shadow-md`}
              >
                <div className="text-2xl font-bold text-white drop-shadow">
                  {tile.number ? tile.number : "·"}
                </div>
                <div className="text-xs text-white drop-shadow mt-1 capitalize">
                  {tile.resource.slice(0, 2)}
                </div>
              </div>
            ))}
          </div>

          {/* Map Info */}
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
                Resource Breakdown
              </div>
              <div className="text-sm text-muted-foreground">
                {tiles.filter((t) => t.resource === "wood").length} wood,{" "}
                {tiles.filter((t) => t.resource === "brick").length} brick
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">
              Want to create your own maps?
            </p>
            <Link to="/generator">
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                Go to Map Generator
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
