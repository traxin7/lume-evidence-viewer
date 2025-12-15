import { Link, CheckCircle2, XCircle, Clock, User, Shield, AlertTriangle, Monitor, FileCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CustodyReport } from "@/lib/mockData";

interface CustodyChainProps {
  report: CustodyReport | null;
}

export const CustodyChain = ({ report }: CustodyChainProps) => {
  if (!report) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Link className="w-5 h-5 text-primary" />
            Chain of Custody
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No custody report available</p>
        </CardContent>
      </Card>
    );
  }

  const isCompromised = !report.verified;

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg">
            <Link className="w-5 h-5 text-primary" />
            Chain of Custody
          </div>
          {isCompromised ? (
            <Badge variant="destructive" className="text-xs">
              CHAIN COMPROMISED
            </Badge>
          ) : (
            <Badge className="text-xs bg-success text-success-foreground">
              CHAIN VERIFIED
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Report Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
          <div>
            <p className="text-xs text-muted-foreground">Case ID</p>
            <p className="font-mono text-sm">{report.case_id}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Case Name</p>
            <p className="text-sm capitalize">{report.case_name}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Original Investigator</p>
            <p className="text-sm capitalize">{report.original_investigator}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Entries</p>
            <p className="text-sm">{report.total_entries}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Bundle Created</p>
            <p className="font-mono text-xs">{report.bundle_created}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Custody Started</p>
            <p className="font-mono text-xs">{report.custody_started}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-muted-foreground">Report Generated</p>
            <p className="font-mono text-xs">{report.report_generated}</p>
          </div>
        </div>

        {/* Issues */}
        {report.issues.length > 0 && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <span className="text-sm font-medium text-destructive">Chain Issues Detected</span>
            </div>
            <ul className="space-y-1">
              {report.issues.map((issue, index) => (
                <li key={index} className="text-sm text-destructive/80 pl-6">• {issue}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-6">
            {report.entries.map((entry) => (
              <div key={entry.entry_number} className="relative flex gap-4">
                {/* Timeline dot */}
                <div
                  className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    entry.hashValid
                      ? "bg-success/10 border-success"
                      : "bg-destructive/10 border-destructive"
                  }`}
                >
                  {entry.hashValid ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-2">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="font-mono text-xs">
                        #{entry.entry_number} - {entry.action}
                      </Badge>
                      {!entry.hashValid && (
                        <Badge variant="destructive" className="text-xs">
                          HASH BROKEN
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span className="font-mono">{entry.timestamp}</span>
                    </div>
                  </div>

                  {/* Analyst Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <User className="w-4 h-4 text-primary" />
                        Analyst
                      </div>
                      <div className="pl-6 space-y-1 text-sm">
                        <p><span className="text-muted-foreground">Name:</span> <span className="capitalize">{entry.analyst.name}</span></p>
                        <p><span className="text-muted-foreground">Badge ID:</span> <span className="font-mono">{entry.analyst.badge_id}</span></p>
                        <p><span className="text-muted-foreground">Agency:</span> <span className="capitalize">{entry.analyst.agency}</span></p>
                        <p><span className="text-muted-foreground">Purpose:</span> <span className="capitalize">{entry.analyst.purpose}</span></p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Monitor className="w-4 h-4 text-primary" />
                        System
                      </div>
                      <div className="pl-6 space-y-1 text-sm">
                        <p><span className="text-muted-foreground">User:</span> <span className="font-mono">{entry.system.username}</span></p>
                        <p><span className="text-muted-foreground">Computer:</span> <span className="font-mono">{entry.system.computer_name}</span></p>
                        <p><span className="text-muted-foreground">IP:</span> <span className="font-mono">{entry.system.ip_address}</span></p>
                        <p><span className="text-muted-foreground">OS:</span> {entry.system.os}</p>
                      </div>
                    </div>
                  </div>

                  {/* Verification Info */}
                  <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2 text-sm font-medium mb-2">
                      <FileCheck className="w-4 h-4 text-primary" />
                      Verification
                    </div>
                    <div className="flex flex-wrap gap-4 pl-6 text-sm">
                      <div className="flex items-center gap-1">
                        {entry.verification.bundle_hash_match ? (
                          <CheckCircle2 className="w-3 h-3 text-success" />
                        ) : (
                          <XCircle className="w-3 h-3 text-destructive" />
                        )}
                        <span className="text-muted-foreground">Bundle Hash:</span>
                        <span>{entry.verification.bundle_hash_match ? "Match" : "Mismatch"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Files Verified:</span>{" "}
                        <span className="text-success">{entry.verification.files_verified}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Files Failed:</span>{" "}
                        <span className={entry.verification.files_failed > 0 ? "text-destructive" : ""}>
                          {entry.verification.files_failed}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
