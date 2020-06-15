import * as Sentry from '@sentry/browser';
import { Severity } from '@sentry/types';
import { captureDebug, captureInfo } from './log';

const mockLogToConsole = jest.fn();
const mockCaptureMessage = jest.spyOn(Sentry, 'captureMessage');

describe('log-service', () => {
  beforeEach(() => {
    global.console = {
      ...global.console,
      log: mockLogToConsole,
    };
  });
  describe('with sentry enabled', () => {
    it('should log to sentry', () => {
      captureInfo('some message', {}, true);
      expect(mockCaptureMessage).toHaveBeenCalledWith(
        'some message',
        Severity.Info
      );
      expect(mockCaptureMessage).toHaveBeenCalledTimes(1);
    });

    it('should not log debug statements', () => {
      captureDebug('some unexpected event happened', {}, true);
      expect(mockLogToConsole).not.toHaveBeenCalled();
      expect(mockCaptureMessage).not.toHaveBeenCalled();
    });

    it('should not log anything to the console', () => {
      captureInfo('some message', {}, true);
      expect(mockLogToConsole).not.toHaveBeenCalled();
    });
  });

  describe('with sentry disabled', () => {
    it('should log to console', () => {
      const message = 'some message';
      captureInfo('some message', { someTag: 'some tag value' }, false);

      expect(mockLogToConsole).toHaveBeenCalledWith(
        `INFO: ${message} - {"someTag":"some tag value"}`
      );
      expect(mockLogToConsole).toHaveBeenCalledTimes(1);
    });

    it('should log debug statements', () => {
      const message = 'some unexpected event happened';
      captureDebug(message, {}, false);

      expect(mockLogToConsole).toHaveBeenCalledWith(`DEBUG: ${message} - {}`);
      expect(mockLogToConsole).toHaveBeenCalledTimes(1);
    });

    it('should not log anything to sentry', () => {
      captureInfo('some message', {}, false);

      expect(mockCaptureMessage).not.toHaveBeenCalled();
    });
  });

  afterEach(() => {
    mockLogToConsole.mockClear();
    mockCaptureMessage.mockClear();
  });
});
