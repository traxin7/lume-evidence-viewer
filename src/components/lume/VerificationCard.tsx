import { ShieldCheck, ShieldX, FileCheck, Clock, AlertTriangle, FileX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VerificationResult } from "@/lib/mockData";
import { ScrollArea } from "@/components/ui/scroll-area";

interface VerificationCardProps {
  verification: VerificationResult;
}

export const VerificationCard = ({ verification }: VerificationCardProps) => {
  const allPassed = verification.allFilesVerified && verification.bundleHashVerified;
  const hasFailedFiles = verification.failedFileList && verification.failedFileList.length > 0;

  return (
    <Card className={`bg-card border-border ${allPassed ? "ring-1 ring-success/30" : "ring-1 ring-destructive/30"}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg">
            {allPassed ? (
              <ShieldCheck className="w-5 h-5 text-success" />
            ) : (
              <ShieldX className="w-5 h-5 text-destructive" />
            )}
            Verification Status
          </div>
          <Badge
            variant={allPassed ? "default" : "destructive"}
            className={allPassed ? "bg-success text-success-foreground" : ""}
          >
            {allPassed ? "VERIFIED" : "FAILED"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <StatusItem
            label="Bundle Hash"
            verified={verification.bundleHashVerified}
          />
          <StatusItem
            label="All Files"
            verified={verification.allFilesVerified}
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileCheck className="w-4 h-4" />
            <span className="text-sm">Files Verified</span>
          </div>
          <span className="font-mono text-sm text-foreground">
            {verification.verifiedFiles} / {verification.totalFiles}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Timestamp</span>
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            {verification.verificationTimestamp}
          </span>
        </div>

        {/* Failed Files Section */}
        {hasFailedFiles && (
          <div className="pt-2 border-t border-border space-y-2">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Failed Files ({verification.failedFileList.length})</span>
            </div>
            <ScrollArea className="max-h-32">
              <div className="space-y-1">
                {verification.failedFileList.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-2 rounded bg-destructive/10 border border-destructive/20"
                  >
                    <FileX className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                    <span className="text-xs font-mono text-destructive break-all">
                      {file}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface StatusItemProps {
  label: string;
  verified: boolean;
}

const StatusItem = ({ label, verified }: StatusItemProps) => (
  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
    <span className="text-sm text-muted-foreground">{label}</span>
    <div className={`flex items-center gap-1 text-sm font-medium ${verified ? "text-success" : "text-destructive"}`}>
      {verified ? (
        <>
          <ShieldCheck className="w-4 h-4" />
          <span>Pass</span>
        </>
      ) : (
        <>
          <ShieldX className="w-4 h-4" />
          <span>Fail</span>
        </>
      )}
    </div>
  </div>
);
