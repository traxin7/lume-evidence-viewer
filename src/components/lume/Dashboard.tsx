import { CaseInfoCard } from "./CaseInfoCard";
import { VerificationCard } from "./VerificationCard";
import { CustodyChain } from "./CustodyChain";
import {
  mockCaseInfo,
  mockVerification,
  mockCustodyChain,
  mockHistory,
  mockDownloads,
  mockPasswords,
  mockCookies,
  mockProfiles,
} from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export const Dashboard = () => {
  const stats = [
    {
      label: "Browser Profiles",
      value: mockProfiles.length,
      icon: <Users className="w-5 h-5" />,
      color: "text-primary",
    },
    {
      label: "History Entries",
      value: mockHistory.length,
      icon: <History className="w-5 h-5" />,
      color: "text-chart-1",
    },
    {
      label: "Downloads",
      value: mockDownloads.length,
      icon: <Download className="w-5 h-5" />,
      color: "text-chart-2",
    },
    {
      label: "Saved Passwords",
      value: mockPasswords.length,
      icon: <Key className="w-5 h-5" />,
      color: "text-destructive",
    },
    {
      label: "Cookies",
      value: mockCookies.length,
      icon: <Cookie className="w-5 h-5" />,
      color: "text-chart-4",
    },
    {
      label: "Files Verified",
      value: `${mockVerification.verifiedFiles}/${mockVerification.totalFiles}`,
      icon: <FileCheck className="w-5 h-5" />,
      color: "text-success",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground mt-1">
          Evidence bundle analysis overview
        </p>
      </div>

      {/* Status Banner */}
      <Card className={`border-2 ${mockVerification.allFilesVerified ? "border-success bg-success/5" : "border-destructive bg-destructive/5"}`}>
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            {mockVerification.allFilesVerified ? (
              <CheckCircle2 className="w-10 h-10 text-success" />
            ) : (
              <AlertTriangle className="w-10 h-10 text-destructive" />
            )}
            <div>
              <h3 className="text-lg font-bold text-foreground">
                {mockVerification.allFilesVerified
                  ? "All Checks Passed - Evidence Integrity Verified"
                  : "Verification Failed - Evidence May Be Compromised"}
              </h3>
              <p className="text-sm text-muted-foreground">
                Bundle hash verified • {mockVerification.verifiedFiles} files
                verified • Chain of custody recorded
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
        <CaseInfoCard caseInfo={mockCaseInfo} />
        <VerificationCard verification={mockVerification} />
      </div>

      {/* Custody Chain */}
      <CustodyChain entries={mockCustodyChain} />
    </div>
  );
};
