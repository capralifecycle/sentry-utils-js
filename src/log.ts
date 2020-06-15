import * as Sentry from '@sentry/browser';
import { Severity } from '@sentry/types';

export interface IExtraInfo {
  [key: string]: string;
}

function logToConsole(
  severity: Severity,
  message: string,
  extraInfo: IExtraInfo
): void {
  console.log(
    `${severity.toUpperCase()}: ${message} - ${JSON.stringify(extraInfo)}`
  );
}

function logToSentry(
  severity: Severity,
  message: string,
  extraInfo: IExtraInfo = {}
): void {
  Sentry.withScope((scope) => {
    scope.setExtras(extraInfo);
    Sentry.captureMessage(message, severity);
  });
}

export function captureDebug(
  message: string,
  extraInfo: IExtraInfo,
  isSentryEnabled = false
): void {
  if (!isSentryEnabled) {
    logToConsole(Severity.Debug, message, extraInfo);
  }
}

export function captureError(
  message: string,
  extraInfo: IExtraInfo,
  isSentryEnabled = false
): void {
  isSentryEnabled
    ? logToSentry(Severity.Error, message, extraInfo)
    : logToConsole(Severity.Error, message, extraInfo);
}

export function captureInfo(
  message: string,
  extraInfo: IExtraInfo,
  isSentryEnabled = false
): void {
  isSentryEnabled
    ? logToSentry(Severity.Info, message, extraInfo)
    : logToConsole(Severity.Info, message, extraInfo);
}

export function captureWarn(
  message: string,
  extraInfo: IExtraInfo,
  isSentryEnabled = false
): void {
  isSentryEnabled
    ? logToSentry(Severity.Warning, message, extraInfo)
    : logToConsole(Severity.Warning, message, extraInfo);
}

export function captureException(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
  err: any,
  errInfo: IExtraInfo,
  isSentryEnabled = false
): void {
  if (isSentryEnabled) {
    Sentry.withScope((scope) => {
      scope.setExtras(errInfo);
      Sentry.captureException(err);
    });
  } else {
    logToConsole(Severity.fromString('exception'), err, errInfo);
  }
}

export function captureFeedback(
  message: string,
  extraInfo: IExtraInfo,
  isSentryEnabled = false
): void {
  const severity = Severity.fromString('feedback');

  isSentryEnabled
    ? logToSentry(severity, message, extraInfo)
    : logToConsole(severity, message, extraInfo);
}
