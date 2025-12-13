export interface ElectronAPI {
  analyzeBundle: (bundlePath: string, hashPath: string) => Promise<{ success: boolean; output: string }>;
  selectFile: (filters: { name: string; extensions: string[] }[], title: string) => Promise<string | null>;
  onAnalyzeProgress: (callback: (data: string) => void) => void;
  isElectron: boolean;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};
