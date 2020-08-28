import * as Sentry from "@sentry/browser"
import { Severity } from "@sentry/types"

type Tags = Record<string, string>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Extras = Record<string, any>

function logToConsole(
  severity: Severity,
  message: string,
  tags?: Tags,
  extras?: Extras,
): void {
  console.log(`${severity.toUpperCase()}: ${message}`, tags, extras)
}

function logToSentry(
  severity: Severity,
  message: string,
  tags?: Tags,
  extras?: Extras,
): void {
  Sentry.withScope((scope) => {
    if (tags) {
      scope.setTags(tags)
    }
    if (extras) {
      scope.setExtras(extras)
    }
    Sentry.captureMessage(message, severity)
  })
}

export function captureDebug(
  message: string,
  tags?: Tags,
  extras?: Extras,
  isSentryEnabled = false,
): void {
  if (!isSentryEnabled) {
    logToConsole(Severity.Debug, message, tags, extras)
  }
}

export function captureError(
  message: string,
  tags?: Tags,
  extras?: Extras,
  isSentryEnabled = false,
): void {
  isSentryEnabled
    ? logToSentry(Severity.Error, message, tags, extras)
    : logToConsole(Severity.Error, message, tags, extras)
}

export function captureInfo(
  message: string,
  tags?: Tags,
  extras?: Extras,
  isSentryEnabled = false,
): void {
  isSentryEnabled
    ? logToSentry(Severity.Info, message, tags, extras)
    : logToConsole(Severity.Info, message, tags, extras)
}

export function captureWarn(
  message: string,
  tags?: Tags,
  extras?: Extras,
  isSentryEnabled = false,
): void {
  isSentryEnabled
    ? logToSentry(Severity.Warning, message, tags, extras)
    : logToConsole(Severity.Warning, message, tags, extras)
}

export function captureException(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
  err: any,
  tags?: Tags,
  extras?: Extras,
  isSentryEnabled = false,
): void {
  if (isSentryEnabled) {
    Sentry.withScope((scope) => {
      if (tags) {
        scope.setTags(tags)
      }
      if (extras) {
        scope.setExtras(extras)
      }
      Sentry.captureException(err)
    })
  } else {
    logToConsole(Severity.fromString("exception"), err, tags, extras)
  }
}

export function captureFeedback(
  message: string,
  tags?: Tags,
  extras?: Extras,
  isSentryEnabled = false,
): void {
  const severity = Severity.fromString("feedback")

  isSentryEnabled
    ? logToSentry(severity, message, tags, extras)
    : logToConsole(severity, message, tags, extras)
}
