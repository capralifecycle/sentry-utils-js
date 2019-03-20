import { getCurrentEnvironment } from './services/env-service';
import makeThrottleByMeanLifetime from './services/throttle-service';
import { getCurrentRelease } from './utils/release-util';

export function getDefaultConfiguration(): IDefaultSentryConfiguration {
  const throttle = makeThrottleByMeanLifetime(60 * 1000, 4);

  return {
    beforeSend: event => (throttle() ? event : null),
    dsn: SENTRY_DSN,
    environment: getCurrentEnvironment(),
    release: getCurrentRelease()
  };
}

export function getBuildTime(): string | null {
  return null;
}

export function isSentryEnabled(): boolean {
  return SENTRY_DSN.length > 0;
}
