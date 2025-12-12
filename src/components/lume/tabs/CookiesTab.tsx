import { useState } from "react";
import { Cookie, Lock, Unlock, Clock, Globe } from "lucide-react";
import { DataTable } from "../DataTable";
import { CookieEntry, BrowserProfile } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { ProfileGrid } from "../ProfileGrid";

interface CookiesTabProps {
  cookies: CookieEntry[];
  profiles: BrowserProfile[];
}

export const CookiesTab = ({ cookies, profiles }: CookiesTabProps) => {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

  const filteredCookies = selectedProfile
    ? cookies.filter((c) => `${c.browser}|${c.profile}` === selectedProfile)
    : [];

  const getDataCount = (browser: string, profile: string) => {
    return cookies.filter((c) => c.browser === browser && c.profile === profile).length;
  };

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
      <ProfileGrid
        profiles={profiles}
        selectedProfile={selectedProfile}
        onSelectProfile={setSelectedProfile}
        title="Browser Cookies"
        icon={<Cookie className="w-6 h-6 text-primary" />}
        dataCount={getDataCount}
      />

      {selectedProfile && (
        <>
          <div className="flex items-center gap-4">
            <p className="text-muted-foreground">
              {filteredCookies.length} cookies from {uniqueHosts} domains
            </p>
            <Badge variant="secondary" className="text-sm">
              <Lock className="w-3 h-3 mr-1" />
              {secureCookies} Secure
            </Badge>
            <Badge variant="secondary" className="text-sm">
              <Unlock className="w-3 h-3 mr-1" />
              {filteredCookies.length - secureCookies} Plain
            </Badge>
          </div>
          <DataTable
            data={filteredCookies}
            columns={columns}
            searchKeys={["host", "name", "value"] as (keyof CookieEntry)[]}
            pageSize={10}
          />
        </>
      )}
    </div>
  );
};
