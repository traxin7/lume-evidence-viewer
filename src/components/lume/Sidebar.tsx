import {
  LayoutDashboard,
  History,
  Bookmark,
  Download,
  Cookie,
  Key,
  FormInput,
  Puzzle,
  Users,
  FolderTree,
  Link,
  Chrome,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type TabId =
  | "dashboard"
  | "profiles"
  | "history"
  | "bookmarks"
  | "downloads"
  | "cookies"
  | "passwords"
  | "autofill"
  | "extensions"
  | "files"
  | "custody";

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const navItems: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: "profiles", label: "Browser Profiles", icon: <Users className="w-4 h-4" /> },
  { id: "history", label: "Browsing History", icon: <History className="w-4 h-4" /> },
  { id: "bookmarks", label: "Bookmarks", icon: <Bookmark className="w-4 h-4" /> },
  { id: "downloads", label: "Downloads", icon: <Download className="w-4 h-4" /> },
  { id: "cookies", label: "Cookies", icon: <Cookie className="w-4 h-4" /> },
  { id: "passwords", label: "Passwords", icon: <Key className="w-4 h-4" /> },
  { id: "autofill", label: "Autofill Data", icon: <FormInput className="w-4 h-4" /> },
  { id: "extensions", label: "Extensions", icon: <Puzzle className="w-4 h-4" /> },
  { id: "files", label: "File Browser", icon: <FolderTree className="w-4 h-4" /> },
  { id: "custody", label: "Chain of Custody", icon: <Link className="w-4 h-4" /> },
];

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col">
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              activeTab === item.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
            )}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Chrome className="w-3 h-3" />
            <span>Chromium</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Globe className="w-3 h-3" />
            <span>Firefox</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
