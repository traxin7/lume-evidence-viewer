import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileArchive, FileKey, Play, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DropZoneProps {
  label: string;
  description: string;
  icon: React.ReactNode;
  file: string | null;
  onDrop: (path: string) => void;
  accept: string;
  filterName: string;
  filterExtensions: string[];
}

function DropZone({ label, description, icon, file, onDrop, accept, filterName, filterExtensions }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      // In Electron, we can get the path from the file
      const filePath = (files[0] as any).path;
      if (filePath) {
        onDrop(filePath);
      }
    }
  }, [onDrop]);

  const handleClick = async () => {
    if (window.electronAPI) {
      const path = await window.electronAPI.selectFile(
        [{ name: filterName, extensions: filterExtensions }],
        `Select ${label}`
      );
      if (path) {
        onDrop(path);
      }
    }
  };

  return (
    <div
      className={`
        border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
        ${isDragOver ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}
        ${file ? 'bg-muted/50' : ''}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <div className="flex flex-col items-center gap-3">
        <div className={`p-3 rounded-full ${file ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
          {file ? <CheckCircle className="h-6 w-6" /> : icon}
        </div>
        <div>
          <p className="font-medium text-foreground">{label}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {file && (
          <p className="text-xs text-primary font-mono truncate max-w-full px-4">
            {file.split(/[\\/]/).pop()}
          </p>
        )}
      </div>
    </div>
  );
}

interface AnalyzeUploaderProps {
  onAnalyzeComplete: () => void;
}

export function AnalyzeUploader({ onAnalyzeComplete }: AnalyzeUploaderProps) {
  const [bundlePath, setBundlePath] = useState<string | null>(null);
  const [hashPath, setHashPath] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const canAnalyze = bundlePath && hashPath && !isAnalyzing;

  const handleAnalyze = async () => {
    if (!bundlePath || !hashPath || !window.electronAPI) return;

    setIsAnalyzing(true);
    setError(null);
    setProgress([]);

    // Listen for progress updates
    window.electronAPI.onAnalyzeProgress((data: string) => {
      setProgress(prev => [...prev, data]);
    });

    try {
      const result = await window.electronAPI.analyzeBundle(bundlePath, hashPath);
      
      toast({
        title: "Analysis Complete",
        description: "Evidence bundle has been analyzed successfully.",
      });
      
      // Trigger reload of data
      onAnalyzeComplete();
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Analysis Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Check if running in Electron
  if (typeof window !== 'undefined' && !window.electronAPI) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Analyze Evidence Bundle
          </CardTitle>
          <CardDescription>
            This feature requires the desktop application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <XCircle className="h-12 w-12 mx-auto mb-4 text-destructive/50" />
            <p>File analysis requires running in Electron desktop mode.</p>
            <p className="text-sm mt-2">
              Run with: <code className="bg-muted px-2 py-1 rounded">npm run electron:dev</code>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Analyze Evidence Bundle
        </CardTitle>
        <CardDescription>
          Drop or select the encrypted bundle and hash file to analyze
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <DropZone
            label="Encrypted Bundle"
            description="*.tar.enc file"
            icon={<FileArchive className="h-6 w-6" />}
            file={bundlePath}
            onDrop={setBundlePath}
            accept=".tar.enc"
            filterName="Encrypted Bundle"
            filterExtensions={['tar.enc', 'enc']}
          />
          <DropZone
            label="Hash File"
            description="*.sha256 file"
            icon={<FileKey className="h-6 w-6" />}
            file={hashPath}
            onDrop={setHashPath}
            accept=".sha256"
            filterName="SHA256 Hash"
            filterExtensions={['sha256', 'plain.sha256']}
          />
        </div>

        <Button
          onClick={handleAnalyze}
          disabled={!canAnalyze}
          className="w-full"
          size="lg"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Analyze Bundle
            </>
          )}
        </Button>

        {progress.length > 0 && (
          <div className="bg-muted/50 rounded-lg p-4 max-h-40 overflow-y-auto">
            <p className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
              {progress.join('')}
            </p>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
