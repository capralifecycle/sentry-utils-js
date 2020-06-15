import * as Sentry from '@sentry/browser';
import { IRequiredConfiguration } from '../types';
import { getCurrentEnvironment } from './env-service';
import makeThrottleByMeanLifetime from './throttle-service';

export function getDefaultConfiguration({
  release,
  isProd = false,
}: Pick<IRequiredConfiguration, 'release' | 'isProd'>): Sentry.BrowserOptions {
  const throttle = makeThrottleByMeanLifetime(60 * 1000, 4);

  return {
    beforeSend: (event) => (throttle() ? event : null),
    environment: getCurrentEnvironment(isProd),
    release,
  };
}
