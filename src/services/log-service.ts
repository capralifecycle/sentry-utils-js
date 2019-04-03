/* tslint:disable no-console */

import * as Sentry from '@sentry/browser';
import { Severity } from '@sentry/types';
import { getCurrentEnvironment } from './env-service';

export function captureDebug(
  message: string,
  isSentryEnabled: boolean = false
): void {
  if (!isSentryEnabled) {
    console.log(`DEBUG: ${message}`);
  }
}

export function captureError(
  message: string,
  isSentryEnabled: boolean = false
): void {
  if (isSentryEnabled) {
    Sentry.captureMessage(message, Severity.Error);
  } else {
    console.log(`ERROR: ${message}`);
  }
}

export function captureInfo(
  message: string,
  isSentryEnabled: boolean = false
): void {
  if (isSentryEnabled) {
    Sentry.captureMessage(message, Severity.Info);
  } else {
    console.log(`INFO: ${message}`);
  }
}

export function captureWarn(
  message: string,
  isSentryEnabled: boolean = false
): void {
  if (isSentryEnabled) {
    Sentry.captureMessage(message, Severity.Warning);
  } else {
    console.log(`WARN: ${message}`);
  }
}

export function captureException(
  err: any,
  errInfo: any = {},
  isSentryEnabled: boolean = false
): void {
  if (isSentryEnabled) {
    Sentry.withScope(scope => {
      Object.entries(errInfo).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });

      Sentry.captureException(err);
    });
  } else {
    console.log(`EXCEPTION: ${err}`);
  }
}

export function captureFeedback(
  message: string,
  messageInfo: { [key: string]: string } = {},
  isSentryEnabled: boolean = false
): void {
  captureDebug(`Current env: ${getCurrentEnvironment(false)}`);
  if (isSentryEnabled) {
    Sentry.withScope(scope => {
      Object.entries(messageInfo).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });

      scope.setTag('feedback', 'true');
      Sentry.captureMessage(message);
    });
  } else {
    console.log(`FEEDBACK: ${message}`);
  }
}
