import { Chrome, Globe, Flame, Mail, Folder } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrowserProfile } from "@/lib/mockData";

interface ProfilesTabProps {
  profiles: BrowserProfile[];
}

export const ProfilesTab = ({ profiles }: ProfilesTabProps) => {
  const getBrowserIcon = (browser: string) => {
    switch (browser.toLowerCase()) {
      case "chrome":
        return <Chrome className="w-5 h-5" />;
      case "firefox":
        return <Flame className="w-5 h-5" />;
      case "edge":
        return <Globe className="w-5 h-5" />;
      default:
        return <Globe className="w-5 h-5" />;
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

  // Group profiles by browser
  const groupedProfiles = profiles.reduce((acc, profile) => {
    const browser = profile.browser;
    if (!acc[browser]) acc[browser] = [];
    acc[browser].push(profile);
    return acc;
  }, {} as Record<string, BrowserProfile[]>);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Browser Profiles</h2>
        <p className="text-muted-foreground mt-1">
          {profiles.length} profiles detected across {Object.keys(groupedProfiles).length} browsers
        </p>
      </div>

      {Object.entries(groupedProfiles).map(([browser, browserProfiles]) => (
        <div key={browser} className="space-y-4">
          <div className={`flex items-center gap-2 ${getBrowserColor(browser)}`}>
            {getBrowserIcon(browser)}
            <h3 className="text-lg font-semibold text-foreground">{browser}</h3>
            <Badge variant="secondary" className="ml-2">
              {browserProfiles.length} profile{browserProfiles.length !== 1 ? "s" : ""}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {browserProfiles.map((profile, index) => (
              <Card key={index} className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className={`flex items-center gap-2 ${getBrowserColor(profile.browser)}`}>
                      {getBrowserIcon(profile.browser)}
                      <span className="text-foreground text-base">
                        {profile.displayName || profile.profileDir}
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Folder className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Profile Dir:</span>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {profile.profileDir}
                    </Badge>
                  </div>
                  {profile.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Email:</span>
                      <span className="text-foreground font-mono text-xs">{profile.email}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
