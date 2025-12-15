import { useState } from "react";
import { Header } from "@/components/lume/Header";
import { Sidebar, TabId } from "@/components/lume/Sidebar";
import { Dashboard } from "@/components/lume/Dashboard";
import { ProfilesTab } from "@/components/lume/tabs/ProfilesTab";
import { HistoryTab } from "@/components/lume/tabs/HistoryTab";
import { BookmarksTab } from "@/components/lume/tabs/BookmarksTab";
import { DownloadsTab } from "@/components/lume/tabs/DownloadsTab";
import { CookiesTab } from "@/components/lume/tabs/CookiesTab";
import { PasswordsTab } from "@/components/lume/tabs/PasswordsTab";
import { AutofillTab } from "@/components/lume/tabs/AutofillTab";
import { ExtensionsTab } from "@/components/lume/tabs/ExtensionsTab";
import { FileBrowserTab } from "@/components/lume/tabs/FileBrowserTab";
import { CustodyChain } from "@/components/lume/CustodyChain";
import { useAnalysisData } from "@/hooks/useAnalysisData";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const {
    caseInfo,
    verification,
    custodyReport,
    profiles,
    history,
    downloads,
    cookies,
    passwords,
    autofill,
    extensions,
    bookmarks,
    fileTree,
    loading,
    error,
    refetch,
  } = useAnalysisData();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading analysis data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive font-medium">{error}</p>
          <p className="text-muted-foreground mt-2">
            Make sure the analyzed data is present in /public/analyzed
          </p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            caseInfo={caseInfo}
            verification={verification}
            profiles={profiles}
            history={history}
            downloads={downloads}
            cookies={cookies}
            passwords={passwords}
            onRefresh={refetch}
          />
        );
      case "profiles":
        return <ProfilesTab profiles={profiles} />;
      case "history":
        return <HistoryTab history={history} profiles={profiles} />;
      case "bookmarks":
        return <BookmarksTab bookmarks={bookmarks} profiles={profiles} />;
      case "downloads":
        return <DownloadsTab downloads={downloads} profiles={profiles} />;
      case "cookies":
        return <CookiesTab cookies={cookies} profiles={profiles} />;
      case "passwords":
        return <PasswordsTab passwords={passwords} profiles={profiles} />;
      case "autofill":
        return <AutofillTab autofill={autofill} profiles={profiles} />;
      case "extensions":
        return <ExtensionsTab extensions={extensions} />;
      case "files":
        return <FileBrowserTab fileTree={fileTree} />;
      case "custody":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Chain of Custody</h2>
              <p className="text-muted-foreground mt-1">
                Complete audit trail of evidence access and modifications
              </p>
            </div>
            <CustodyChain report={custodyReport} />
          </div>
        );
      default:
        return (
          <Dashboard
            caseInfo={caseInfo}
            verification={verification}
            profiles={profiles}
            history={history}
            downloads={downloads}
            cookies={cookies}
            passwords={passwords}
            onRefresh={refetch}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
      </div>
    </div>
  );
};

export default Index;
