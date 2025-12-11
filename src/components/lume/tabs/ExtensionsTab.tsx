import { Puzzle, Chrome, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ExtensionData {
  browser: string;
  profile: string;
  extensions: { name: string }[];
}

interface ExtensionsTabProps {
  extensions: ExtensionData[];
}

export const ExtensionsTab = ({ extensions }: ExtensionsTabProps) => {
  const getBrowserIcon = (browser: string) => {
    switch (browser.toLowerCase()) {
      case "chrome":
        return <Chrome className="w-5 h-5 text-yellow-500" />;
      default:
        return <Globe className="w-5 h-5 text-blue-500" />;
    }
  };

  const totalExtensions = extensions.reduce((acc, e) => acc + e.extensions.length, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Puzzle className="w-6 h-6 text-primary" />
            Browser Extensions
          </h2>
          <p className="text-muted-foreground mt-1">
            {totalExtensions} extensions across {extensions.length} profiles
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {extensions.map((group, index) => (
          <Card key={index} className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getBrowserIcon(group.browser)}
                  <span className="text-foreground">{group.browser}</span>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {group.profile}
                  </Badge>
                </div>
                <Badge variant="secondary">
                  {group.extensions.length} extensions
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {group.extensions.map((ext, extIndex) => (
                  <Badge
                    key={extIndex}
                    variant="outline"
                    className="text-sm py-1.5 px-3"
                  >
                    <Puzzle className="w-3 h-3 mr-2 text-primary" />
                    {ext.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
