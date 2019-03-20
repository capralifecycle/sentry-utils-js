export function getCurrentRelease(appName: string, appVersion: string): string {
  return `${appName}@${appVersion}`;
}
