import { useState } from "react";
import { Cookie, Lock, Unlock, Clock, Globe } from "lucide-react";
import { DataTable } from "../DataTable";
import { CookieEntry, BrowserProfile } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { ProfileSelector } from "../ProfileSelector";

interface CookiesTabProps {
  cookies: CookieEntry[];
  profiles: BrowserProfile[];
}

export const CookiesTab = ({ cookies, profiles }: CookiesTabProps) => {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

  const filteredCookies = selectedProfile
    ? cookies.filter((c) => `${c.browser}|${c.profile}` === selectedProfile)
    : cookies;

  const columns = [
    {
      key: "host",
      label: "Host",
      render: (item: CookieEntry) => (
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <span className="font-mono text-sm text-foreground">{item.host}</span>
        </div>
      ),
    },
    {
      key: "name",
      label: "Name",
      render: (item: CookieEntry) => (
        <span className="font-mono text-sm text-primary">{item.name}</span>
      ),
    },
    {
      key: "value",
      label: "Value",
      render: (item: CookieEntry) => (
        <div className="max-w-xs">
          <span className="font-mono text-xs text-muted-foreground truncate block">
            {item.value.substring(0, 40)}...
          </span>
        </div>
      ),
    },
    {
      key: "browser",
      label: "Profile",
      render: (item: CookieEntry) => (
        <Badge variant="outline" className="font-mono text-xs">
          {item.browser} / {item.profile}
        </Badge>
      ),
    },
    {
      key: "isSecure",
      label: "Security",
      className: "text-center",
      render: (item: CookieEntry) => (
        <div className="flex items-center gap-2 justify-center">
          {item.isSecure ? (
            <Badge variant="default" className="bg-success text-success-foreground">
              <Lock className="w-3 h-3 mr-1" />
              Secure
            </Badge>
          ) : (
            <Badge variant="secondary">
              <Unlock className="w-3 h-3 mr-1" />
              Plain
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "expiryDate",
      label: "Expires",
      className: "whitespace-nowrap",
      render: (item: CookieEntry) => (
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span className="font-mono text-xs">{item.expiryDate}</span>
        </div>
      ),
    },
  ];

  const secureCookies = filteredCookies.filter((c) => c.isSecure).length;
  const uniqueHosts = new Set(filteredCookies.map((c) => c.host)).size;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Cookie className="w-6 h-6 text-primary" />
            Browser Cookies
          </h2>
          <p className="text-muted-foreground mt-1">
            {filteredCookies.length} cookies from {uniqueHosts} domains
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ProfileSelector
            profiles={profiles}
            selectedProfile={selectedProfile}
            onSelectProfile={setSelectedProfile}
          />
          <Badge variant="secondary" className="text-sm">
            <Lock className="w-3 h-3 mr-1" />
            {secureCookies} Secure
          </Badge>
          <Badge variant="secondary" className="text-sm">
            <Unlock className="w-3 h-3 mr-1" />
            {filteredCookies.length - secureCookies} Plain
          </Badge>
        </div>
      </div>

      <DataTable
        data={filteredCookies}
        columns={columns}
        searchKeys={["host", "name", "value"] as (keyof CookieEntry)[]}
        pageSize={10}
      />
    </div>
  );
};
