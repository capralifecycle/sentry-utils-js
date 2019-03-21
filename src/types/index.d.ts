declare module 'jest-each';

export interface IDefaultSentryConfiguration {
  environment: string;
  release: string;
  dsn: string;
  beforeSend: (e: any) => any | null;
}

export interface IRequiredConfiguration {
  appName: string;
  appVersion: string;
  prodOrigin?: string;
  sentryDsn: string;
}
