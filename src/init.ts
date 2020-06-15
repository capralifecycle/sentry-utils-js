import * as Sentry from '@sentry/browser';
import {
  captureDebug,
  captureError,
  captureException,
  captureFeedback,
  captureInfo,
  captureWarn,
  IExtraInfo,
} from './log';
import makeThrottleByMeanLifetime from './throttle';

interface InitSentry {
  options: Sentry.BrowserOptions;
  buildTime?: string;
}

const BUILD_TIME_TAG = 'buildTime';

let isSentryEnabled = false;

export function initSentry({ options, buildTime }: InitSentry): void {
  const isThrottled = makeThrottleByMeanLifetime(60 * 1000, 4);

  const config: Sentry.BrowserOptions = {
    ...options,
    beforeSend: (event, hint) => {
      if (isThrottled()) {
        return null;
      }

      if (options.beforeSend) {
        return options.beforeSend(event, hint);
      }

      return event;
    },
  };

  Sentry.init(config);

  if (buildTime) {
    Sentry.configureScope((scope) => {
      scope.setTag(BUILD_TIME_TAG, buildTime);
    });
  }

  isSentryEnabled = true;
}

export function debug(message: string, extraInfo: IExtraInfo = {}): void {
  captureDebug(message, extraInfo, isSentryEnabled);
}

export function error(message: string, extraInfo: IExtraInfo = {}): void {
  captureError(message, extraInfo, isSentryEnabled);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
export function exception(err: any, extraInfo: IExtraInfo = {}): void {
  captureException(err, extraInfo, isSentryEnabled);
}

export function feedback(message: string, extraInfo: IExtraInfo = {}): void {
  captureFeedback(message, extraInfo, isSentryEnabled);
}

export function info(message: string, extraInfo: IExtraInfo = {}): void {
  captureInfo(message, extraInfo, isSentryEnabled);
}

export function warn(message: string, extraInfo: IExtraInfo = {}): void {
  captureWarn(message, extraInfo, isSentryEnabled);
}
