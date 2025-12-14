import { CaseInfoCard } from "./CaseInfoCard";
import { VerificationCard } from "./VerificationCard";
import { CustodyChain } from "./CustodyChain";
import { AnalyzeUploader } from "./AnalyzeUploader";
import {
  CaseInfo,
  VerificationResult,
  CustodyEntry,
  BrowserProfile,
  HistoryEntry,
  DownloadEntry,
  PasswordEntry,
  CookieEntry,
} from "@/lib/mockData";
import { Card, CardContent } from "@/components/ui/card";
import {
  History,
  Download,
  Key,
  Cookie,
  Users,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

interface DashboardProps {
  caseInfo: CaseInfo | null;
  verification: VerificationResult | null;
  custodyChain: CustodyEntry[];
  profiles: BrowserProfile[];
  history: HistoryEntry[];
  downloads: DownloadEntry[];
  cookies: CookieEntry[];
  passwords: PasswordEntry[];
  onRefresh?: () => void;
}

export const Dashboard = ({
  caseInfo,
  verification,
  custodyChain,
  profiles,
  history,
  downloads,
  cookies,
  passwords,
  onRefresh,
}: DashboardProps) => {
  // Check if we have any actual data loaded
  const hasData = caseInfo || verification || profiles.length > 0 || history.length > 0;

  const stats = [
    {
      label: "Browser Profiles",
      value: profiles.length,
      icon: <Users className="w-5 h-5" />,
      color: "text-primary",
    },
    {
      label: "History Entries",
      value: history.length,
      icon: <History className="w-5 h-5" />,
      color: "text-chart-1",
    },
    {
      label: "Downloads",
      value: downloads.length,
      icon: <Download className="w-5 h-5" />,
      color: "text-chart-2",
    },
    {
      label: "Saved Passwords",
      value: passwords.length,
      icon: <Key className="w-5 h-5" />,
      color: "text-destructive",
    },
    {
      label: "Cookies",
      value: cookies.length,
      icon: <Cookie className="w-5 h-5" />,
      color: "text-chart-4",
    },
    {
      label: "Files Verified",
      value: verification ? `${verification.verifiedFiles}/${verification.totalFiles}` : "N/A",
      icon: <FileCheck className="w-5 h-5" />,
      color: "text-success",
    },
  ];

  const allFilesVerified = verification?.allFilesVerified ?? false;

  // Show only uploader when no data is loaded
  if (!hasData) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
          <p className="text-muted-foreground mt-1">
            Upload an evidence bundle to begin analysis
          </p>
        </div>

        <Card className="border-2 border-dashed border-muted-foreground/30">
          <CardContent className="py-12 text-center">
            <FileCheck className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Evidence Bundle Loaded</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Drop an encrypted evidence bundle and hash file below to analyze browser data, 
              verify integrity, and view chain of custody information.
            </p>
          </CardContent>
        </Card>

        <AnalyzeUploader onAnalyzeComplete={onRefresh || (() => window.location.reload())} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground mt-1">
          Evidence bundle analysis overview
        </p>
      </div>

      {/* Status Banner */}
      <Card className={`border-2 ${allFilesVerified ? "border-success bg-success/5" : "border-destructive bg-destructive/5"}`}>
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            {allFilesVerified ? (
              <CheckCircle2 className="w-10 h-10 text-success" />
            ) : (
              <AlertTriangle className="w-10 h-10 text-destructive" />
            )}
            <div>
              <h3 className="text-lg font-bold text-foreground">
                {allFilesVerified
                  ? "All Checks Passed - Evidence Integrity Verified"
                  : "Verification Failed - Evidence May Be Compromised"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {verification
                  ? `Bundle hash verified • ${verification.verifiedFiles} files verified • Chain of custody recorded`
                  : "Verification data not available"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-card border-border">
            <CardContent className="pt-4 pb-4">
              <div className={`${stat.color} mb-2`}>{stat.icon}</div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {caseInfo && <CaseInfoCard caseInfo={caseInfo} />}
        {verification && <VerificationCard verification={verification} />}
      </div>

      {/* Custody Chain */}
      {custodyChain.length > 0 && <CustodyChain entries={custodyChain} />}

      {/* Analyze Uploader */}
      <AnalyzeUploader onAnalyzeComplete={onRefresh || (() => window.location.reload())} />
    </div>
  );
};
