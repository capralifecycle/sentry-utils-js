export interface IRequiredConfiguration {
  release: string;
  buildTimestamp?: string;
  isProd?: boolean;
  sentryDsn: string;
}
