import each from 'jest-each';

import {
  isProdEnvironment,
  isLocalEnvironment,
  containsEnvironmentTag
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
      ({
        origin,
        tag,
        expectedResult
      }: {
        origin: string;
        tag: string;
        expectedResult: boolean;
      }) => {
        expect(containsEnvironmentTag(origin, tag)).toBe(expectedResult);
      }
    );
  });

  describe('isProdEnvironment', () => {
    it('should return true if origin matches given url', () => {
      expect(
        isProdEnvironment(
          'https://some-project.company.xyz',
          'some-project.company.xyz'
        )
      ).toBe(true);
    });
  });
});
