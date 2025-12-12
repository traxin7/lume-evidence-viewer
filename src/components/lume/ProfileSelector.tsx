import { Chrome, Globe, Flame, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { BrowserProfile } from "@/lib/mockData";

interface ProfileSelectorProps {
  profiles: BrowserProfile[];
  selectedProfile: string | null; // Format: "browser|profile"
  onSelectProfile: (profile: string | null) => void;
}

export const ProfileSelector = ({
  profiles,
  selectedProfile,
  onSelectProfile,
}: ProfileSelectorProps) => {
  const getBrowserIcon = (browser: string) => {
    switch (browser.toLowerCase()) {
      case "chrome":
        return <Chrome className="w-4 h-4" />;
      case "firefox":
        return <Flame className="w-4 h-4" />;
      case "edge":
        return <Globe className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const getBrowserColor = (browser: string) => {
    switch (browser.toLowerCase()) {
      case "chrome":
        return "text-yellow-500";
      case "firefox":
        return "text-orange-500";
      case "edge":
        return "text-blue-500";
      default:
        return "text-muted-foreground";
    }
  };

  const getSelectedLabel = () => {
    if (!selectedProfile) return "All Profiles";
    const [browser, profile] = selectedProfile.split("|");
    return `${browser} - ${profile}`;
  };

  const getSelectedBrowser = () => {
    if (!selectedProfile) return null;
    return selectedProfile.split("|")[0];
  };

  // Group profiles by browser
  const groupedProfiles = profiles.reduce((acc, profile) => {
    const browser = profile.browser;
    if (!acc[browser]) acc[browser] = [];
    acc[browser].push(profile);
    return acc;
  }, {} as Record<string, BrowserProfile[]>);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          {getSelectedBrowser() ? (
            <span className={getBrowserColor(getSelectedBrowser()!)}>
              {getBrowserIcon(getSelectedBrowser()!)}
            </span>
          ) : (
            <User className="w-4 h-4" />
          )}
          {getSelectedLabel()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuItem onClick={() => onSelectProfile(null)}>
          <User className="w-4 h-4 mr-2" />
          All Profiles
          {!selectedProfile && (
            <Badge variant="secondary" className="ml-auto text-xs">
              Active
            </Badge>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {Object.entries(groupedProfiles).map(([browser, browserProfiles]) => (
          <div key={browser}>
            <DropdownMenuLabel className="flex items-center gap-2">
              <span className={getBrowserColor(browser)}>
                {getBrowserIcon(browser)}
              </span>
              <span className="capitalize">{browser}</span>
            </DropdownMenuLabel>
            {browserProfiles.map((profile) => {
              const profileKey = `${profile.browser}|${profile.profileDir}`;
              const isSelected = selectedProfile === profileKey;
              return (
                <DropdownMenuItem
                  key={profileKey}
                  onClick={() => onSelectProfile(profileKey)}
                  className="pl-8"
                >
                  <span className="flex-1">
                    {profile.displayName || profile.profileDir}
                  </span>
                  {isSelected && (
                    <Badge variant="secondary" className="text-xs">
                      Active
                    </Badge>
                  )}
                </DropdownMenuItem>
              );
            })}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
