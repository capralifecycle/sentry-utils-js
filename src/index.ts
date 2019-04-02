import * as Sentry from '@sentry/browser';

import { getDefaultConfiguration } from './services/config-service';
import {
  captureDebug,
  captureError,
  captureException,
  captureFeedback,
  captureInfo,
  captureWarn
} from './services/log-service';
import { IRequiredConfiguration } from './types/configuration';

const BUILD_TIME_TAG = 'buildTime';

let isSentryEnabled = false;

export function initSentry({
  appName,
  appVersion,
  buildTimestamp,
  isProd = false,
  sentryDsn
}: IRequiredConfiguration) {
  Sentry.init({
    ...getDefaultConfiguration({
      appName,
      appVersion,
      isProd
    }),
    dsn: sentryDsn
  });

  if (buildTimestamp) {
    Sentry.configureScope(scope => {
      scope.setTag(BUILD_TIME_TAG, buildTimestamp);
    });
  }

  isSentryEnabled = true;
}

export const logService = {
  debug: (message: string): void => captureDebug(message, isSentryEnabled),
  error: (message: string): void => captureError(message, isSentryEnabled),
  exception: (err: any, errInfo?: any): void =>
    captureException(err, errInfo, isSentryEnabled),
  feedback: (message: string, messageInfo?: { [key: string]: string }): void =>
    captureFeedback(message, messageInfo, isSentryEnabled),
  info: (message: string): void => captureInfo(message, isSentryEnabled),
  warn: (message: string): void => captureWarn(message, isSentryEnabled)
};
