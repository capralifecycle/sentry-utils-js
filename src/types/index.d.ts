declare module 'jest-each';

interface IDefaultSentryConfiguration {
  environment: string;
  release: string;
  dsn: string;
  beforeSend: (e: any) => any | null;
}

declare const APP_NAME: string;
declare const APP_VERSION: string;
declare const SENTRY_DSN: string;
