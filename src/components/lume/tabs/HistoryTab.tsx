import { History, ExternalLink, Eye } from "lucide-react";
import { DataTable } from "../DataTable";
import { HistoryEntry } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";

interface HistoryTabProps {
  history: HistoryEntry[];
}

export const HistoryTab = ({ history }: HistoryTabProps) => {
  const columns = [
    {
      key: "title",
      label: "Title",
      render: (item: HistoryEntry) => (
        <div className="max-w-md">
          <p className="font-medium text-foreground truncate">{item.title}</p>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline truncate block mt-1 flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" />
            {item.url.substring(0, 60)}...
          </a>
        </div>
      ),
    },
    {
      key: "lastVisitTime",
      label: "Last Visit",
      className: "whitespace-nowrap",
      render: (item: HistoryEntry) => (
        <span className="font-mono text-xs text-muted-foreground">
          {item.lastVisitTime}
        </span>
      ),
    },
    {
      key: "visitCount",
      label: "Visits",
      className: "text-center",
      render: (item: HistoryEntry) => (
        <Badge variant="secondary" className="font-mono">
          <Eye className="w-3 h-3 mr-1" />
          {item.visitCount}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <History className="w-6 h-6 text-primary" />
          Browsing History
        </h2>
        <p className="text-muted-foreground mt-1">
          {history.length} entries found across all browsers
        </p>
      </div>

      <DataTable
        data={history}
        columns={columns}
        searchKeys={["title", "url"] as (keyof HistoryEntry)[]}
        pageSize={15}
      />
    </div>
  );
};
