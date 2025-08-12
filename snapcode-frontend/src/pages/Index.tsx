import { useState } from "react";
import { Brain, Github, Zap } from "lucide-react";
import { UploadZone } from "@/components/UploadZone";
import { LoadingState } from "@/components/LoadingState";
import { CodeOutput } from "@/components/CodeOutput";
import { aiService, GeneratedCode } from "@/services/aiService";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Index = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("");

  const handleDescriptionSubmit = async (description: string) => {
    setIsProcessing(true);
    setProgress(0);
    setStage("Generating UI...");
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      // Update stages
      setTimeout(() => setStage("Analyzing description..."), 1000);
      setTimeout(() => setStage("Creating HTML structure..."), 2000);
      setTimeout(() => setStage("Styling components..."), 2500);
      setTimeout(() => setStage("Adding interactions..."), 3000);
      
      const result = await aiService.generateCodeFromDescription(description);
      
      clearInterval(progressInterval);
      setProgress(100);
      setStage("Complete!");
      
      setTimeout(() => {
        setGeneratedCode(result);
        setIsProcessing(false);
      }, 500);
      
    } catch (error) {
      console.error("Error generating code:", error);
      setIsProcessing(false);
      setProgress(0);
      setStage("");
    }
  };

  const handleNewUpload = () => {
    setGeneratedCode(null);
    setProgress(0);
    setStage("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-accent opacity-30"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-center">
              <div className="p-3 rounded-2xl bg-gradient-primary shadow-glow">
                <Brain className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              SnapCode
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Generate HTML, CSS, and JavaScript code from text descriptions
            </p>
            
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-accent" />
                <span>Fast</span>
              </div>
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4 text-accent" />
                <span>Clean</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-accent" />
                <span>Smart</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
        {!isProcessing && !generatedCode && (
          <UploadZone onDescriptionSubmit={handleDescriptionSubmit} isProcessing={isProcessing} />
        )}
          
          {isProcessing && (
            <LoadingState progress={progress} stage={stage} />
          )}
          
          {generatedCode && (
            <div className="space-y-6">
              <div className="text-center">
                <Button variant="outline" onClick={handleNewUpload}>
                  Create New UI
                </Button>
              </div>
              
              <CodeOutput 
                htmlCode={generatedCode.html}
                cssCode={generatedCode.css}
                jsCode={generatedCode.js}
              />
            </div>
          )}
          
          {/* Features Section */}
          {!isProcessing && !generatedCode && (
            <div className="grid md:grid-cols-3 gap-6 mt-16">
              <Card className="p-6 text-center space-y-4 bg-card border-border/50">
                <div className="flex justify-center">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold">Code Generation</h3>
                <p className="text-sm text-muted-foreground">
                  Convert text descriptions into working web components
                </p>
              </Card>
              
              <Card className="p-6 text-center space-y-4 bg-card border-border/50">
                <div className="flex justify-center">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Zap className="w-6 h-6 text-accent" />
                  </div>
                </div>
                <h3 className="font-semibold">Quick Results</h3>
                <p className="text-sm text-muted-foreground">
                  Get clean, semantic code in seconds
                </p>
              </Card>
              
              <Card className="p-6 text-center space-y-4 bg-card border-border/50">
                <div className="flex justify-center">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Github className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold">Ready to Use</h3>
                <p className="text-sm text-muted-foreground">
                  Responsive, accessible code that works immediately
                </p>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
