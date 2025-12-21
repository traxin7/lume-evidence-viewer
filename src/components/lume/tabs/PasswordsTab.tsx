import { Key, Eye, EyeOff, Globe, User, AlertTriangle } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { PasswordEntry, BrowserProfile } from "@/lib/mockData";
import { ProfileGrid } from "../ProfileGrid";

interface PasswordsTabProps {
  passwords: PasswordEntry[];
  profiles: BrowserProfile[];
  initialSearch?: string;
}

export const PasswordsTab = ({ passwords, profiles, initialSearch = "" }: PasswordsTabProps) => {
  const [showPasswords, setShowPasswords] = useState<Record<number, boolean>>({});
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [search, setSearch] = useState(initialSearch);

  // Update search when initialSearch changes
  useEffect(() => {
    if (initialSearch) {
      setSearch(initialSearch);
    }
  }, [initialSearch]);

  // Auto-select first profile with matching data when searching
  useEffect(() => {
    if (initialSearch && !selectedProfile) {
      const searchTerm = initialSearch.toLowerCase();
      for (const profile of profiles) {
        const profileKey = `${profile.browser}|${profile.profileDir}`;
        const hasMatch = passwords.some(
          (p) =>
            (`${p.browser}|${p.profile}` === profileKey) &&
            (p.url?.toLowerCase().includes(searchTerm) ||
              p.username?.toLowerCase().includes(searchTerm))
        );
        if (hasMatch) {
          setSelectedProfile(profileKey);
          break;
        }
      }
    }
  }, [initialSearch, profiles, passwords, selectedProfile]);

  const filteredPasswords = selectedProfile
    ? passwords.filter((p) => `${p.browser}|${p.profile}` === selectedProfile)
    : [];

  const searchedPasswords = useMemo(() => {
    if (!search) return filteredPasswords;
    const searchTerm = search.toLowerCase();
    return filteredPasswords.filter(
      (p) =>
        p.url?.toLowerCase().includes(searchTerm) ||
        p.username?.toLowerCase().includes(searchTerm)
    );
  }, [filteredPasswords, search]);

  const getDataCount = (browser: string, profile: string) => {
    return passwords.filter((p) => p.browser === browser && p.profile === profile).length;
  };

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
      <ProfileGrid
        profiles={profiles}
        selectedProfile={selectedProfile}
        onSelectProfile={setSelectedProfile}
        title="Saved Passwords"
        icon={<Key className="w-6 h-6 text-primary" />}
        dataCount={getDataCount}
      />

      {selectedProfile && (
        <>
          <div className="flex items-center gap-4">
            <p className="text-muted-foreground">{searchedPasswords.length} credentials found</p>
            <Badge variant="destructive" className="text-sm">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Sensitive Data
            </Badge>
          </div>

          <Alert className="border-warning bg-warning/10">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <AlertDescription className="text-warning">
              This data contains sensitive credentials. Handle with care and follow proper evidence handling procedures.
            </AlertDescription>
          </Alert>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search passwords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-secondary/50"
            />
          </div>

          <div className="grid gap-4">
            {searchedPasswords.map((password, index) => (
              <Card key={index} className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <span className="font-mono text-primary">{getDomain(password.url)}</span>
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
        </>
      )}
    </div>
  );
};
