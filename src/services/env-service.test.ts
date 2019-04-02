import each from 'jest-each';

import {
  containsEnvironmentTag,
  Environment,
  getCurrentEnvironment,
  isLocalEnvironment
} from './env-service';

describe('sentry-util', () => {
  describe('isLocalEnvironment', () => {
    it('should return true for localhost', () => {
      expect(isLocalEnvironment('http://localhost:3000')).toBe(true);
    });
  });

  describe('containsEnvironmentTag', () => {
    each`
        origin                                                | tag       | expectedResult
        ${'https://some-project-qa-webapp.company.xyz'}       | ${'qa'}   | ${true}
        ${'https://some-project-qa-webapp.company.xyz'}       | ${'dev'}  | ${false}
        ${'https://some-project-dev-webapp.company.xyz'}      | ${'dev'}  | ${true}
        ${'https://www.some-project-dev-webapp.company.xyz'}  | ${'dev'}  | ${true}
        ${'https://www.some-project-dev-webapp.company.xyz'}  | ${'abc'}  | ${false}
        ${'https://some-project-webapp-qa.company.xyz'}       | ${'qa'}   | ${true}
        ${'http://some-project-dev-webapp.company.xyz'}       | ${'dev'}  | ${false}
        ${'https://qa-some-project-webapp.company.xyz'}       | ${'qa'}   | ${true}
        ${'http://someqaproject-webapp.company.xyz'}          | ${'qa'}   | ${false}
        ${'http://dev.company.xyz'}                           | ${'dev'}  | ${false}
        ${'https://dev.company.xyz'}                          | ${'dev'}  | ${true}
        ${'https://dev.company.xyz'}                          | ${'qa'}   | ${false}
        ${'https://qa.company.xyz'}                           | ${'qa'}   | ${true}
        ${'https://www.qa.company.xyz'}                       | ${'qa'}   | ${true}
        ${'https://www.dev.company.xyz'}                      | ${'qa'}   | ${false}
      `.it(
      'should return $expectedResult for origin: $origin and tag: $tag',
      ({ origin, tag, expectedResult }: any) => {
        expect(containsEnvironmentTag(origin, tag)).toBe(expectedResult);
      }
    );
  });

  describe('getCurrentEnvironment', () => {
    function setOrigin(origin: string) {
      Object.defineProperty(window, 'location', {
        value: {
          origin
        },
        writable: true
      });
    }

    test('should return "prod" if isProd is true', () => {
      setOrigin('http://some-project-prod-webapp.company.xyz');
      expect(getCurrentEnvironment(true)).toBe(Environment.PROD);
    });

    test('should return "local" if origin is localhost', () => {
      setOrigin('http://localhost:3000');
      expect(getCurrentEnvironment(false)).toBe(Environment.LOCAL);
    });

    test('should return "qa" if origin includes qa-env tag', () => {
      setOrigin('https://some-project-qa-webapp.company.xyz');
      expect(getCurrentEnvironment(false)).toBe(Environment.QA);
    });
  });
});
