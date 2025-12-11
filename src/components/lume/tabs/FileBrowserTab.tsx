import { useState } from "react";
import {
  FolderTree,
  Folder,
  File,
  ChevronRight,
  ChevronDown,
  HardDrive,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FileNode {
  name: string;
  type: "file" | "folder";
  size?: number;
  children?: FileNode[];
}

interface FileBrowserTabProps {
  fileTree: FileNode;
}

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const FileTreeItem = ({
  node,
  depth = 0,
}: {
  node: FileNode;
  depth?: number;
}) => {
  const [isOpen, setIsOpen] = useState(depth < 2);

  if (node.type === "folder") {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 w-full text-left py-1.5 px-2 rounded hover:bg-secondary/50 transition-colors"
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
          <Folder className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">{node.name}</span>
          {node.children && (
            <Badge variant="secondary" className="text-xs ml-auto font-mono">
              {node.children.length} items
            </Badge>
          )}
        </button>
        {isOpen && node.children && (
          <div>
            {node.children.map((child, index) => (
              <FileTreeItem key={index} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  const getFileColor = (name: string) => {
    if (name.endsWith(".json")) return "text-yellow-500";
    if (name.endsWith(".txt")) return "text-blue-500";
    return "text-muted-foreground";
  };

  return (
    <div
      className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-secondary/50 transition-colors"
      style={{ paddingLeft: `${depth * 16 + 32}px` }}
    >
      <File className={`w-4 h-4 ${getFileColor(node.name)}`} />
      <span className="text-sm text-foreground truncate flex-1">{node.name}</span>
      {node.size && (
        <span className="text-xs text-muted-foreground font-mono">
          {formatBytes(node.size)}
        </span>
      )}
    </div>
  );
};

const countFiles = (node: FileNode): number => {
  if (node.type === "file") return 1;
  if (node.children) {
    return node.children.reduce((acc, child) => acc + countFiles(child), 0);
  }
  return 0;
};

const getTotalSize = (node: FileNode): number => {
  if (node.type === "file") return node.size || 0;
  if (node.children) {
    return node.children.reduce((acc, child) => acc + getTotalSize(child), 0);
  }
  return 0;
};

export const FileBrowserTab = ({ fileTree }: FileBrowserTabProps) => {
  const totalFiles = countFiles(fileTree);
  const totalSize = getTotalSize(fileTree);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-primary" />
            Extracted Files
          </h2>
          <p className="text-muted-foreground mt-1">
            Browse the extracted evidence bundle
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-sm">
            <File className="w-3 h-3 mr-1" />
            {totalFiles} files
          </Badge>
          <Badge variant="secondary" className="text-sm">
            <HardDrive className="w-3 h-3 mr-1" />
            {formatBytes(totalSize)}
          </Badge>
        </div>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
            <Folder className="w-4 h-4" />
            {fileTree.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-[600px] overflow-y-auto">
            {fileTree.children?.map((child, index) => (
              <FileTreeItem key={index} node={child} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
