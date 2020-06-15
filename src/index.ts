import * as Sentry from '@sentry/browser';
import {
  captureDebug,
  captureError,
  captureException,
  captureFeedback,
  captureInfo,
  captureWarn,
  IExtraInfo,
} from './services/log-service';
import makeThrottleByMeanLifetime from './throttle';

interface InitSentry {
  release: string;
  buildTimestamp?: string;
  environment?: string;
  sentryDsn: string;
}

const BUILD_TIME_TAG = 'buildTime';

let isSentryEnabled = false;

export function initSentry({
  release,
  buildTimestamp,
  environment,
  sentryDsn,
}: InitSentry): void {
  const throttle = makeThrottleByMeanLifetime(60 * 1000, 4);

  const config: Sentry.BrowserOptions = {
    beforeSend: (event) => (throttle() ? event : null),
    environment,
    release,
    dsn: sentryDsn,
  };

  Sentry.init(config);

  if (buildTimestamp) {
    Sentry.configureScope((scope) => {
      scope.setTag(BUILD_TIME_TAG, buildTimestamp);
    });
  }

  isSentryEnabled = true;
}

export const logService = {
  debug: (message: string, extraInfo: IExtraInfo = {}): void =>
    captureDebug(message, extraInfo, isSentryEnabled),

  error: (message: string, extraInfo: IExtraInfo = {}): void =>
    captureError(message, extraInfo, isSentryEnabled),

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
  exception: (err: any, extraInfo: IExtraInfo = {}): void =>
    captureException(err, extraInfo, isSentryEnabled),

  feedback: (message: string, extraInfo: IExtraInfo = {}): void =>
    captureFeedback(message, extraInfo, isSentryEnabled),

  info: (message: string, extraInfo: IExtraInfo = {}): void =>
    captureInfo(message, extraInfo, isSentryEnabled),

  warn: (message: string, extraInfo: IExtraInfo = {}): void =>
    captureWarn(message, extraInfo, isSentryEnabled),
};
