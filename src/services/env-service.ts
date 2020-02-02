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

const ELIGIBLE_ENVIRONMENT_TAGS = [
  Environment.DEV,
  Environment.TEST,
  Environment.QA,
  Environment.DEVTEST,
  Environment.SYSTEST
];

function isHttps(origin: string): boolean {
  return /^https/.test(origin);
}

function isOriginWithDashedEnvironmentTag(
  origin: string,
  tag: string
): boolean {
  return new RegExp(`\/\/.*(-${tag}|${tag}-).*\.`, 'i').test(origin);
}

function isOriginWithEnvironmentTag(origin: string, tag: string): boolean {
  return new RegExp(`\/\/(www\.){0,1}${tag}\.`, 'i').test(origin);
}

export function getCurrentEnvironment(isProd: boolean): Environment {
  if (isProd) {
    return Environment.PROD;
  } else if (isLocalEnvironment(window.location.origin)) {
    return Environment.LOCAL;
  }

  const environment = ELIGIBLE_ENVIRONMENT_TAGS.find(tag =>
    containsEnvironmentTag(window.location.origin, tag)
  );

  if (environment) {
    return environment;
  }
  return Environment.UNKNOWN;
}

export function isLocalEnvironment(origin: string): boolean {
  return /^http:\/\/localhost:\d{4,5}$/i.test(origin);
}

export function containsEnvironmentTag(origin: string, tag: string): boolean {
  if (!isHttps(origin)) {
    return false;
  }

  if (isOriginWithDashedEnvironmentTag(origin, tag)) {
    return true;
  }

  return isOriginWithEnvironmentTag(origin, tag);
}