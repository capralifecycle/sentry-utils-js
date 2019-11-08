import { IRequiredConfiguration } from '../types/configuration';
import { getCurrentEnvironment } from './env-service';
import makeThrottleByMeanLifetime from './throttle-service';

export function getDefaultConfiguration({
  release,
  isProd = false
}: Pick<IRequiredConfiguration, 'release' | 'isProd'>) {
  const throttle = makeThrottleByMeanLifetime(60 * 1000, 4);

  return {
    beforeSend: event => (throttle() ? event : null),
    environment: getCurrentEnvironment(isProd),
    release
  };
}
