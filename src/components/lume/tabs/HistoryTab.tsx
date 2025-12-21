import { useState, useEffect } from "react";
import { History, ExternalLink, Eye } from "lucide-react";
import { DataTable } from "../DataTable";
import { HistoryEntry, BrowserProfile } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { ProfileGrid } from "../ProfileGrid";

interface HistoryTabProps {
  history: HistoryEntry[];
  profiles: BrowserProfile[];
  initialSearch?: string;
}

export const HistoryTab = ({ history, profiles, initialSearch = "" }: HistoryTabProps) => {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

  // Auto-select first profile with matching data when searching
  useEffect(() => {
    if (initialSearch && !selectedProfile) {
      const searchTerm = initialSearch.toLowerCase();
      for (const profile of profiles) {
        const profileKey = `${profile.browser}|${profile.profileDir}`;
        const hasMatch = history.some(
          (h) =>
            (`${h.browser}|${h.profile}` === profileKey) &&
            (h.title?.toLowerCase().includes(searchTerm) ||
              h.url?.toLowerCase().includes(searchTerm))
        );
        if (hasMatch) {
          setSelectedProfile(profileKey);
          break;
        }
      }
    }
  }, [initialSearch, profiles, history, selectedProfile]);

  const filteredHistory = selectedProfile
    ? history.filter((h) => `${h.browser}|${h.profile}` === selectedProfile)
    : [];

  const getDataCount = (browser: string, profile: string) => {
    return history.filter((h) => h.browser === browser && h.profile === profile).length;
  };

  const columns = [
    {
      key: "title",
      label: "Title",
      render: (item: HistoryEntry) => (
        <div className="max-w-md">
          <p className="font-medium text-foreground truncate">{item.title}</p>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline truncate block mt-1 flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" />
            {item.url.substring(0, 60)}...
          </a>
        </div>
      ),
    },
    {
      key: "lastVisitTime",
      label: "Last Visit",
      className: "whitespace-nowrap",
      render: (item: HistoryEntry) => (
        <span className="font-mono text-xs text-muted-foreground">
          {item.lastVisitTime}
        </span>
      ),
    },
    {
      key: "visitCount",
      label: "Visits",
      className: "text-center",
      render: (item: HistoryEntry) => (
        <Badge variant="secondary" className="font-mono">
          <Eye className="w-3 h-3 mr-1" />
          {item.visitCount}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <ProfileGrid
        profiles={profiles}
        selectedProfile={selectedProfile}
        onSelectProfile={setSelectedProfile}
        title="Browsing History"
        icon={<History className="w-6 h-6 text-primary" />}
        dataCount={getDataCount}
      />

      {selectedProfile && (
        <>
          <p className="text-muted-foreground">{filteredHistory.length} entries found</p>
          <DataTable
            data={filteredHistory}
            columns={columns}
            searchKeys={["title", "url"] as (keyof HistoryEntry)[]}
            pageSize={15}
            initialSearch={initialSearch}
          />
        </>
      )}
    </div>
  );
};
