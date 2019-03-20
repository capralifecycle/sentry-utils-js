declare module 'jest-each';

interface IDefaultSentryConfiguration {
  environment: string;
  release: string;
  dsn: string;
  beforeSend: (e: any) => any | null;
}

interface IRequiredConfiguration {
  appName: string;
  appVersion: string;
  prodOrigin?: string;
  sentryDsn: string;
}
