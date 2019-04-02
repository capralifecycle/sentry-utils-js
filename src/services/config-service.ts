import { IRequiredConfiguration } from '../types/configuration';
import { getCurrentRelease } from '../utils/release-util';
import { getCurrentEnvironment } from './env-service';
import makeThrottleByMeanLifetime from './throttle-service';

export function getDefaultConfiguration({
  appName = 'unknown app',
  appVersion = 'unknown version',
  isProd = false
}: Pick<IRequiredConfiguration, 'appName' | 'appVersion' | 'isProd'>) {
  const throttle = makeThrottleByMeanLifetime(60 * 1000, 4);

  return {
    beforeSend: event => (throttle() ? event : null),
    environment: getCurrentEnvironment(isProd),
    release: getCurrentRelease(appName, appVersion)
  };
}
