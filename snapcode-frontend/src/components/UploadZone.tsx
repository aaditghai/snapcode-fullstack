import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface UploadZoneProps {
  onDescriptionSubmit: (description: string) => void;
  isProcessing: boolean;
}

export const UploadZone = ({ onDescriptionSubmit, isProcessing }: UploadZoneProps) => {
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (description.trim()) {
      onDescriptionSubmit(description.trim());
    }
  };

  return (
    <Card className="relative overflow-hidden bg-card border-border/50">
      <div className="p-8 space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-gradient-primary">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Describe Your UI</h3>
            <p className="text-muted-foreground">
              Tell us what kind of interface you want to create
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Textarea
            placeholder="Describe the UI you want... (e.g., 'A modern login form with email and password fields, a blue submit button, and a forgot password link')"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[120px] resize-none"
            disabled={isProcessing}
          />
          
          <div className="flex justify-center">
            <Button
              variant="gradient"
              size="lg"
              onClick={handleSubmit}
              disabled={isProcessing || !description.trim()}
              className="w-full max-w-xs"
            >
              {isProcessing ? "Generating..." : "Generate Code"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};