import { useState } from "react";
import { Download, CheckCircle, Clock, File, HardDrive } from "lucide-react";
import { DataTable } from "../DataTable";
import { DownloadEntry, BrowserProfile } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { ProfileSelector } from "../ProfileSelector";

interface DownloadsTabProps {
  downloads: DownloadEntry[];
  profiles: BrowserProfile[];
}

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleString();
};

const getFileName = (path: string) => {
  return path.split("\\").pop() || path;
};

export const DownloadsTab = ({ downloads, profiles }: DownloadsTabProps) => {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

  const filteredDownloads = selectedProfile
    ? downloads.filter((d) => `${d.browser}|${d.profile}` === selectedProfile)
    : downloads;

  const columns = [
    {
      key: "targetPath",
      label: "File",
      render: (item: DownloadEntry) => (
        <div className="max-w-xs">
          <div className="flex items-center gap-2">
            <File className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="font-medium text-foreground truncate">
              {getFileName(item.targetPath)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground truncate mt-1 pl-6">
            {item.targetPath}
          </p>
        </div>
      ),
    },
    {
      key: "browser",
      label: "Profile",
      render: (item: DownloadEntry) => (
        <Badge variant="outline" className="font-mono text-xs">
          {item.browser} / {item.profile}
        </Badge>
      ),
    },
    {
      key: "totalBytes",
      label: "Size",
      className: "text-right",
      render: (item: DownloadEntry) => (
        <div className="flex items-center gap-1 justify-end text-muted-foreground">
          <HardDrive className="w-3 h-3" />
          <span className="font-mono text-sm">{formatBytes(item.totalBytes)}</span>
        </div>
      ),
    },
    {
      key: "startTime",
      label: "Date",
      className: "whitespace-nowrap",
      render: (item: DownloadEntry) => (
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span className="font-mono text-xs">{formatDate(item.startTime)}</span>
        </div>
      ),
    },
    {
      key: "state",
      label: "Status",
      className: "text-center",
      render: (item: DownloadEntry) => (
        <Badge
          variant={item.state === 1 ? "default" : "secondary"}
          className={item.state === 1 ? "bg-success text-success-foreground" : ""}
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          {item.state === 1 ? "Complete" : "Incomplete"}
        </Badge>
      ),
    },
  ];

  const totalSize = filteredDownloads.reduce((acc, d) => acc + d.totalBytes, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Download className="w-6 h-6 text-primary" />
            Download History
          </h2>
          <p className="text-muted-foreground mt-1">
            {filteredDownloads.length} downloads recorded
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ProfileSelector
            profiles={profiles}
            selectedProfile={selectedProfile}
            onSelectProfile={setSelectedProfile}
          />
          <Badge variant="secondary" className="text-sm">
            Total: {formatBytes(totalSize)}
          </Badge>
        </div>
      </div>

      <DataTable
        data={filteredDownloads}
        columns={columns}
        searchKeys={["targetPath", "url"] as (keyof DownloadEntry)[]}
        pageSize={10}
      />
    </div>
  );
};
