// Mock data representing the LumeViewer analysis results

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

export const mockCaseInfo: CaseInfo = {
  caseName: "suicide",
  caseId: "S_07",
  investigator: "prixit singh",
  createdUtc: "2025-12-06 10:22:49 UTC",
  systemLocal: "2025-12-06 15:52:49 IST",
  totalFiles: 24,
};

export const mockVerification: VerificationResult = {
  allFilesVerified: true,
  bundleHashVerified: true,
  failedFileList: [],
  failedFiles: 0,
  totalFiles: 24,
  verificationTimestamp: "2025-12-11 10:54:03 UTC",
  verifiedFiles: 24,
};

export const mockCustodyChain: CustodyEntry[] = [
  {
    id: 1,
    action: "BUNDLE_CREATED",
    timestamp: "2025-12-06 10:22:49 UTC",
    user: "prixit singh",
    details: "Evidence bundle created and encrypted",
    hashValid: true,
  },
  {
    id: 2,
    action: "BUNDLE_ACCESSED",
    timestamp: "2025-12-11 10:54:03 UTC",
    user: "prixit singh",
    details: "Bundle decrypted for analysis - Hash chain broken",
    hashValid: false,
  },
  {
    id: 3,
    action: "VERIFICATION_COMPLETE",
    timestamp: "2025-12-11 10:54:03 UTC",
    user: "prixit singh",
    details: "All 24 files verified successfully",
    hashValid: true,
  },
];

export const mockProfiles: BrowserProfile[] = [
  {
    browser: "chrome",
    profileDir: "Default",
    displayName: "Your Chrome",
    email: "prixitgs2002@gmail.com",
  },
  {
    browser: "chrome",
    profileDir: "Profile 1",
    displayName: "Prixit",
    email: "prixit289@gmail.com",
  },
  {
    browser: "chrome",
    profileDir: "Profile 2",
    displayName: "nfsu.ac.in",
    email: "prixit.btmtcs2138@nfsu.ac.in",
  },
  {
    browser: "edge",
    profileDir: "Default",
    displayName: "Profile 1",
    email: "prixitgs2002@gmail.com",
  },
];

export const mockHistory: HistoryEntry[] = [
  {
    title: "Adding feature to Lume project - Claude",
    url: "https://claude.ai/chat/ae283368-5159-475f-99c1-48ad7d954bcb",
    lastVisitTime: "06 Dec 2025, 03:29 PM",
    visitCount: 1,
  },
  {
    title: "Material details",
    url: "https://classroom.google.com/u/0/c/Nzk4OTY2NDQyNTA0/m/ODIxMDk0MTAyNTMw/details",
    lastVisitTime: "06 Dec 2025, 03:29 PM",
    visitCount: 2,
  },
  {
    title: "Yeat - COMË N GO (Official Music Video) - YouTube",
    url: "https://www.youtube.com/watch?v=QqzXvvdk3bQ",
    lastVisitTime: "06 Dec 2025, 03:29 PM",
    visitCount: 11,
  },
  {
    title: "manning publication - Google Search",
    url: "https://www.google.com/search?client=firefox-b-d&q=manning+publication",
    lastVisitTime: "05 Dec 2025, 12:16 PM",
    visitCount: 1,
  },
  {
    title: "Build a Large Language Model (From Scratch) MEAP V08",
    url: "file:///C:/Users/prixi/Downloads/Build%20a%20Large%20Language%20Model.pdf",
    lastVisitTime: "05 Dec 2025, 12:15 PM",
    visitCount: 1,
  },
];

export const mockDownloads: DownloadEntry[] = [
  {
    targetPath: "C:\\Users\\prixi\\Downloads\\ubuntu1804.json",
    url: "https://drive.usercontent.google.com/download?id=1HnXUouLABhIdwrM_JT4wg0-svnGmmBzY",
    startTime: "2025-12-05T06:02:55.228492Z",
    receivedBytes: 38982364,
    totalBytes: 38982364,
    state: 1,
  },
  {
    targetPath: "C:\\Users\\prixi\\Downloads\\251125.zip",
    url: "https://drive.usercontent.google.com/download?id=1rf1g70IPae72sBqcFUz0IP8HP3mBOug1",
    startTime: "2025-12-05T06:00:06.870343Z",
    receivedBytes: 835379286,
    totalBytes: 835379286,
    state: 1,
  },
  {
    targetPath: "C:\\Users\\prixi\\Downloads\\ChatGPT Image Dec 3, 2025.png",
    url: "blob:https://chatgpt.com/cbe1aa86-5d68-47d0-92fc-ac763b61620f",
    startTime: "2025-12-03T13:20:34.515738Z",
    receivedBytes: 1032212,
    totalBytes: 1032212,
    state: 1,
  },
  {
    targetPath: "C:\\Users\\prixi\\Downloads\\Hyper-Setup-3.4.1.exe",
    url: "https://release-assets.githubusercontent.com/github-production-release-asset/62367558/...",
    startTime: "2025-11-27T16:18:49Z",
    receivedBytes: 98234567,
    totalBytes: 98234567,
    state: 1,
  },
];

export const mockPasswords: PasswordEntry[] = [
  {
    url: "https://play.picoctf.org/login",
    username: "prixit",
    password: "prixtrax235",
  },
  {
    url: "android://swiggy.android/",
    username: "8369341743",
    password: "Aayushi@23",
  },
  {
    url: "https://blynk.cloud/dashboard/login",
    username: "prixitgs2002@gmail.com",
    password: "Prixtrax#235",
  },
  {
    url: "https://accounts.firefox.com",
    username: "prixitgs2002@gmail.com",
    password: "Z=*z$Pc6*uxi2kC",
  },
];

