// Data loader for fetching real analysis data from /public/analyzed

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
} from "./mockData";

const BASE_PATH = "/analyzed";

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${BASE_PATH}${path}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch ${path}:`, error);
    return null;
  }
}

// Load MANIFEST.json for case info
export async function loadCaseInfo(): Promise<CaseInfo | null> {
  const manifest = await fetchJson<{
    case_name: string;
    case_id: string;
    investigator: string;
    created_utc: string;
    system_local: string;
    files: Array<{ path: string; sha256: string; size: number; mtime: string }>;
  }>("/MANIFEST.json");

  if (!manifest) return null;

  return {
    caseName: manifest.case_name,
    caseId: manifest.case_id,
    investigator: manifest.investigator,
    createdUtc: manifest.created_utc,
    systemLocal: manifest.system_local,
    totalFiles: manifest.files?.length || 0,
  };
}

// Load VERIFICATION_REPORT.json
export async function loadVerification(): Promise<VerificationResult | null> {
  const report = await fetchJson<{
    all_files_verified: boolean;
    bundle_hash_verified: boolean;
    failed_file_list: string[];
    failed_files: number;
    total_files: number;
    verification_timestamp: string;
    verified_files: number;
  }>("/VERIFICATION_REPORT.json");

  if (!report) return null;

  return {
    allFilesVerified: report.all_files_verified,
    bundleHashVerified: report.bundle_hash_verified,
    failedFileList: report.failed_file_list || [],
    failedFiles: report.failed_files,
    totalFiles: report.total_files,
    verificationTimestamp: report.verification_timestamp,
    verifiedFiles: report.verified_files,
  };
}

// Load custody chain - since MANIFEST.json doesn't have custody_chain, we generate from verification
export async function loadCustodyChain(): Promise<CustodyEntry[]> {
  const [manifest, verification] = await Promise.all([
    fetchJson<{
      case_name: string;
      investigator: string;
      created_utc: string;
    }>("/MANIFEST.json"),
    fetchJson<{
      verification_timestamp: string;
      all_files_verified: boolean;
      verified_files: number;
    }>("/VERIFICATION_REPORT.json"),
  ]);

  const entries: CustodyEntry[] = [];

  if (manifest) {
    entries.push({
      id: 1,
      action: "BUNDLE_CREATED",
      timestamp: manifest.created_utc,
      user: manifest.investigator,
      details: "Evidence bundle created and encrypted",
      hashValid: true,
    });
  }

  if (verification) {
    entries.push({
      id: 2,
      action: "VERIFICATION_COMPLETE",
      timestamp: verification.verification_timestamp,
      user: manifest?.investigator || "System",
      details: verification.all_files_verified
        ? `All ${verification.verified_files} files verified successfully`
        : "Verification completed with errors",
      hashValid: verification.all_files_verified,
    });
  }

  return entries;
}

function getActionDetails(action: string, hashValid: boolean): string {
  switch (action) {
    case "BUNDLE_CREATED":
      return "Evidence bundle created and encrypted";
    case "BUNDLE_ACCESSED":
      return hashValid ? "Bundle accessed and verified" : "Bundle decrypted for analysis - Hash chain broken";
    case "VERIFICATION_COMPLETE":
      return hashValid ? "All files verified successfully" : "Verification completed with errors";
    default:
      return action;
  }
}

// Load browser profiles from chromium_profiles.json and firefox data
export async function loadProfiles(): Promise<BrowserProfile[]> {
  const [chromiumProfiles, firefoxAutofill] = await Promise.all([
    fetchJson<Array<{
      browser: string;
      profile_dir: string;
      display_name: string;
      email: string;
    }>>("/results/chromium/chromium_profiles.json"),
    // Use firefox_autofill to detect Firefox profiles since it has profile names
    fetchJson<Record<string, any>>("/results/firefox/firefox_autofill.json"),
  ]);

  const profiles: BrowserProfile[] = [];

  // Add chromium profiles
  if (chromiumProfiles) {
    for (const p of chromiumProfiles) {
      profiles.push({
        browser: p.browser,
        profileDir: p.profile_dir,
        displayName: p.display_name,
        email: p.email,
      });
    }
  }

  // Add Firefox profiles based on keys in firefox data files
  if (firefoxAutofill) {
    for (const profileName of Object.keys(firefoxAutofill)) {
      profiles.push({
        browser: "Firefox",
        profileDir: profileName,
        displayName: profileName.split(".").pop() || profileName,
        email: "",
      });
    }
  }

  return profiles;
}

// Load history from chromium and firefox
export async function loadHistory(): Promise<HistoryEntry[]> {
  const [chromiumHistory, firefoxHistory] = await Promise.all([
    fetchJson<Record<string, Record<string, Array<{
      title: string;
      url: string;
      last_visit_time: string;
      visit_count: number;
    }>>>>("/results/chromium/chromium_history.json"),
    fetchJson<Record<string, Array<{
      title: string;
      url: string;
      visit_time: string;
      visit_count: number;
    }>>>("/results/firefox/firefox_history.json"),
  ]);

  const entries: HistoryEntry[] = [];

  // Process chromium history
  if (chromiumHistory) {
    for (const [browserName, browser] of Object.entries(chromiumHistory)) {
      for (const [profileName, profile] of Object.entries(browser)) {
        if (Array.isArray(profile)) {
          for (const entry of profile) {
            entries.push({
              title: entry.title,
              url: entry.url,
              lastVisitTime: entry.last_visit_time,
              visitCount: entry.visit_count,
              browser: browserName,
              profile: profileName,
            });
          }
        }
      }
    }
  }

  // Process firefox history
  if (firefoxHistory) {
    for (const [profileName, profile] of Object.entries(firefoxHistory)) {
      if (Array.isArray(profile)) {
        for (const entry of profile) {
          entries.push({
            title: entry.title,
            url: entry.url,
            lastVisitTime: entry.visit_time,
            visitCount: entry.visit_count,
            browser: "Firefox",
            profile: profileName,
          });
        }
      }
    }
  }

  return entries;
}

// Load downloads from chromium and firefox
export async function loadDownloads(): Promise<DownloadEntry[]> {
  const [chromiumDownloads, firefoxDownloads] = await Promise.all([
    fetchJson<Record<string, Record<string, Array<{
      target_path: string;
      url: string;
      start_time: string;
      received_bytes: number;
      total_bytes: number;
      state: number;
    }>>>>("/results/chromium/chromium_download_history.json"),
    fetchJson<Record<string, Array<{
      name: string;
      source: string;
      target: string;
      state: string;
      start_time: string;
    }>>>("/results/firefox/firefox_downloads.json"),
  ]);

  const entries: DownloadEntry[] = [];

  // Process chromium downloads
  if (chromiumDownloads) {
    for (const [browserName, browser] of Object.entries(chromiumDownloads)) {
      for (const [profileName, profile] of Object.entries(browser)) {
        if (Array.isArray(profile)) {
          for (const entry of profile) {
            entries.push({
              targetPath: entry.target_path,
              url: entry.url,
              startTime: entry.start_time,
              receivedBytes: entry.received_bytes,
              totalBytes: entry.total_bytes,
              state: entry.state,
              browser: browserName,
              profile: profileName,
            });
          }
        }
      }
    }
  }

  // Process firefox downloads
  if (firefoxDownloads) {
    for (const [profileName, profile] of Object.entries(firefoxDownloads)) {
      if (Array.isArray(profile)) {
        for (const entry of profile) {
          entries.push({
            targetPath: entry.target || entry.name,
            url: entry.source,
            startTime: entry.start_time,
            receivedBytes: 0,
            totalBytes: 0,
            state: entry.state === "completed" ? 1 : 0,
            browser: "Firefox",
            profile: profileName,
          });
        }
      }
    }
  }

  return entries;
}

// Load cookies from all browser profiles
export async function loadCookies(): Promise<CookieEntry[]> {
  const entries: CookieEntry[] = [];

  // Define chromium cookie paths with browser/profile info
  const chromiumPathsInfo = [
    { path: "/results/chromium/chrome/Default/cookies.json", browser: "Chrome", profile: "Default" },
    { path: "/results/chromium/chrome/Profile 1/cookies.json", browser: "Chrome", profile: "Profile 1" },
    { path: "/results/chromium/chrome/Profile 2/cookies.json", browser: "Chrome", profile: "Profile 2" },
    { path: "/results/chromium/edge/Default/cookies.json", browser: "Edge", profile: "Default" },
  ];

  const firefoxCookies = await fetchJson<Record<string, Array<{
    host: string;
    name: string;
    value: string;
    path: string;
    expiry: string;
    creation_time: string;
    last_access: string;
    is_secure?: boolean;
  }>>>("/results/firefox/firefox_cookies.json");

  // Load chromium cookies
  for (const pathInfo of chromiumPathsInfo) {
    const data = await fetchJson<{
      cookies_by_host: Record<string, Array<{
        host: string;
        name: string;
        value: string;
        path: string;
        expiry_date: string;
        creation_date: string;
        last_access_date: string;
        is_secure: boolean;
        is_httponly: boolean;
      }>>;
    }>(pathInfo.path);

    if (data?.cookies_by_host) {
      for (const cookies of Object.values(data.cookies_by_host)) {
        for (const cookie of cookies) {
          entries.push({
            host: cookie.host,
            name: cookie.name,
            value: cookie.value,
            path: cookie.path,
            expiryDate: cookie.expiry_date,
            creationDate: cookie.creation_date,
            lastAccessDate: cookie.last_access_date,
            isSecure: cookie.is_secure,
            isHttpOnly: cookie.is_httponly,
            browser: pathInfo.browser,
            profile: pathInfo.profile,
          });
        }
      }
    }
  }

  // Load firefox cookies
  if (firefoxCookies) {
    for (const [profileName, profile] of Object.entries(firefoxCookies)) {
      if (Array.isArray(profile)) {
        for (const cookie of profile) {
          entries.push({
            host: cookie.host,
            name: cookie.name,
            value: cookie.value,
            path: cookie.path,
            expiryDate: cookie.expiry,
            creationDate: cookie.creation_time,
            lastAccessDate: cookie.last_access,
            isSecure: cookie.is_secure || false,
            isHttpOnly: false,
            browser: "Firefox",
            profile: profileName,
          });
        }
      }
    }
  }

  return entries;
}

// Load passwords from all browser profiles
export async function loadPasswords(): Promise<PasswordEntry[]> {
  const entries: PasswordEntry[] = [];

  // Define chromium password paths with browser/profile info
  const chromiumPathsInfo = [
    { path: "/results/chromium/chrome/Default/passwords.json", browser: "Chrome", profile: "Default" },
    { path: "/results/chromium/chrome/Profile 1/passwords.json", browser: "Chrome", profile: "Profile 1" },
    { path: "/results/chromium/chrome/Profile 2/passwords.json", browser: "Chrome", profile: "Profile 2" },
    { path: "/results/chromium/chrome/Profile 4/passwords.json", browser: "Chrome", profile: "Profile 4" },
    { path: "/results/chromium/chrome/Profile 5/passwords.json", browser: "Chrome", profile: "Profile 5" },
    { path: "/results/chromium/edge/Default/passwords.json", browser: "Edge", profile: "Default" },
  ];

  for (const pathInfo of chromiumPathsInfo) {
    const data = await fetchJson<Array<{
      url: string;
      username: string;
      password: string;
    }>>(pathInfo.path);

    if (data && Array.isArray(data)) {
      for (const entry of data) {
        entries.push({
          url: entry.url,
          username: entry.username,
          password: entry.password,
          browser: pathInfo.browser,
          profile: pathInfo.profile,
        });
      }
    }
  }

  // Load firefox passwords
  const firefoxPasswords = await fetchJson<Record<string, Array<{
    url: string;
    user: string;
    password: string;
  }>>>("/results/firefox/firefox_passwords.json");

  if (firefoxPasswords) {
    for (const [profileName, profile] of Object.entries(firefoxPasswords)) {
      if (Array.isArray(profile)) {
        for (const entry of profile) {
          entries.push({
            url: entry.url,
            username: entry.user,
            password: entry.password,
            browser: "Firefox",
            profile: profileName,
          });
        }
      }
    }
  }

  return entries;
}

// Load autofill data
export async function loadAutofill(): Promise<AutofillEntry[]> {
  const [chromiumAutofill, firefoxAutofill] = await Promise.all([
    fetchJson<Record<string, Record<string, Array<{
      name: string;
      value: string;
      used_at: string;
    }>>>>("/results/chromium/chromium_autofill.json"),
    fetchJson<Record<string, { form_history: Array<{
      field_name: string;
      value: string;
      last_used: string;
    }> }>>("/results/firefox/firefox_autofill.json"),
  ]);

  const entries: AutofillEntry[] = [];

  // Process chromium autofill
  if (chromiumAutofill) {
    for (const [browserName, browser] of Object.entries(chromiumAutofill)) {
      for (const [profileName, profile] of Object.entries(browser)) {
        if (Array.isArray(profile)) {
          for (const entry of profile) {
            entries.push({
              name: entry.name,
              value: entry.value,
              usedAt: entry.used_at,
              browser: browserName,
              profile: profileName,
            });
          }
        }
      }
    }
  }

  // Process firefox autofill
  if (firefoxAutofill) {
    for (const [profileName, profile] of Object.entries(firefoxAutofill)) {
      if (profile?.form_history && Array.isArray(profile.form_history)) {
        for (const entry of profile.form_history) {
          entries.push({
            name: entry.field_name,
            value: entry.value,
            usedAt: entry.last_used,
            browser: "Firefox",
            profile: profileName,
          });
        }
      }
    }
  }

  return entries;
}

// Load extensions
export async function loadExtensions(): Promise<{ browser: string; profile: string; extensions: ExtensionEntry[] }[]> {
  const [chromiumExtensions, firefoxExtensions] = await Promise.all([
    fetchJson<Record<string, Record<string, Array<{ name: string }>>>>("/results/chromium/chromium_extensions.json"),
    fetchJson<Record<string, Array<{
      name: string;
      id: string;
      version: string;
    }>>>("/results/firefox/firefox_extensions.json"),
  ]);

  const results: { browser: string; profile: string; extensions: ExtensionEntry[] }[] = [];

  // Process chromium extensions
  if (chromiumExtensions) {
    for (const [browser, profiles] of Object.entries(chromiumExtensions)) {
      for (const [profile, exts] of Object.entries(profiles)) {
        if (Array.isArray(exts) && exts.length > 0) {
          results.push({
            browser,
            profile,
            extensions: exts.map((e) => ({ name: e.name })),
          });
        }
      }
    }
  }

  // Process firefox extensions
  if (firefoxExtensions) {
    for (const [profile, exts] of Object.entries(firefoxExtensions)) {
      if (Array.isArray(exts) && exts.length > 0) {
        results.push({
          browser: "Firefox",
          profile: profile.split(".")[1] || profile,
          extensions: exts.map((e) => ({ name: e.name })),
        });
      }
    }
  }

  return results;
}

// Load bookmarks
export async function loadBookmarks(): Promise<BookmarkEntry[]> {
  const [chromiumBookmarks, firefoxBookmarks] = await Promise.all([
    fetchJson<Record<string, Record<string, BookmarkEntry[]>>>("/results/chromium/chromium_bookmarks.json"),
    fetchJson<Record<string, Array<{
      title: string;
      url?: string;
      added: string;
      folder_id?: number;
    }>>>("/results/firefox/firefox_bookmarks.json"),
  ]);

  const entries: BookmarkEntry[] = [];

  // Process chromium bookmarks
  if (chromiumBookmarks) {
    for (const browser of Object.values(chromiumBookmarks)) {
      for (const profile of Object.values(browser)) {
        if (Array.isArray(profile)) {
          entries.push(...profile.map(convertBookmark));
        }
      }
    }
  }

  // Process firefox bookmarks into a folder structure
  if (firefoxBookmarks) {
    const firefoxFolder: BookmarkEntry = {
      name: "Firefox Bookmarks",
      type: "folder",
      dateAdded: new Date().toISOString(),
      children: [],
    };

    for (const [, bookmarks] of Object.entries(firefoxBookmarks)) {
      if (Array.isArray(bookmarks)) {
        for (const bm of bookmarks) {
          firefoxFolder.children!.push({
            name: bm.title,
            url: bm.url,
            type: bm.url ? "url" : "folder",
            dateAdded: bm.added,
          });
        }
      }
    }

    if (firefoxFolder.children!.length > 0) {
      entries.push(firefoxFolder);
    }
  }

  return entries;
}

function convertBookmark(bm: any): BookmarkEntry {
  return {
    name: bm.name,
    url: bm.url,
    type: bm.type,
    dateAdded: bm.date_added,
    children: bm.children ? bm.children.map(convertBookmark) : undefined,
  };
}

// Build file tree from actual structure
export async function loadFileTree() {
  // Since we can't dynamically list directories in browser, we'll build a static structure
  // based on the known file layout
  return {
    name: "analyzed",
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
                  {
                    name: "Profile 1",
                    type: "folder" as const,
                    children: [
                      { name: "cookies.json", type: "file" as const, size: 218411 },
                      { name: "passwords.json", type: "file" as const, size: 3539 },
                    ],
                  },
                  {
                    name: "Profile 2",
                    type: "folder" as const,
                    children: [
                      { name: "cookies.json", type: "file" as const, size: 294258 },
                      { name: "passwords.json", type: "file" as const, size: 1147 },
                    ],
                  },
                  {
                    name: "Profile 4",
                    type: "folder" as const,
                    children: [
                      { name: "passwords.json", type: "file" as const, size: 1157 },
                    ],
                  },
                  {
                    name: "Profile 5",
                    type: "folder" as const,
                    children: [
                      { name: "passwords.json", type: "file" as const, size: 3439 },
                    ],
                  },
                ],
              },
              {
                name: "edge",
                type: "folder" as const,
                children: [
                  {
                    name: "Default",
                    type: "folder" as const,
                    children: [
                      { name: "cookies.json", type: "file" as const, size: 217048 },
                      { name: "passwords.json", type: "file" as const, size: 11033 },
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
              { name: "firefox_mail.json", type: "file" as const, size: 208 },
              { name: "firefox_passwords.json", type: "file" as const, size: 558 },
            ],
          },
        ],
      },
    ],
  };
}

// Load all data at once
export async function loadAllData() {
  const [
    caseInfo,
    verification,
    custodyChain,
    profiles,
    history,
    downloads,
    cookies,
    passwords,
    autofill,
    extensions,
    bookmarks,
    fileTree,
  ] = await Promise.all([
    loadCaseInfo(),
    loadVerification(),
    loadCustodyChain(),
    loadProfiles(),
    loadHistory(),
    loadDownloads(),
    loadCookies(),
    loadPasswords(),
    loadAutofill(),
    loadExtensions(),
    loadBookmarks(),
    loadFileTree(),
  ]);

  return {
    caseInfo,
    verification,
    custodyChain,
    profiles,
    history,
    downloads,
    cookies,
    passwords,
    autofill,
    extensions,
    bookmarks,
    fileTree,
  };
}
