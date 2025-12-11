import { FileText, User, Calendar, Hash, Folder } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CaseInfo } from "@/lib/mockData";

interface CaseInfoCardProps {
  caseInfo: CaseInfo;
}

export const CaseInfoCard = ({ caseInfo }: CaseInfoCardProps) => {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="w-5 h-5 text-primary" />
          Case Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <InfoItem
            icon={<Hash className="w-4 h-4" />}
            label="Case ID"
            value={caseInfo.caseId}
          />
          <InfoItem
            icon={<FileText className="w-4 h-4" />}
            label="Case Name"
            value={caseInfo.caseName}
          />
          <InfoItem
            icon={<User className="w-4 h-4" />}
            label="Investigator"
            value={caseInfo.investigator}
          />
          <InfoItem
            icon={<Folder className="w-4 h-4" />}
            label="Total Files"
            value={caseInfo.totalFiles.toString()}
          />
          <InfoItem
            icon={<Calendar className="w-4 h-4" />}
            label="Created (UTC)"
            value={caseInfo.createdUtc}
            fullWidth
          />
        </div>
      </CardContent>
    </Card>
  );
};

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  fullWidth?: boolean;
}

const InfoItem = ({ icon, label, value, fullWidth }: InfoItemProps) => (
  <div className={`space-y-1 ${fullWidth ? "col-span-2" : ""}`}>
    <div className="flex items-center gap-2 text-muted-foreground">
      {icon}
      <span className="text-xs uppercase tracking-wider">{label}</span>
    </div>
    <p className="font-mono text-sm text-foreground">{value}</p>
  </div>
);
