import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, Zap } from "lucide-react";

interface LoadingStateProps {
  progress: number;
  stage: string;
}

export const LoadingState = ({ progress, stage }: LoadingStateProps) => {
  return (
    <Card className="bg-gradient-secondary border-border/50">
      <div className="p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <div className="p-4 rounded-full bg-gradient-primary animate-pulse">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 p-1 rounded-full bg-accent animate-bounce">
              <Zap className="w-3 h-3 text-accent-foreground" />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">AI is Converting Your Screenshot</h3>
          <p className="text-muted-foreground">{stage}</p>
        </div>
        
        <div className="space-y-2 max-w-md mx-auto">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground">{progress}% Complete</p>
        </div>
        
        <div className="text-xs text-muted-foreground space-y-1">
          <p>🧠 Analyzing UI components</p>
          <p>⚡ Generating HTML structure</p>
          <p>🎨 Creating CSS styles</p>
          <p>✨ Adding interactivity</p>
        </div>
      </div>
    </Card>
  );
};