import { getCurrentEnvironment } from './services/env-service';
import makeThrottleByMeanLifetime from './services/throttle-service';
import { getCurrentRelease } from './utils/release-util';

export function getDefaultConfiguration({
  appName,
  appVersion,
  prodOrigin,
  sentryDsn
}: IRequiredConfiguration): IDefaultSentryConfiguration {
  const throttle = makeThrottleByMeanLifetime(60 * 1000, 4);

  return {
    beforeSend: event => (throttle() ? event : null),
    dsn: sentryDsn,
    environment: getCurrentEnvironment(prodOrigin),
    release: getCurrentRelease(appName, appVersion)
  };
}

export function getBuildTime(): string | null {
  return null;
}

export function isSentryEnabled(sentryDsn?: string): boolean {
  return typeof sentryDsn === 'string' && sentryDsn.length > 0;
}
