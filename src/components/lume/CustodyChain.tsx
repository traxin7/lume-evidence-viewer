import { Link, CheckCircle2, XCircle, Clock, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CustodyEntry } from "@/lib/mockData";

interface CustodyChainProps {
  entries: CustodyEntry[];
}

export const CustodyChain = ({ entries }: CustodyChainProps) => {
  const hasInvalidEntry = entries.some((e) => !e.hashValid);

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg">
            <Link className="w-5 h-5 text-primary" />
            Chain of Custody
          </div>
          {hasInvalidEntry && (
            <Badge variant="destructive" className="text-xs">
              CHAIN TAMPERED
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-6">
            {entries.map((entry, index) => (
              <div key={entry.id} className="relative flex gap-4">
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
                <div className="flex-1 pb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge
                        variant="secondary"
                        className="mb-2 font-mono text-xs"
                      >
                        {entry.action}
                      </Badge>
                      <p className="text-sm text-foreground">{entry.details}</p>
                    </div>
                    {!entry.hashValid && (
                      <Badge variant="destructive" className="text-xs">
                        INVALID HASH
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span className="font-mono">{entry.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{entry.user}</span>
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
