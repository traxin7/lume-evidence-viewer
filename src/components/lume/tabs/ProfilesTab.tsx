import { Chrome, Globe, Mail, Folder } from "lucide-react";
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
        return <Globe className="w-5 h-5" />;
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Browser Profiles</h2>
        <p className="text-muted-foreground mt-1">
          Detected browser profiles from the evidence bundle
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profiles.map((profile, index) => (
          <Card key={index} className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className={`flex items-center gap-2 ${getBrowserColor(profile.browser)}`}>
                  {getBrowserIcon(profile.browser)}
                  <span className="capitalize text-foreground">{profile.browser}</span>
                </div>
                <Badge variant="secondary" className="font-mono text-xs">
                  {profile.profileDir}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Folder className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Display Name:</span>
                <span className="text-foreground font-medium">{profile.displayName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Email:</span>
                <span className="text-foreground font-mono text-xs">{profile.email}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
