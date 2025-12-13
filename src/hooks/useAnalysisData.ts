import { useState, useEffect } from "react";
import { loadAllData } from "@/lib/dataLoader";
import {
  CaseInfo,
  VerificationResult,
  CustodyEntry,
  BrowserProfile,
  HistoryEntry,
  BookmarkEntry,
  DownloadEntry,
  CookieEntry,
  PasswordEntry,
  AutofillEntry,
  ExtensionEntry,
} from "@/lib/mockData";

interface AnalysisData {
  caseInfo: CaseInfo | null;
  verification: VerificationResult | null;
  custodyChain: CustodyEntry[];
  profiles: BrowserProfile[];
  history: HistoryEntry[];
  downloads: DownloadEntry[];
  cookies: CookieEntry[];
  passwords: PasswordEntry[];
  autofill: AutofillEntry[];
  extensions: { browser: string; profile: string; extensions: ExtensionEntry[] }[];
  bookmarks: BookmarkEntry[];
  fileTree: any;
}

interface UseAnalysisDataResult extends AnalysisData {
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAnalysisData(): UseAnalysisDataResult {
  const [data, setData] = useState<AnalysisData>({
    caseInfo: null,
    verification: null,
    custodyChain: [],
    profiles: [],
    history: [],
    downloads: [],
    cookies: [],
    passwords: [],
    autofill: [],
    extensions: [],
    bookmarks: [],
    fileTree: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchData() {
    try {
      setLoading(true);
      const result = await loadAllData();
      setData(result);
      setError(null);
    } catch (err) {
      console.error("Failed to load analysis data:", err);
      setError("Failed to load analysis data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return {
    ...data,
    loading,
    error,
    refetch: fetchData,
  };
}
