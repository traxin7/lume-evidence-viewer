import { useState } from "react";
import { Bookmark, Folder, ExternalLink, ChevronRight, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookmarkEntry, BrowserProfile } from "@/lib/mockData";
import { ProfileGrid } from "../ProfileGrid";

interface BookmarksTabProps {
  bookmarks: BookmarkEntry[];
  profiles: BrowserProfile[];
}

const BookmarkItem = ({ item, depth = 0 }: { item: BookmarkEntry; depth?: number }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (item.type === "folder") {
    return (
      <div className="space-y-1">
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
          <span className="text-sm font-medium text-foreground">{item.name}</span>
          {item.children && (
            <Badge variant="secondary" className="text-xs ml-auto">
              {item.children.length}
            </Badge>
          )}
        </button>
        {isOpen && item.children && (
          <div className="space-y-0.5">
            {item.children.map((child, index) => (
              <BookmarkItem key={index} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-secondary/50 transition-colors group"
      style={{ paddingLeft: `${depth * 16 + 32}px` }}
    >
      <Bookmark className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm text-foreground truncate flex-1">{item.name}</span>
      <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </a>
  );
};

export const BookmarksTab = ({ bookmarks, profiles }: BookmarksTabProps) => {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

  // Filter bookmarks by profile if selected
  const filteredBookmarks = selectedProfile
    ? bookmarks.filter((b) => {
        if (b.browser && b.profile) {
          return `${b.browser}|${b.profile}` === selectedProfile;
        }
        return true;
      })
    : [];

  const countBookmarks = (items: BookmarkEntry[]): number => {
    return items.reduce((acc, item) => {
      if (item.type === "url") return acc + 1;
      if (item.children) return acc + countBookmarks(item.children);
      return acc;
    }, 0);
  };

  const getDataCount = (browser: string, profile: string) => {
    const filtered = bookmarks.filter((b) => b.browser === browser && b.profile === profile);
    return countBookmarks(filtered);
  };

  const totalBookmarks = countBookmarks(filteredBookmarks);

  return (
    <div className="space-y-6">
      <ProfileGrid
        profiles={profiles}
        selectedProfile={selectedProfile}
        onSelectProfile={setSelectedProfile}
        title="Bookmarks"
        icon={<Bookmark className="w-6 h-6 text-primary" />}
        dataCount={getDataCount}
      />

      {selectedProfile && (
        <>
          <p className="text-muted-foreground">{totalBookmarks} bookmarks recovered</p>
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Bookmark Tree</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0.5">
                {filteredBookmarks.map((item, index) => (
                  <BookmarkItem key={index} item={item} />
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
