import { useState, useEffect } from "react";
import { FormInput, Clock, Tag } from "lucide-react";
import { DataTable } from "../DataTable";
import { AutofillEntry, BrowserProfile } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { ProfileGrid } from "../ProfileGrid";

interface AutofillTabProps {
  autofill: AutofillEntry[];
  profiles: BrowserProfile[];
  initialSearch?: string;
}

export const AutofillTab = ({ autofill, profiles, initialSearch = "" }: AutofillTabProps) => {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

  // Auto-select first profile with matching data when searching
  useEffect(() => {
    if (initialSearch && !selectedProfile) {
      const searchTerm = initialSearch.toLowerCase();
      for (const profile of profiles) {
        const profileKey = `${profile.browser}|${profile.profileDir}`;
        const hasMatch = autofill.some(
          (a) =>
            (`${a.browser}|${a.profile}` === profileKey) &&
            (a.name?.toLowerCase().includes(searchTerm) ||
              a.value?.toLowerCase().includes(searchTerm))
        );
        if (hasMatch) {
          setSelectedProfile(profileKey);
          break;
        }
      }
    }
  }, [initialSearch, profiles, autofill, selectedProfile]);

  const filteredAutofill = selectedProfile
    ? autofill.filter((a) => `${a.browser}|${a.profile}` === selectedProfile)
    : [];

  const getDataCount = (browser: string, profile: string) => {
    return autofill.filter((a) => a.browser === browser && a.profile === profile).length;
  };

  const columns = [
    {
      key: "name",
      label: "Field Name",
      render: (item: AutofillEntry) => (
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-primary" />
          <span className="font-mono text-sm text-foreground">{item.name}</span>
        </div>
      ),
    },
    {
      key: "value",
      label: "Value",
      render: (item: AutofillEntry) => (
        <span className="font-mono text-sm text-muted-foreground bg-secondary/50 px-2 py-1 rounded">
          {item.value}
        </span>
      ),
    },
    {
      key: "usedAt",
      label: "Last Used",
      className: "whitespace-nowrap",
      render: (item: AutofillEntry) => (
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span className="font-mono text-xs">{item.usedAt}</span>
        </div>
      ),
    },
  ];

  const emailEntries = filteredAutofill.filter((a) => a.name.toLowerCase().includes("email"));
  const uniqueFields = new Set(filteredAutofill.map((a) => a.name)).size;

  return (
    <div className="space-y-6">
      <ProfileGrid
        profiles={profiles}
        selectedProfile={selectedProfile}
        onSelectProfile={setSelectedProfile}
        title="Autofill Data"
        icon={<FormInput className="w-6 h-6 text-primary" />}
        dataCount={getDataCount}
      />

      {selectedProfile && (
        <>
          <div className="flex items-center gap-4">
            <p className="text-muted-foreground">
              {filteredAutofill.length} entries across {uniqueFields} fields
            </p>
            <Badge variant="secondary" className="text-sm">
              {emailEntries.length} Email Entries
            </Badge>
          </div>
          <DataTable
            data={filteredAutofill}
            columns={columns}
            searchKeys={["name", "value"] as (keyof AutofillEntry)[]}
            pageSize={15}
            initialSearch={initialSearch}
          />
        </>
      )}
    </div>
  );
};
