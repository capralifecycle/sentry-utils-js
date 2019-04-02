export interface IRequiredConfiguration {
  appName: string;
  appVersion: string;
  buildTimestamp?: string;
  isProd?: boolean;
  sentryDsn: string;
}
