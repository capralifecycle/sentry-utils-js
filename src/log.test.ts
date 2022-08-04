import * as Sentry from "@sentry/browser"
import { captureDebug, captureInfo } from "./log"

const mockLogToConsole = jest.fn()
const mockCaptureMessage = jest.spyOn(Sentry, "captureMessage")

describe("log-service", () => {
  beforeEach(() => {
    global.console = {
      ...global.console,
      log: mockLogToConsole,
    }
  })
  describe("with sentry enabled", () => {
    it("should log to sentry", () => {
      captureInfo("some message", undefined, undefined, true)
      expect(mockCaptureMessage).toHaveBeenCalledWith("some message", "info")
      expect(mockCaptureMessage).toHaveBeenCalledTimes(1)
    })

    it("should not log debug statements", () => {
      captureDebug("some unexpected event happened", undefined, undefined, true)
      expect(mockLogToConsole).not.toHaveBeenCalled()
      expect(mockCaptureMessage).not.toHaveBeenCalled()
    })

    it("should not log anything to the console", () => {
      captureInfo("some message", undefined, undefined, true)
      expect(mockLogToConsole).not.toHaveBeenCalled()
    })
  })

  describe("with sentry disabled", () => {
    it("should log to console", () => {
      const message = "some message"
      captureInfo(
        "some message",
        { someTag: "some tag value" },
        undefined,
        false,
      )

      expect(mockLogToConsole).toHaveBeenCalledWith(
        `INFO: ${message}`,
        {
          someTag: "some tag value",
        },
        undefined,
      )
      expect(mockLogToConsole).toHaveBeenCalledTimes(1)
    })

    it("should log debug statements", () => {
      const message = "some unexpected event happened"
      captureDebug(message, undefined, undefined, false)

      expect(mockLogToConsole).toHaveBeenCalledWith(
        `DEBUG: ${message}`,
        undefined,
        undefined,
      )
      expect(mockLogToConsole).toHaveBeenCalledTimes(1)
    })

    it("should not log anything to sentry", () => {
      captureInfo("some message", undefined, undefined, false)

      expect(mockCaptureMessage).not.toHaveBeenCalled()
    })
  })

  afterEach(() => {
    mockLogToConsole.mockClear()
    mockCaptureMessage.mockClear()
  })
})
