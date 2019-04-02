import * as Sentry from '@sentry/browser';
import { Severity } from '@sentry/types';

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
  e: any,
  isSentryEnabled: boolean = false
): void {
  if (isSentryEnabled) {
    Sentry.captureException(e);
  } else {
    console.log(`EXCEPTION: ${e}`);
  }
}

export function captureFeedback(
  message: string,
  messageInfo: { [key: string]: string } = {},
  isSentryEnabled: boolean = false
): void {
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
