import { useState } from "react";
import { Copy, Check, Download, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CodeOutputProps {
  htmlCode: string;
  cssCode: string;
  jsCode: string;
}

export const CodeOutput = ({ htmlCode, cssCode, jsCode }: CodeOutputProps) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = async (code: string, section: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const CodeSection = ({ code, language, filename }: { code: string; language: string; filename: string }) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">{filename}</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(code, language)}
            className="hover:bg-accent"
          >
            {copiedSection === language ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadFile(code, filename)}
            className="hover:bg-accent"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <Card className="relative overflow-hidden">
        <pre className="p-4 text-sm overflow-x-auto bg-muted/30 rounded-lg border border-border/50">
          <code className="text-foreground">{code}</code>
        </pre>
      </Card>
    </div>
  );

  return (
    <Card className="bg-card border-border/50">
      <div className="p-6 space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold">Generated Code</h3>
          <p className="text-muted-foreground">
            Your description has been converted to code
          </p>
        </div>

        <Tabs defaultValue="html" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/30">
            <TabsTrigger value="html" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              HTML
            </TabsTrigger>
            <TabsTrigger value="css" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              CSS
            </TabsTrigger>
            <TabsTrigger value="js" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              JavaScript
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="html" className="mt-6">
            <CodeSection code={htmlCode} language="html" filename="index.html" />
          </TabsContent>
          
          <TabsContent value="css" className="mt-6">
            <CodeSection code={cssCode} language="css" filename="styles.css" />
          </TabsContent>
          
          <TabsContent value="js" className="mt-6">
            <CodeSection code={jsCode} language="js" filename="script.js" />
          </TabsContent>
        </Tabs>

        <div className="flex justify-center pt-4">
          <Button
            variant="accent"
            onClick={() => {
              const allCode = `<!-- HTML -->\n${htmlCode}\n\n/* CSS */\n${cssCode}\n\n// JavaScript\n${jsCode}`;
              copyToClipboard(allCode, "all");
            }}
            className="w-full max-w-xs"
          >
            {copiedSection === "all" ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            Copy All Code
          </Button>
        </div>
      </div>
    </Card>
  );
};