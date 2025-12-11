import { FormInput, Clock, Tag } from "lucide-react";
import { DataTable } from "../DataTable";
import { AutofillEntry } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";

interface AutofillTabProps {
  autofill: AutofillEntry[];
}

export const AutofillTab = ({ autofill }: AutofillTabProps) => {
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

  const emailEntries = autofill.filter((a) => a.name.toLowerCase().includes("email"));
  const uniqueFields = new Set(autofill.map((a) => a.name)).size;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FormInput className="w-6 h-6 text-primary" />
            Autofill Data
          </h2>
          <p className="text-muted-foreground mt-1">
            {autofill.length} form entries across {uniqueFields} fields
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {emailEntries.length} Email Entries
        </Badge>
      </div>

      <DataTable
        data={autofill}
        columns={columns}
        searchKeys={["name", "value"] as (keyof AutofillEntry)[]}
        pageSize={15}
      />
    </div>
  );
};
