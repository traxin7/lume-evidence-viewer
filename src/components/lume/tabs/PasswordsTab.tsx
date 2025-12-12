import { Key, Eye, EyeOff, Globe, User, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PasswordEntry, BrowserProfile } from "@/lib/mockData";
import { ProfileSelector } from "../ProfileSelector";

interface PasswordsTabProps {
  passwords: PasswordEntry[];
  profiles: BrowserProfile[];
}

export const PasswordsTab = ({ passwords, profiles }: PasswordsTabProps) => {
  const [showPasswords, setShowPasswords] = useState<Record<number, boolean>>({});
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

  const filteredPasswords = selectedProfile
    ? passwords.filter((p) => `${p.browser}|${p.profile}` === selectedProfile)
    : passwords;

  const togglePassword = (index: number) => {
    setShowPasswords((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getDomain = (url: string) => {
    try {
      if (url.startsWith("android://")) {
        return url.split("@")[1]?.split("/")[0] || url;
      }
      const domain = new URL(url).hostname;
      return domain;
    } catch {
      return url;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Key className="w-6 h-6 text-primary" />
            Saved Passwords
          </h2>
          <p className="text-muted-foreground mt-1">
            {filteredPasswords.length} credentials recovered
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ProfileSelector
            profiles={profiles}
            selectedProfile={selectedProfile}
            onSelectProfile={setSelectedProfile}
          />
          <Badge variant="destructive" className="text-sm">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Sensitive Data
          </Badge>
        </div>
      </div>

      <Alert className="border-warning bg-warning/10">
        <AlertTriangle className="w-4 h-4 text-warning" />
        <AlertDescription className="text-warning">
          This data contains sensitive credentials. Handle with care and follow proper evidence handling procedures.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4">
        {filteredPasswords.map((password, index) => (
          <Card key={index} className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <span className="font-mono text-primary">{getDomain(password.url)}</span>
                  <Badge variant="outline" className="font-mono text-xs ml-2">
                    {password.browser} / {password.profile}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => togglePassword(index)}
                  className="h-8"
                >
                  {showPasswords[index] ? (
                    <EyeOff className="w-4 h-4 mr-1" />
                  ) : (
                    <Eye className="w-4 h-4 mr-1" />
                  )}
                  {showPasswords[index] ? "Hide" : "Show"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground truncate">{password.url}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <User className="w-3 h-3" />
                    Username
                  </div>
                  <p className="font-mono text-sm text-foreground bg-secondary/50 px-2 py-1 rounded">
                    {password.username || <span className="text-muted-foreground italic">empty</span>}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Key className="w-3 h-3" />
                    Password
                  </div>
                  <p className="font-mono text-sm text-foreground bg-secondary/50 px-2 py-1 rounded">
                    {showPasswords[index] ? (
                      password.password || <span className="text-muted-foreground italic">empty</span>
                    ) : (
                      "••••••••••••"
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
