import * as Sentry from "@sentry/browser"
import {
  captureDebug as _captureDebug,
  captureError as _captureError,
  captureException as _captureException,
  captureFeedback as _captureFeedback,
  captureInfo as _captureInfo,
  captureWarn as _captureWarn,
} from "./log"
import makeThrottleByMeanLifetime from "./throttle"

interface InitSentry {
  options: Sentry.BrowserOptions
  buildTime?: string
}

/**
 * Include additional tags in the event. Tags are indexed and searchable.
 */
type Tags = Record<string, string>

interface LogOptions {
  /**
   * Include truly arbitrary data that can be viewed as part of an event.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extras?: Record<string, any>
}

const BUILD_TIME_TAG = "buildTime"

let isSentryEnabled = false

export function initSentry({ options, buildTime }: InitSentry): void {
  const isThrottled = makeThrottleByMeanLifetime(60 * 1000, 4)

  const config: Sentry.BrowserOptions = {
    ...options,
    beforeSend: (event, hint) => {
      if (isThrottled()) {
        return null
      }

      if (options.beforeSend) {
        return options.beforeSend(event, hint)
      }

      return event
    },
  }

  Sentry.init(config)

  if (buildTime) {
    Sentry.configureScope((scope) => {
      scope.setTag(BUILD_TIME_TAG, buildTime)
    })
  }

  isSentryEnabled = true
}

export function captureDebug(
  message: string,
  tags?: Tags,
  options?: LogOptions,
): void {
  _captureDebug(message, tags, options?.extras, isSentryEnabled)
}

export function captureError(
  message: string,
  tags?: Tags,
  options?: LogOptions,
): void {
  _captureError(message, tags, options?.extras, isSentryEnabled)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
export function captureException(
  err: any,
  tags?: Tags,
  options?: LogOptions,
): void {
  _captureException(err, tags, options?.extras, isSentryEnabled)
}

export function captureFeedback(
  message: string,
  tags?: Tags,
  options?: LogOptions,
): void {
  _captureFeedback(message, tags, options?.extras, isSentryEnabled)
}

export function captureInfo(
  message: string,
  tags?: Tags,
  options?: LogOptions,
): void {
  _captureInfo(message, tags, options?.extras, isSentryEnabled)
}

export function captureWarn(
  message: string,
  tags?: Tags,
  options?: LogOptions,
): void {
  _captureWarn(message, tags, options?.extras, isSentryEnabled)
}

/**
 * Put a message in the console letting the developer know that Sentry
 * is not enabled.
 *
 * Only call this if you do not initialize Sentry.
 */
export function reportSentryNotEnabled(): void {
  if (isSentryEnabled) {
    throw new Error(
      "Cannot call reportSentryNotEnabled when Sentry is initialized",
    )
  }

  console.info(
    "Sentry is not enabled. Logs will appear in console. This should only occur locally.",
  )
}
