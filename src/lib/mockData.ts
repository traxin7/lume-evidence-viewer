// Type definitions for LumeViewer analysis data

export interface CaseInfo {
  caseName: string;
  caseId: string;
  investigator: string;
  createdUtc: string;
  systemLocal: string;
  totalFiles: number;
}

export interface VerificationResult {
  allFilesVerified: boolean;
  bundleHashVerified: boolean;
  failedFileList: string[];
  failedFiles: number;
  totalFiles: number;
  verificationTimestamp: string;
  verifiedFiles: number;
}

export interface CustodyEntry {
  id: number;
  action: string;
  timestamp: string;
  user: string;
  details: string;
  hashValid: boolean;
}

export interface BrowserProfile {
  browser: string;
  profileDir: string;
  displayName: string;
  email: string;
}

export interface HistoryEntry {
  title: string;
  url: string;
  lastVisitTime: string;
  visitCount: number;
}

export interface BookmarkEntry {
  name: string;
  url?: string;
  type: string;
  dateAdded: string;
  children?: BookmarkEntry[];
}

export interface DownloadEntry {
  targetPath: string;
  url: string;
  startTime: string;
  receivedBytes: number;
  totalBytes: number;
  state: number;
}

export interface CookieEntry {
  host: string;
  name: string;
  value: string;
  path: string;
  expiryDate: string;
  creationDate: string;
  lastAccessDate: string;
  isSecure: boolean;
  isHttpOnly: boolean;
}

export interface PasswordEntry {
  url: string;
  username: string;
  password: string;
}

export interface AutofillEntry {
  name: string;
  value: string;
  usedAt: string;
}

export interface ExtensionEntry {
  name: string;
}
