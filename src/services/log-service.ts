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
  /* tslint:disable-next-line no-console */
  console.log(
    `${severity.toUpperCase()}: ${message} - ${JSON.stringify(extraInfo)}`
  );
}

function logToSentry(
  severity: Severity,
  message: string,
  extraInfo: IExtraInfo = {}
): void {
  Sentry.withScope(scope => {
    scope.setExtras(extraInfo);
    Sentry.captureMessage(message, severity);
  });
}

export function captureDebug(
  message: string,
  extraInfo: IExtraInfo,
  isSentryEnabled: boolean = false
): void {
  if (!isSentryEnabled) {
    logToConsole(Severity.Debug, message, extraInfo);
  }
}

export function captureError(
  message: string,
  extraInfo: IExtraInfo,
  isSentryEnabled: boolean = false
): void {
  isSentryEnabled
    ? logToSentry(Severity.Error, message, extraInfo)
    : logToConsole(Severity.Error, message, extraInfo);
}

export function captureInfo(
  message: string,
  extraInfo: IExtraInfo,
  isSentryEnabled: boolean = false
): void {
  isSentryEnabled
    ? logToSentry(Severity.Info, message, extraInfo)
    : logToConsole(Severity.Info, message, extraInfo);
}

export function captureWarn(
  message: string,
  extraInfo: IExtraInfo,
  isSentryEnabled: boolean = false
): void {
  isSentryEnabled
    ? logToSentry(Severity.Warning, message, extraInfo)
    : logToConsole(Severity.Warning, message, extraInfo);
}

export function captureException(
  err: any,
  errInfo: IExtraInfo,
  isSentryEnabled: boolean = false
): void {
  if (isSentryEnabled) {
    Sentry.withScope(scope => {
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
  isSentryEnabled: boolean = false
): void {
  const severity = Severity.fromString('feedback');

  isSentryEnabled
    ? logToSentry(severity, message, extraInfo)
    : logToConsole(severity, message, extraInfo);
}
