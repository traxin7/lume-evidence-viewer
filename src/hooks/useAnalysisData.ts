import { useState, useEffect, useRef } from "react";
import { loadAllData } from "@/lib/dataLoader";
import {
  CaseInfo,
  VerificationResult,
  CustodyReport,
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
  custodyReport: CustodyReport | null;
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
    custodyReport: null,
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
  const retryCount = useRef(0);
  const maxRetries = 3;

  async function fetchData(isRetry = false) {
    try {
      if (!isRetry) {
        setLoading(true);
      }
      const result = await loadAllData();
      setData(result);
      setError(null);
      
      // If critical data is missing and we haven't exceeded retries, try again after a delay
      const hasData = result.caseInfo || result.verification || result.custodyReport || 
                      result.profiles.length > 0 || result.history.length > 0;
      
      if (!hasData && retryCount.current < maxRetries) {
        retryCount.current++;
        setTimeout(() => fetchData(true), 500);
        return;
      }
      
      retryCount.current = 0;
    } catch (err) {
      console.error("Failed to load analysis data:", err);
      
      // Retry on error if we haven't exceeded retries
      if (retryCount.current < maxRetries) {
        retryCount.current++;
        setTimeout(() => fetchData(true), 500);
        return;
      }
      
      setError("Failed to load analysis data");
      retryCount.current = 0;
    } finally {
      if (!isRetry || retryCount.current >= maxRetries) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return {
    ...data,
    loading,
    error,
    refetch: () => {
      retryCount.current = 0;
      fetchData();
    },
  };
}
