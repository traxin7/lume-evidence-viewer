import { Chrome, Globe, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrowserProfile } from "@/lib/mockData";

interface ProfileGridProps {
  profiles: BrowserProfile[];
  selectedProfile: string | null;
  onSelectProfile: (profile: string | null) => void;
  title: string;
  icon: React.ReactNode;
  dataCount?: (browser: string, profile: string) => number;
}

const getBrowserIcon = (browser: string) => {
  const lowerBrowser = browser.toLowerCase();
  if (lowerBrowser.includes("chrome")) return "🌐";
  if (lowerBrowser.includes("edge")) return "🔷";
  if (lowerBrowser.includes("firefox")) return "🦊";
  if (lowerBrowser.includes("brave")) return "🦁";
  return "🌐";
};

export const ProfileGrid = ({
  profiles,
  selectedProfile,
  onSelectProfile,
  title,
  icon,
  dataCount,
}: ProfileGridProps) => {
  if (selectedProfile) {
    const [browser, profile] = selectedProfile.split("|");
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={() => onSelectProfile(null)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profiles
        </Button>
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            <p className="text-muted-foreground">
              {getBrowserIcon(browser)} {browser} / {profile}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <p className="text-muted-foreground">Select a browser profile to view data</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {profiles.map((p) => {
          const profileKey = `${p.browser}|${p.profileDir}`;
          const count = dataCount ? dataCount(p.browser, p.profileDir) : null;

          return (
            <Card
              key={profileKey}
              className="cursor-pointer hover:border-primary transition-colors bg-card"
              onClick={() => onSelectProfile(profileKey)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getBrowserIcon(p.browser)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{p.browser}</p>
                    <p className="text-sm text-muted-foreground truncate">{p.displayName || p.profileDir}</p>
                    {count !== null && (
                      <p className="text-xs text-primary mt-1">{count} entries</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
