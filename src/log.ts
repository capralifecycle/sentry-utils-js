import * as Sentry from "@sentry/browser"
import { SeverityLevel } from "@sentry/browser"

type Tags = Record<string, string>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Extras = Record<string, any>

function logToConsole(
  severity: SeverityLevel,
  message: string,
  tags?: Tags,
  extras?: Extras,
): void {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  console.log(`${severity?.toUpperCase()}: ${message}`, tags, extras)
}

function logToSentry(
  severity: SeverityLevel,
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
    logToConsole("debug", message, tags, extras)
  }
}

export function captureError(
  message: string,
  tags?: Tags,
  extras?: Extras,
  isSentryEnabled = false,
): void {
  isSentryEnabled
    ? logToSentry("error", message, tags, extras)
    : logToConsole("error", message, tags, extras)
}

export function captureInfo(
  message: string,
  tags?: Tags,
  extras?: Extras,
  isSentryEnabled = false,
): void {
  isSentryEnabled
    ? logToSentry("info", message, tags, extras)
    : logToConsole("info", message, tags, extras)
}

export function captureWarn(
  message: string,
  tags?: Tags,
  extras?: Extras,
  isSentryEnabled = false,
): void {
  isSentryEnabled
    ? logToSentry("warning", message, tags, extras)
    : logToConsole("warning", message, tags, extras)
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    logToConsole("log", err, tags, extras)
  }
}

export function captureFeedback(
  message: string,
  tags?: Tags,
  extras?: Extras,
  isSentryEnabled = false,
): void {
  const severity: SeverityLevel = "log"

  isSentryEnabled
    ? logToSentry(severity, message, tags, extras)
    : logToConsole(severity, message, tags, extras)
}