export const mockCookies: CookieEntry[] = [
  {
    host: ".app.leonardo.ai",
    name: "__stripe_mid",
    value: "112ac309-a513-4c83-ab3d-f1d545017949142084",
    path: "/",
    expiryDate: "2026-12-03 18:38:45 IST",
    creationDate: "2025-12-03 18:34:39 IST",
    lastAccessDate: "2025-12-03 18:39:46 IST",
    isSecure: true,
    isHttpOnly: false,
  },
  {
    host: ".askubuntu.com",
    name: "OptanonConsent",
    value: "isGpcEnabled=0&datestamp=Sun+Nov+30+2025...",
    path: "/",
    expiryDate: "2026-11-30 00:01:09 IST",
    creationDate: "2025-11-30 00:01:09 IST",
    lastAccessDate: "2025-11-30 00:01:09 IST",
    isSecure: false,
    isHttpOnly: false,
  },
  {
    host: "accounts.google.com",
    name: "OTZ",
    value: "8346873_34_34__34_",
    path: "/",
    expiryDate: "2025-12-14 16:02:41",
    creationDate: "2025-11-14 16:02:41",
    lastAccessDate: "2025-12-05 12:41:43",
    isSecure: true,
    isHttpOnly: false,
  },
];

export const mockAutofill: AutofillEntry[] = [
  {
    name: "email",
    value: "prixitgs2002@gmail.com",
    usedAt: "2025-09-10 18:40:55",
  },
  {
    name: "candidateEmail",
    value: "prixitgs2002@gmail.com",
    usedAt: "2025-09-10 18:40:55",
  },
  {
    name: "email",
    value: "new@gmail.com",
    usedAt: "2024-11-30 17:10:14",
  },
  {
    name: "source_id",
    value: "tt0338013",
    usedAt: "2024-11-15 22:19:56",
  },
  {
    name: "searchbar-history",
    value: "youtube",
    usedAt: "2025-11-14 16:02:33",
  },
];

export const mockExtensions: { browser: string; profile: string; extensions: ExtensionEntry[] }[] = [
  {
    browser: "Chrome",
    profile: "Default",
    extensions: [
      { name: "uBlock Origin Lite" },
      { name: "uBlock" },
      { name: "Slinky Elegant" },
    ],
  },
  {
    browser: "Edge",
    profile: "Default",
    extensions: [
      { name: "Youtube Playback Speed Control" },
      { name: "uBlock Origin" },
      { name: "daily.dev | The homepage developers deserve" },
    ],
  },
];

export const mockBookmarks: BookmarkEntry[] = [
  {
    name: "Bookmarks bar",
    type: "folder",
    dateAdded: "2025-11-29T08:50:20Z",
    children: [
      {
        name: "Gmail",
        url: "https://accounts.google.com/b/0/AddMailService",
        type: "url",
        dateAdded: "2021-11-01T11:04:25Z",
      },
      {
        name: "YouTube",
        url: "https://youtube.com/",
        type: "url",
        dateAdded: "2021-11-01T11:04:25Z",
      },
      {
        name: "About Us",
        url: "https://www.mozilla.org/about/",
        type: "url",
        dateAdded: "2025-11-04T18:45:34Z",
      },
      {
        name: "Get Involved",
        url: "https://www.mozilla.org/contribute/",
        type: "url",
        dateAdded: "2025-11-04T18:45:34Z",
      },
    ],
  },
];

export const mockFileTree = {
  name: "analyzed_20251211_162403",
  type: "folder" as const,
  children: [
    { name: "MANIFEST.json", type: "file" as const, size: 5518 },
    { name: "VERIFICATION_REPORT.json", type: "file" as const, size: 211 },
    {
      name: "results",
      type: "folder" as const,
      children: [
        {
          name: "chromium",
          type: "folder" as const,
          children: [
            { name: "chromium_autofill.json", type: "file" as const, size: 263690 },
            { name: "chromium_bookmarks.json", type: "file" as const, size: 7614 },
            { name: "chromium_download_history.json", type: "file" as const, size: 8172 },
            { name: "chromium_extensions.json", type: "file" as const, size: 438 },
            { name: "chromium_history.json", type: "file" as const, size: 1416649 },
            { name: "chromium_profiles.json", type: "file" as const, size: 547 },
            {
              name: "chrome",
              type: "folder" as const,
              children: [
                {
                  name: "Default",
                  type: "folder" as const,
                  children: [
                    { name: "cookies.json", type: "file" as const, size: 428518 },
                    { name: "passwords.json", type: "file" as const, size: 10816 },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "firefox",
          type: "folder" as const,
          children: [
            { name: "firefox_autofill.json", type: "file" as const, size: 30037 },
            { name: "firefox_bookmarks.json", type: "file" as const, size: 8817 },
            { name: "firefox_cookies.json", type: "file" as const, size: 809763 },
            { name: "firefox_downloads.json", type: "file" as const, size: 9763 },
            { name: "firefox_extensions.json", type: "file" as const, size: 14096 },
            { name: "firefox_history.json", type: "file" as const, size: 431010 },
            { name: "firefox_passwords.json", type: "file" as const, size: 558 },
          ],
        },
      ],
    },
  ],
};
