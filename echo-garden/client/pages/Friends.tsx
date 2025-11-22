import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, ArrowLeft } from "lucide-react";

export default function Friends() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-primary hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="text-center py-20">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/15 rounded-2xl border border-primary/20">
              <Users className="w-12 h-12 text-primary" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-4">Friends</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Add friends to see how many wins they have and how they stand
                against you!
          </p>

          <Link to="/generator">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Add Friends
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
