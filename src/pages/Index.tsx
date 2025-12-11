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
import {
  mockProfiles,
  mockHistory,
  mockBookmarks,
  mockDownloads,
  mockCookies,
  mockPasswords,
  mockAutofill,
  mockExtensions,
  mockFileTree,
  mockCustodyChain,
} from "@/lib/mockData";

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "profiles":
        return <ProfilesTab profiles={mockProfiles} />;
      case "history":
        return <HistoryTab history={mockHistory} />;
      case "bookmarks":
        return <BookmarksTab bookmarks={mockBookmarks} />;
      case "downloads":
        return <DownloadsTab downloads={mockDownloads} />;
      case "cookies":
        return <CookiesTab cookies={mockCookies} />;
      case "passwords":
        return <PasswordsTab passwords={mockPasswords} />;
      case "autofill":
        return <AutofillTab autofill={mockAutofill} />;
      case "extensions":
        return <ExtensionsTab extensions={mockExtensions} />;
      case "files":
        return <FileBrowserTab fileTree={mockFileTree} />;
      case "custody":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Chain of Custody</h2>
              <p className="text-muted-foreground mt-1">
                Complete audit trail of evidence access and modifications
              </p>
            </div>
            <CustodyChain entries={mockCustodyChain} />
          </div>
        );
      default:
        return <Dashboard />;
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
