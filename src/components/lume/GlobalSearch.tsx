import { useState, useRef, useEffect, useMemo } from "react";
import { Search, History, Cookie, Key, Download, Bookmark, FormInput, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { TabId } from "./Sidebar";
import {
  HistoryEntry,
  CookieEntry,
  PasswordEntry,
  DownloadEntry,
  BookmarkEntry,
  AutofillEntry,
} from "@/lib/mockData";

interface SearchResult {
  type: TabId;
  label: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  data: any;
}

interface GlobalSearchProps {
  history: HistoryEntry[];
  cookies: CookieEntry[];
  passwords: PasswordEntry[];
  downloads: DownloadEntry[];
  bookmarks: BookmarkEntry[];
  autofill: AutofillEntry[];
  onNavigate: (tab: TabId, searchTerm?: string) => void;
}

const flattenBookmarks = (bookmarks: BookmarkEntry[]): BookmarkEntry[] => {
  const flat: BookmarkEntry[] = [];
  const traverse = (items: BookmarkEntry[]) => {
    for (const item of items) {
      if (item.type === "url" && item.url) {
        flat.push(item);
      }
      if (item.children) {
        traverse(item.children);
      }
    }
  };
  traverse(bookmarks);
  return flat;
};

export const GlobalSearch = ({
  history,
  cookies,
  passwords,
  downloads,
  bookmarks,
  autofill,
  onNavigate,
}: GlobalSearchProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const flatBookmarks = useMemo(() => flattenBookmarks(bookmarks), [bookmarks]);

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase();
    const matches: SearchResult[] = [];

    // Search history
    history.forEach((item) => {
      if (
        item.title?.toLowerCase().includes(searchTerm) ||
        item.url?.toLowerCase().includes(searchTerm)
      ) {
        matches.push({
          type: "history",
          label: "History",
          icon: <History className="w-4 h-4" />,
          title: item.title || item.url,
          subtitle: item.url,
          data: item,
        });
      }
    });

    // Search cookies
    cookies.forEach((item) => {
      if (
        item.host?.toLowerCase().includes(searchTerm) ||
        item.name?.toLowerCase().includes(searchTerm) ||
        item.value?.toLowerCase().includes(searchTerm)
      ) {
        matches.push({
          type: "cookies",
          label: "Cookie",
          icon: <Cookie className="w-4 h-4" />,
          title: `${item.host} : ${item.name}`,
          subtitle: item.value?.substring(0, 50) || "",
          data: item,
        });
      }
    });

    // Search passwords
    passwords.forEach((item) => {
      if (
        item.url?.toLowerCase().includes(searchTerm) ||
        item.username?.toLowerCase().includes(searchTerm)
      ) {
        matches.push({
          type: "passwords",
          label: "Password",
          icon: <Key className="w-4 h-4" />,
          title: `${item.username}`,
          subtitle: item.url,
          data: item,
        });
      }
    });

    // Search downloads
    downloads.forEach((item) => {
      const fileName = item.targetPath?.split(/[/\\]/).pop() || item.targetPath;
      if (
        fileName?.toLowerCase().includes(searchTerm) ||
        item.url?.toLowerCase().includes(searchTerm)
      ) {
        matches.push({
          type: "downloads",
          label: "Download",
          icon: <Download className="w-4 h-4" />,
          title: fileName || item.url,
          subtitle: item.url,
          data: item,
        });
      }
    });

    // Search bookmarks
    flatBookmarks.forEach((item) => {
      if (
        item.name?.toLowerCase().includes(searchTerm) ||
        item.url?.toLowerCase().includes(searchTerm)
      ) {
        matches.push({
          type: "bookmarks",
          label: "Bookmark",
          icon: <Bookmark className="w-4 h-4" />,
          title: item.name,
          subtitle: item.url || "",
          data: item,
        });
      }
    });

    // Search autofill
    autofill.forEach((item) => {
      if (
        item.name?.toLowerCase().includes(searchTerm) ||
        item.value?.toLowerCase().includes(searchTerm)
      ) {
        matches.push({
          type: "autofill",
          label: "Autofill",
          icon: <FormInput className="w-4 h-4" />,
          title: `${item.name} : ${item.value}`,
          subtitle: `Last used: ${item.usedAt}`,
          data: item,
        });
      }
    });

    return matches.slice(0, 20); // Limit results
  }, [query, history, cookies, passwords, downloads, flatBookmarks, autofill]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setQuery("");
    }
  };

  const handleSelect = (result: SearchResult) => {
    onNavigate(result.type, query);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div ref={containerRef} className="relative w-80">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => query && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search all data..."
          className="pl-9 pr-8 bg-secondary/50 border-border focus:bg-background"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 overflow-hidden">
          <ScrollArea className="h-[300px]">
            <div className="p-1 space-y-0.5">
              {results.map((result, index) => (
                <button
                  key={`${result.type}-${index}`}
                  onClick={() => handleSelect(result)}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors",
                    selectedIndex === index
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent/50"
                  )}
                >
                  <div className="shrink-0 text-muted-foreground">
                    {result.icon}
                  </div>
                  <span className="text-[10px] font-medium px-1 py-0.5 rounded bg-secondary text-secondary-foreground shrink-0">
                    {result.label}
                  </span>
                  <p className="text-xs font-medium text-foreground truncate flex-1">
                    {result.title}
                  </p>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {isOpen && query && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-lg z-50 p-4 text-center">
          <p className="text-sm text-muted-foreground">No results found</p>
        </div>
      )}
    </div>
  );
};
