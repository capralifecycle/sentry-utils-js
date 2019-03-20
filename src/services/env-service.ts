export enum Environment {
PROD = 'prod',
LOCAL = 'local',
QA = 'qa',
DEV = 'dev',
SYSTEST = 'systest',
DEVTEST = 'devtest',
TEST = 'test',
UNKNOWN = 'unknown'
}

  function isHttps(origin: string): boolean {
    return /^https/.test(origin);
  }

export function getCurrentEnvironment(prodOrigin?: string): Environment {
    const origin = window.location.origin;
    if (!origin) {
      return Environment.UNKNOWN;
    }
  
    if (prodOrigin && isProdEnvironment(origin, prodOrigin)) {
      return Environment.PROD;
    } else if (isLocalEnvironment(origin)) {
      return Environment.LOCAL;
    } else if (containsEnvironmentTag(origin, Environment.QA)) {
      return Environment.QA;
    } else if (containsEnvironmentTag(origin, Environment.DEV)) {
      return Environment.DEV;
    } else if (containsEnvironmentTag(origin, Environment.SYSTEST)) {
      return Environment.SYSTEST;
    } else if (containsEnvironmentTag(origin, Environment.DEVTEST)) {
      return Environment.DEVTEST;
    } else if (containsEnvironmentTag(origin, Environment.TEST)) {
      return Environment.TEST;
    } else {
      return Environment.UNKNOWN;
    }
  }

export function isLocalEnvironment(origin: string): boolean {
    return /^http:\/\/localhost:\d{4,5}$/i.test(origin);
  }
  
  export function isProdEnvironment(origin: string, expectedOrigin: string): boolean {
    return origin.toLowerCase().endsWith(expectedOrigin.toLowerCase());
  }
  
  export function containsEnvironmentTag(origin: string, tag: string): boolean {
    if (!isHttps(origin)) {
      return false;
    }
    const regex = new RegExp(`\/\/.*(-${tag}|${tag}-).*\.`, 'i');
    return regex.test(origin);
  }